import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label?: string;
}

export function QuantityStepper({ quantity, onIncrement, onDecrement, label = 'item' }: QuantityStepperProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove one ${label}`}
        hitSlop={8}
        onPress={onDecrement}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.symbol}>−</Text>
      </Pressable>
      <Text style={styles.quantity} accessibilityLabel={`${quantity} in cart`}>
        {quantity}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add one ${label}`}
        hitSlop={8}
        onPress={onIncrement}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.symbol}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
  },
  button: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  symbol: { fontSize: 20, fontWeight: '700', color: colors.primary },
  quantity: { minWidth: 22, textAlign: 'center', fontSize: 16, fontWeight: '700', color: colors.text },
});
