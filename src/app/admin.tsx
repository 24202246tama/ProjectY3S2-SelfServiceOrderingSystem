import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { ACTIVE_STATUSES, TABLE_COUNT } from '@/constants/config';
import { colors, radius, spacing } from '@/constants/theme';
import { useMenu } from '@/context/MenuContext';
import { useOrders } from '@/context/OrdersContext';
import { formatPrice, formatTime } from '@/lib/format';
import { tableQrPayload } from '@/lib/qr';
import type { Order } from '@/types';

type Tab = 'overview' | 'orders' | 'menu' | 'tables';

const TABS: { value: Tab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'orders', label: 'Orders' },
  { value: 'menu', label: 'Menu' },
  { value: 'tables', label: 'Tables' },
];

function isToday(timestamp: number): boolean {
  return new Date(timestamp).toDateString() === new Date().toDateString();
}

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <View style={styles.screen}>
      <View style={styles.tabs}>
        {TABS.map((item) => {
          const selected = item.value === tab;
          return (
            <Pressable
              key={item.value}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setTab(item.value)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        {tab === 'overview' ? <Overview /> : null}
        {tab === 'orders' ? <OrdersTab /> : null}
        {tab === 'menu' ? <MenuTab /> : null}
        {tab === 'tables' ? <TablesTab /> : null}
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Overview() {
  const { orders } = useOrders();
  const { items } = useMenu();

  const today = orders.filter((order) => isToday(order.createdAt));
  const completed = today.filter((order) => order.status !== 'cancelled');
  const revenue = completed.reduce((sum, order) => sum + order.total, 0);
  const active = orders.filter((order) => ACTIVE_STATUSES.includes(order.status)).length;
  const soldOut = items.filter((item) => !item.available).length;

  const popularity = new Map<string, number>();
  for (const order of completed) {
    for (const item of order.items) popularity.set(item.name, (popularity.get(item.name) ?? 0) + item.quantity);
  }
  const topItems = [...popularity.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <View style={styles.gap}>
      <View style={styles.statsGrid}>
        <StatCard label="Orders today" value={String(today.length)} />
        <StatCard label="Revenue today" value={formatPrice(revenue)} />
        <StatCard label="Active orders" value={String(active)} />
        <StatCard label="Avg. order" value={formatPrice(completed.length ? revenue / completed.length : 0)} />
      </View>
      {soldOut > 0 ? (
        <Text style={styles.alert}>
          {soldOut} menu {soldOut === 1 ? 'item is' : 'items are'} marked sold out.
        </Text>
      ) : null}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top sellers today</Text>
        {topItems.length === 0 ? (
          <Text style={styles.muted}>No sales yet today.</Text>
        ) : (
          topItems.map(([name, quantity]) => (
            <View key={name} style={styles.row}>
              <Text style={styles.rowLabel}>{name}</Text>
              <Text style={styles.rowValue}>{quantity} sold</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

function OrdersTab() {
  const { orders, updateStatus, clearOrders } = useOrders();
  const [confirmClear, setConfirmClear] = useState(false);

  if (orders.length === 0) return <Text style={styles.muted}>No orders yet.</Text>;

  const renderOrder = (order: Order) => {
    const isActive = ACTIVE_STATUSES.includes(order.status);
    return (
      <View key={order.id} style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>
            #{order.code} · Table {order.tableNumber}
          </Text>
          <StatusBadge status={order.status} />
        </View>
        <Text style={styles.muted}>
          {order.customerName} · {formatTime(order.createdAt)} · {order.paymentMethod === 'card' ? 'Card' : 'Cash'}
        </Text>
        <Text style={styles.rowLabel}>
          {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
        </Text>
        <View style={styles.row}>
          <Text style={styles.rowValue}>{formatPrice(order.total)}</Text>
          {isActive ? (
            <View style={styles.inlineActions}>
              <Button title="Served" size="sm" variant="secondary" onPress={() => updateStatus(order.id, 'served')} />
              <Button title="Cancel" size="sm" variant="danger" onPress={() => updateStatus(order.id, 'cancelled')} />
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.gap}>
      {orders.map(renderOrder)}
      {confirmClear ? (
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Delete all {orders.length} orders? This cannot be undone.</Text>
          <View style={styles.inlineActions}>
            <Button
              title="Delete all"
              size="sm"
              variant="danger"
              onPress={() => {
                clearOrders();
                setConfirmClear(false);
              }}
            />
            <Button title="Keep" size="sm" variant="secondary" onPress={() => setConfirmClear(false)} />
          </View>
        </View>
      ) : (
        <Button title="Clear order history" variant="ghost" onPress={() => setConfirmClear(true)} />
      )}
    </View>
  );
}

function MenuTab() {
  const { items, toggleAvailability, resetAvailability } = useMenu();
  return (
    <View style={styles.gap}>
      <View style={styles.card}>
        {items.map((item) => (
          <View key={item.id} style={styles.menuRow}>
            <Text style={styles.menuEmoji}>{item.emoji}</Text>
            <View style={styles.menuBody}>
              <Text style={styles.rowLabel}>{item.name}</Text>
              <Text style={styles.muted}>
                {item.category} · {item.price > 0 ? formatPrice(item.price) : 'Price not set'}
              </Text>
            </View>
            <Switch
              value={item.available}
              onValueChange={() => toggleAvailability(item.id)}
              disabled={item.price === 0}
              trackColor={{ true: colors.success, false: colors.border }}
              accessibilityLabel={`${item.name} available`}
            />
          </View>
        ))}
      </View>
      <Button title="Mark everything available" variant="secondary" onPress={resetAvailability} />
    </View>
  );
}

function TablesTab() {
  const tables = Array.from({ length: TABLE_COUNT }, (_, index) => index + 1);
  return (
    <View style={styles.gap}>
      <Text style={styles.muted}>
        Encode each payload below into a QR code (any QR generator works) and place it on the matching table. Scanning
        it with the in-app scanner or the phone camera opens the menu for that table.
      </Text>
      <View style={styles.card}>
        {tables.map((table) => (
          <View key={table} style={styles.row}>
            <Text style={styles.rowLabel}>Table {table}</Text>
            <Text selectable style={styles.payload}>
              {tableQrPayload(table)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabSelected: { borderBottomColor: colors.primary },
  tabLabel: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  tabLabelSelected: { color: colors.primary },
  content: { padding: spacing.lg },
  gap: { gap: spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 13, color: colors.textMuted },
  alert: {
    color: colors.warning,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, flexShrink: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  rowLabel: { fontSize: 15, color: colors.text, flexShrink: 1 },
  rowValue: { fontSize: 15, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
  muted: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  inlineActions: { flexDirection: 'row', gap: spacing.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs },
  menuEmoji: { fontSize: 26 },
  menuBody: { flex: 1 },
  payload: { fontSize: 13, color: colors.textMuted, fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), flexShrink: 1 },
});
