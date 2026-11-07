import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

interface EmptyStateProps {
  emoji: string;
  title: string;
  message?: string;
  children?: ReactNode;
}

export function EmptyState({ emoji, title, message, children }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.sm },
  emoji: { fontSize: 48 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  message: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 21 },
  actions: { marginTop: spacing.lg, alignSelf: 'stretch', gap: spacing.sm },
});
