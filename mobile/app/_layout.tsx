import 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../src/stores/authStore';

export default function RootLayout() {
  const { isAuthenticated, loading, hydrate } = useAuthStore();
  const [checkedOnboarding, setCheckedOnboarding] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const seen = await SecureStore.getItemAsync('hasSeenOnboarding');
      setHasOnboarded(seen === 'true');
      await hydrate();
      setCheckedOnboarding(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!checkedOnboarding) return;
    if (!hasOnboarded) {
      router.replace('/onboarding');
      return;
    }
    if (!loading) {
      if (!isAuthenticated) router.replace('/login');
      else router.replace('/');
    }
  }, [checkedOnboarding, hasOnboarded, isAuthenticated, loading]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
