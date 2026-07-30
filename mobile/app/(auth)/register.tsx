import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { colors, spacing } from '../../src/constants/theme';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuthStore();

  const handleRegister = async () => {
    if (submitting) return;
    
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    try {
      setSubmitting(true);
      await register(email, password, name);
      router.replace('/');
    } catch {
      console.error('Registration error', arguments);
      Alert.alert('Registration failed', 'Please check your network or try a different email.');
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Join the crew</Text>
        </View>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Register now and unlock a vibrant task planner with deadlines and priorities.</Text>
        <TextInput style={styles.input} placeholder="Name (optional)" placeholderTextColor={colors.muted} value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.muted} value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm password" placeholderTextColor={colors.muted} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleRegister} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Creating...' : 'Register'}</Text>
        </Pressable>
        <Link href="/login" style={styles.link}>Already have an account?</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: colors.background, padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: 32, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, shadowColor: colors.muted, shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.accent2, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginBottom: spacing.lg },
  badgeText: { color: '#fff', fontWeight: '700' },
  title: { fontSize: 32, fontWeight: '900', color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 16, color: colors.muted, marginBottom: spacing.lg, lineHeight: 24 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.md, marginBottom: spacing.md, fontSize: 16, color: colors.text, backgroundColor: '#FFFFFF' },
  button: { backgroundColor: colors.secondary, paddingVertical: spacing.md, borderRadius: 18, alignItems: 'center', marginTop: spacing.sm, shadowColor: colors.secondary, shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { marginTop: spacing.md, alignSelf: 'center', color: colors.accent, fontWeight: '700' }
});
