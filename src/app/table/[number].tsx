import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { parseTableNumber } from '@/lib/qr';

/**
 * Deep-link target for printed table QR codes (`selfservicesystem://table/5`),
 * so scanning with the phone's own camera app opens straight into the menu.
 */
export default function TableDeepLinkScreen() {
  const { number } = useLocalSearchParams<{ number: string }>();
  const { setTableNumber } = useCart();

  useEffect(() => {
    const table = parseTableNumber(number ?? '');
    if (table) {
      setTableNumber(table);
      router.replace('/menu');
    } else {
      router.replace('/');
    }
    // setTableNumber is recreated each render; only re-run when the link changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
