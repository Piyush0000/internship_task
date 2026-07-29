import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { colors, spacing } from '../src/constants/theme';

const steps = [
  {
    title: 'Welcome to Todo Magic',
    description: 'A colorful task manager with smart authentication, priorities, and deadlines.',
    accent: colors.accent
  },
  {
    title: 'Create tasks fast',
    description: 'Add titles, descriptions, deadlines, and priorities in one tap.',
    accent: colors.secondary
  },
  {
    title: 'Stay on track',
    description: 'Mark tasks completed, delete what is done, and keep your day organized.',
    accent: colors.accent2
  }
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);

  const handleNext = async () => {
    if (index < steps.length - 1) {
      setIndex(index + 1);
      return;
    }
    await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.hero, { backgroundColor: steps[index].accent }]}> 
        <Text style={styles.heroTitle}>{steps[index].title}</Text>
        <Text style={styles.heroSubtitle}>{steps[index].description}</Text>
      </View>
      <View style={styles.dotsRow}>
        {steps.map((_, dotIndex) => (
          <View key={dotIndex} style={[styles.dot, index === dotIndex && { backgroundColor: colors.text, width: 24 }]} />
        ))}
      </View>
      <View style={styles.controlCard}>
        <Text style={styles.controlText}>Swipe through the quick tour and start building your best day.</Text>
        <Pressable style={[styles.button, { backgroundColor: steps[index].accent }]} onPress={handleNext}>
          <Text style={styles.buttonText}>{index === steps.length - 1 ? 'Get Started' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: spacing.lg },
  hero: { flex: 1, borderRadius: 32, padding: spacing.xl, justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 30, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
  heroTitle: { color: colors.text, fontSize: 32, fontWeight: '900', marginBottom: spacing.md },
  heroSubtitle: { color: '#E2E8F0', fontSize: 18, lineHeight: 28 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: spacing.lg },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#64748B' },
  controlCard: { backgroundColor: colors.surface, borderRadius: 28, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  controlText: { color: colors.muted, fontSize: 16, marginBottom: spacing.lg },
  button: { paddingVertical: spacing.md, borderRadius: 18, alignItems: 'center' },
  buttonText: { color: colors.text, fontSize: 16, fontWeight: '800' }
});