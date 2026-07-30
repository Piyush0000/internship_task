import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { colors, spacing } from '../../src/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await login(email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert('Login failed', 'Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Todo Galaxy</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Login to your neon workspace and stay on top of every deadline.</Text>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.muted} value={password} onChangeText={setPassword} secureTextEntry />

        <Pressable style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </Pressable>

        <Link href="/register" style={styles.link}>Create an account</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: colors.background, padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: 32, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, shadowColor: colors.muted, shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.accent, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginBottom: spacing.lg },
  badgeText: { color: '#fff', fontWeight: '700' },
  title: { fontSize: 32, fontWeight: '900', color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 16, color: colors.muted, marginBottom: spacing.lg, lineHeight: 24 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.md, marginBottom: spacing.md, fontSize: 16, color: colors.text, backgroundColor: '#FFFFFF' },
  button: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: 18, alignItems: 'center', marginTop: spacing.sm, shadowColor: colors.primary, shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { marginTop: spacing.md, alignSelf: 'center', color: colors.accent2, fontWeight: '700' }
});
