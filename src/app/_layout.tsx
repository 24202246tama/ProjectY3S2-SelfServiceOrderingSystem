import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { CartProvider } from '@/context/CartContext';
import { MenuProvider } from '@/context/MenuContext';
import { OrdersProvider } from '@/context/OrdersContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <OrdersProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                headerTitleStyle: { fontWeight: '700' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="scan" options={{ title: 'Scan Table QR' }} />
              <Stack.Screen name="menu" options={{ title: 'Menu' }} />
              <Stack.Screen name="cart" options={{ title: 'Your Cart' }} />
              <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
              <Stack.Screen name="order/[id]" options={{ title: 'Order Status' }} />
              <Stack.Screen name="admin" options={{ title: 'Admin Dashboard' }} />
              <Stack.Screen name="kitchen" options={{ title: 'Kitchen Dashboard' }} />
              <Stack.Screen name="table/[number]" options={{ headerShown: false }} />
            </Stack>
          </CartProvider>
        </OrdersProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
}
