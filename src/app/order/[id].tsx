import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { OrderSummary } from '@/components/OrderSummary';
import { StatusBadge } from '@/components/StatusBadge';
import { STATUS_FLOW, STATUS_LABELS } from '@/constants/config';
import { colors, radius, spacing } from '@/constants/theme';
import { useOrders } from '@/context/OrdersContext';
import { formatElapsed, formatTime } from '@/lib/format';
import { useNow } from '@/lib/use-now';
import type { OrderStatus } from '@/types';

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  pending: 'The kitchen has received your order.',
  preparing: 'Our chefs are preparing your food.',
  ready: 'Your order is ready and on its way to your table!',
  served: 'Enjoy your meal!',
  cancelled: 'This order was cancelled. Please ask a member of staff for help.',
};

export default function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, hydrated } = useOrders();
  const now = useNow();
  const order = getOrder(id ?? '');

  if (!order) {
    if (!hydrated) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }
    return (
      <EmptyState emoji="🔎" title="Order not found" message="This order may have been cleared by staff.">
        <Button title="Back to home" onPress={() => router.dismissTo('/')} />
      </EmptyState>
    );
  }

  const currentStep = STATUS_FLOW.indexOf(order.status);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <View style={styles.header}>
        <Text style={styles.code}>Order #{order.code}</Text>
        <Text style={styles.meta}>
          Table {order.tableNumber} · placed {formatTime(order.createdAt)} ({formatElapsed(order.createdAt, now)})
        </Text>
        <StatusBadge status={order.status} />
        <Text style={styles.message}>{STATUS_MESSAGES[order.status]}</Text>
      </View>

      {order.status !== 'cancelled' ? (
        <View style={styles.card}>
          {STATUS_FLOW.map((status, index) => {
            const done = index <= currentStep;
            const isLast = index === STATUS_FLOW.length - 1;
            return (
              <View key={status} style={styles.step}>
                <View style={styles.stepIndicator}>
                  <View style={[styles.dot, done && styles.dotDone, index === currentStep && styles.dotCurrent]}>
                    {done ? <Text style={styles.check}>✓</Text> : null}
                  </View>
                  {!isLast ? <View style={[styles.line, index < currentStep && styles.lineDone]} /> : null}
                </View>
                <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{STATUS_LABELS[status]}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Items</Text>
        <OrderSummary items={order.items} subtotal={order.subtotal} tax={order.tax} total={order.total} />
        {order.notes ? <Text style={styles.notes}>Note: {order.notes}</Text> : null}
        <Text style={styles.payment}>
          Payment: {order.paymentMethod === 'card' ? 'Card at table' : 'Cash at counter'}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button title="Order more" onPress={() => router.push('/menu')} />
        <Button title="Back to home" variant="secondary" onPress={() => router.dismissTo('/')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.lg, gap: spacing.lg },
  header: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  code: { fontSize: 28, fontWeight: '800', color: colors.text },
  meta: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  message: { fontSize: 16, color: colors.text, textAlign: 'center', marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  step: { flexDirection: 'row', gap: spacing.md },
  stepIndicator: { alignItems: 'center' },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotCurrent: { borderColor: colors.successSoft, borderWidth: 3 },
  check: { color: '#fff', fontSize: 13, fontWeight: '800' },
  line: { width: 2, height: 26, backgroundColor: colors.border },
  lineDone: { backgroundColor: colors.success },
  stepLabel: { fontSize: 16, color: colors.textMuted, paddingTop: 2 },
  stepLabelDone: { color: colors.text, fontWeight: '700' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  notes: { fontSize: 14, color: colors.text, fontStyle: 'italic', marginTop: spacing.sm },
  payment: { fontSize: 14, color: colors.textMuted },
  actions: { gap: spacing.sm },
});
