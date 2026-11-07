import { SectionList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors, radius, spacing, statusColors } from '@/constants/theme';
import { useOrders } from '@/context/OrdersContext';
import { formatElapsed, minutesSince } from '@/lib/format';
import { useNow } from '@/lib/use-now';
import type { Order, OrderStatus } from '@/types';

/** Orders waiting longer than this are highlighted for the kitchen. */
const LATE_AFTER_MINUTES = 15;

const SECTIONS: { status: OrderStatus; title: string; action: string; next: OrderStatus }[] = [
  { status: 'pending', title: 'New orders', action: 'Start preparing', next: 'preparing' },
  { status: 'preparing', title: 'In progress', action: 'Mark ready', next: 'ready' },
  { status: 'ready', title: 'Ready to serve', action: 'Mark served', next: 'served' },
];

export default function KitchenScreen() {
  const { orders, updateStatus } = useOrders();
  const now = useNow();

  const sections = SECTIONS.map((section) => ({
    ...section,
    // Oldest first so the kitchen works in arrival order.
    data: orders.filter((order) => order.status === section.status).sort((a, b) => a.createdAt - b.createdAt),
  })).filter((section) => section.data.length > 0);

  if (sections.length === 0) {
    return <EmptyState emoji="👨‍🍳" title="No active orders" message="New orders will appear here as soon as guests place them." />;
  }

  const renderOrder = (order: Order, action: string, next: OrderStatus) => {
    const late = minutesSince(order.createdAt, now) >= LATE_AFTER_MINUTES && order.status !== 'ready';
    return (
      <View style={[styles.card, late && styles.cardLate]}>
        <View style={styles.cardHeader}>
          <Text style={styles.table}>Table {order.tableNumber}</Text>
          <Text style={[styles.elapsed, late && styles.elapsedLate]}>{formatElapsed(order.createdAt, now)}</Text>
        </View>
        <Text style={styles.meta}>
          #{order.code} · {order.customerName}
        </Text>
        <View style={styles.items}>
          {order.items.map((item) => (
            <Text key={item.itemId} style={styles.item}>
              <Text style={styles.quantity}>{item.quantity}×</Text> {item.name}
            </Text>
          ))}
        </View>
        {order.notes ? <Text style={styles.notes}>⚠️ {order.notes}</Text> : null}
        <Button title={action} onPress={() => updateStatus(order.id, next)} />
      </View>
    );
  };

  return (
    <SectionList
      style={styles.screen}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={(order) => order.id}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: statusColors[section.status].fg }]} />
          <Text style={styles.sectionTitle}>
            {section.title} ({section.data.length})
          </Text>
        </View>
      )}
      renderItem={({ item, section }) => renderOrder(item, section.action, section.next)}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.md },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  separator: { height: spacing.md },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardLate: { borderColor: colors.danger, borderWidth: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  table: { fontSize: 22, fontWeight: '800', color: colors.text },
  elapsed: { fontSize: 14, color: colors.textMuted },
  elapsedLate: { color: colors.danger, fontWeight: '700' },
  meta: { fontSize: 14, color: colors.textMuted },
  items: { gap: 4, paddingVertical: spacing.xs },
  item: { fontSize: 17, color: colors.text },
  quantity: { fontWeight: '800', color: colors.primary },
  notes: {
    fontSize: 14,
    color: colors.warning,
    backgroundColor: colors.warningSoft,
    padding: spacing.sm,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
