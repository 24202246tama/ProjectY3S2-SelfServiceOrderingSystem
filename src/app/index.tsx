import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { ACTIVE_STATUSES, MAX_TABLE_NUMBER, RESTAURANT_NAME } from '@/constants/config';
import { colors, radius, spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { formatPrice } from '@/lib/format';
import { parseTableNumber } from '@/lib/qr';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { tableNumber, setTableNumber, itemCount } = useCart();
  const { orders } = useOrders();
  const [manualTable, setManualTable] = useState('');
  const [error, setError] = useState<string | null>(null);

  const activeOrders = orders.filter(
    (order) => order.tableNumber === tableNumber && ACTIVE_STATUSES.includes(order.status),
  );

  const startManual = () => {
    const parsed = parseTableNumber(manualTable);
    if (!parsed) {
      setError(`Enter a table number between 1 and ${MAX_TABLE_NUMBER}.`);
      return;
    }
    setError(null);
    setTableNumber(parsed);
    setManualTable('');
    router.push('/menu');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🍽️</Text>
        <Text style={styles.title}>{RESTAURANT_NAME}</Text>
        <Text style={styles.subtitle}>Scan the QR code on your table to browse the menu and order without waiting.</Text>
      </View>

      {tableNumber ? (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>You are seated at</Text>
          <Text style={styles.tableNumber}>Table {tableNumber}</Text>
          <Button title={itemCount > 0 ? `Continue ordering (${itemCount} in cart)` : 'Browse menu'} onPress={() => router.push('/menu')} />
          <Button title="Change table" variant="ghost" size="sm" onPress={() => router.push('/scan')} />
        </View>
      ) : (
        <View style={styles.card}>
          <Button title="📷  Scan table QR code" onPress={() => router.push('/scan')} />
          <Text style={styles.divider}>or enter your table number</Text>
          <View style={styles.manualRow}>
            <TextInput
              value={manualTable}
              onChangeText={(text) => setManualTable(text.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 12"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              returnKeyType="go"
              onSubmitEditing={startManual}
              maxLength={3}
              style={styles.input}
              accessibilityLabel="Table number"
            />
            <Button title="Start" variant="secondary" onPress={startManual} disabled={!manualTable} />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}

      {activeOrders.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your orders</Text>
          {activeOrders.map((order) => (
            <Link key={order.id} href={{ pathname: '/order/[id]', params: { id: order.id } }} asChild>
              <Pressable style={({ pressed }) => [styles.orderRow, pressed && styles.pressed]}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderCode}>Order #{order.code}</Text>
                  <Text style={styles.orderMeta}>{formatPrice(order.total)}</Text>
                </View>
                <StatusBadge status={order.status} />
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Staff</Text>
        <View style={styles.staffRow}>
          <Link href="/kitchen" asChild>
            <Pressable style={({ pressed }) => [styles.staffCard, pressed && styles.pressed]}>
              <Text style={styles.staffEmoji}>👨‍🍳</Text>
              <Text style={styles.staffLabel}>Kitchen</Text>
            </Pressable>
          </Link>
          <Link href="/admin" asChild>
            <Pressable style={({ pressed }) => [styles.staffCard, pressed && styles.pressed]}>
              <Text style={styles.staffEmoji}>📊</Text>
              <Text style={styles.staffLabel}>Admin</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, gap: spacing.xl, width: '100%', maxWidth: 560, alignSelf: 'center' },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  heroEmoji: { fontSize: 56 },
  title: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  tableNumber: { fontSize: 32, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  divider: { textAlign: 'center', color: colors.textMuted, fontSize: 13 },
  manualRow: { flexDirection: 'row', gap: spacing.sm },
  input: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 18,
    color: colors.text,
    backgroundColor: colors.background,
  },
  error: { color: colors.danger, fontSize: 14 },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderInfo: { gap: 2 },
  orderCode: { fontSize: 16, fontWeight: '700', color: colors.text },
  orderMeta: { fontSize: 14, color: colors.textMuted },
  staffRow: { flexDirection: 'row', gap: spacing.md },
  staffCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  staffEmoji: { fontSize: 28 },
  staffLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  pressed: { opacity: 0.7 },
});
