import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { OrderSummary } from '@/components/OrderSummary';
import { colors, radius, spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { formatPrice } from '@/lib/format';
import type { PaymentMethod } from '@/types';

const PAYMENT_OPTIONS: { value: PaymentMethod; title: string; description: string }[] = [
  { value: 'card', title: '💳  Card at table', description: 'A server brings the card reader with your food' },
  { value: 'cash', title: '💵  Cash at counter', description: 'Pay at the front counter when you leave' },
];

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { tableNumber, items, subtotal, tax, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  if (items.length === 0) {
    return (
      <EmptyState emoji="🛒" title="Nothing to check out" message="Your cart is empty.">
        <Button title="Browse menu" onPress={() => router.replace('/menu')} />
      </EmptyState>
    );
  }

  const canSubmit = tableNumber !== null && customerName.trim().length > 0;

  const submit = () => {
    if (tableNumber === null || !canSubmit) return;
    const order = placeOrder({
      tableNumber,
      customerName: customerName.trim(),
      notes: notes.trim(),
      paymentMethod,
      items,
      subtotal,
      tax,
      total,
    });
    clearCart();
    router.dismissTo('/');
    router.push({ pathname: '/order/[id]', params: { id: order.id } });
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>Table</Text>
          {tableNumber !== null ? (
            <View style={styles.tableRow}>
              <Text style={styles.tableValue}>Table {tableNumber}</Text>
              <Button title="Change" variant="ghost" size="sm" onPress={() => router.push({ pathname: '/scan', params: { next: 'back' } })} />
            </View>
          ) : (
            <View style={styles.gap}>
              <Text style={styles.warning}>Scan your table QR code so we know where to bring your order.</Text>
              <Button title="Scan table QR" variant="secondary" onPress={() => router.push({ pathname: '/scan', params: { next: 'back' } })} />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Your name</Text>
          <TextInput
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="So we can call you"
            placeholderTextColor={colors.textMuted}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            maxLength={40}
            style={styles.input}
          />
          <Text style={styles.label}>Notes for the kitchen</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Allergies, no onions, extra spicy…"
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={200}
            style={[styles.input, styles.multiline]}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Payment</Text>
          {PAYMENT_OPTIONS.map((option) => {
            const selected = option.value === paymentMethod;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setPaymentMethod(option.value)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <View style={[styles.radio, selected && styles.radioSelected]} />
                <View style={styles.optionBody}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Order summary</Text>
          <OrderSummary items={items} subtotal={subtotal} tax={tax} total={total} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button title={`Place order · ${formatPrice(total)}`} onPress={submit} disabled={!canSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  gap: { gap: spacing.sm },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  tableRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tableValue: { fontSize: 20, fontWeight: '800', color: colors.primary },
  warning: { fontSize: 14, color: colors.warning },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border },
  radioSelected: { borderColor: colors.primary, borderWidth: 6 },
  optionBody: { flex: 1, gap: 2 },
  optionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  optionDescription: { fontSize: 13, color: colors.textMuted },
  footer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
