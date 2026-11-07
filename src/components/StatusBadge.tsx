import { StyleSheet, Text, View } from 'react-native';

import { STATUS_LABELS } from '@/constants/config';
import { radius, statusColors } from '@/constants/theme';
import type { OrderStatus } from '@/types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const palette = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.fg }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});
