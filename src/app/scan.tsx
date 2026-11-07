import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors, radius, spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { parseTableNumber } from '@/lib/qr';

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  // `next=back` returns to the calling screen (e.g. checkout) instead of opening the menu.
  const { next } = useLocalSearchParams<{ next?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const { setTableNumber } = useCart();
  const [error, setError] = useState<string | null>(null);
  // onBarcodeScanned fires many times per second; a ref blocks duplicate
  // handling before React has re-rendered.
  const handledRef = useRef(false);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <EmptyState
        emoji="📷"
        title="Camera access needed"
        message="We use the camera only to read the QR code on your table."
      >
        {permission.canAskAgain ? (
          <Button title="Allow camera" onPress={requestPermission} />
        ) : (
          <Text style={styles.hint}>Camera access is turned off. Enable it in your device settings.</Text>
        )}
        <Button title="Enter table number instead" variant="secondary" onPress={() => router.back()} />
      </EmptyState>
    );
  }

  const handleScan = ({ data }: BarcodeScanningResult) => {
    if (handledRef.current) return;
    const table = parseTableNumber(data);
    if (!table) {
      setError('That QR code is not a table code. Try the code printed on your table.');
      return;
    }
    handledRef.current = true;
    setTableNumber(table);
    if (next === 'back' && router.canGoBack()) router.back();
    else router.replace('/menu');
  };

  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleScan}
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <Text style={styles.instructions}>Point your camera at the QR code on your table</Text>
        <View style={styles.frame} />
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.xxl },
  instructions: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 4,
  },
  frame: { width: 250, height: 250, borderWidth: 3, borderColor: '#fff', borderRadius: radius.lg },
  footer: { alignSelf: 'stretch', paddingHorizontal: spacing.lg, gap: spacing.md },
  error: {
    color: '#fff',
    backgroundColor: 'rgba(201,42,42,0.9)',
    padding: spacing.md,
    borderRadius: radius.md,
    textAlign: 'center',
    overflow: 'hidden',
  },
  hint: { color: colors.textMuted, textAlign: 'center' },
});
