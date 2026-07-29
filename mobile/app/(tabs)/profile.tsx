import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Image, Alert, ScrollView, Animated, Easing } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useAuthStore, updateProfile } from '../../src/stores/authStore';
import { useTaskStore } from '../../src/stores/taskStore';
import { colors, spacing } from '../../src/constants/theme';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://internship-task-7bqo.onrender.com';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);
  const avatarScale = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setAvatarUrl(user?.avatarUrl ?? '');
  }, [user]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(avatarScale, { toValue: 1.04, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(avatarScale, { toValue: 1, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true })
      ])
    ).start();
  }, [avatarScale]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile({ name, email, avatarUrl });
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Save failed', err?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    try {
      console.log('Starting image pick...');
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert('Permission required', 'Allow access to your photo library to choose an avatar.');
      
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (result.canceled) return;
      
      const localUri = result.assets?.[0]?.uri;
      if (!localUri) return;
      
      console.log('Image selected:', localUri);
      const filename = localUri.split('/').pop() || 'avatar.jpg';
      const match = /\.([0-9a-z]+)(?:[?#]|$)/i.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      const form = new FormData();
      // @ts-ignore
      form.append('avatar', { uri: localUri, name: filename, type });
      
      const token = (useAuthStore.getState().token) as string;
      console.log('Uploading to:', `${API_URL}/api/auth/avatar`);
      
      const response = await axios.post(`${API_URL}/api/auth/avatar`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Upload response:', response.data);
      const updatedUrl = response.data.avatarUrl || response.data.user?.avatarUrl;
      setAvatarUrl(updatedUrl);
      useAuthStore.setState({ user: response.data.user });
      Alert.alert('Success', 'Avatar uploaded successfully!');
    } catch (err: any) {
      console.error('Image upload error:', err);
      Alert.alert('Upload failed', err?.response?.data?.message || err?.message || 'Unable to upload the selected avatar.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <View style={styles.heroAccent} />
        <View style={styles.heroCircle} />
        <Text style={styles.heading}>Your profile</Text>
        <Text style={styles.subheading}>Manage your details with a calm, professional layout.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Animated.View style={[styles.avatarRing, { borderColor: colors.primarySoft, transform: [{ scale: avatarScale }] }]}> 
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarEmpty}>
                <Text style={styles.avatarEmptyText}>{name?.charAt(0).toUpperCase() || 'A'}</Text>
              </View>
            )}
          </Animated.View>

          <View style={styles.profileInfo}>
            <Text style={styles.nameTag}>{name || 'Your name'}</Text>
            <Text style={styles.emailTag}>{email || user?.email || 'No email set'}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Professional</Text>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Full name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Jane Doe" placeholderTextColor={colors.muted} />

          <Text style={styles.label}>Email address</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={colors.muted} />

          <Pressable style={[styles.button, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving}>
            <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save profile'}</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={handlePickImage}>
            <Text style={styles.secondaryText}>Change avatar</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.logoutButton]} onPress={() => {
            useTaskStore.getState().clearTasks();
            logout();
          }}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background, padding: spacing.lg, paddingBottom: spacing.xl },
  hero: { backgroundColor: '#1D4ED8', borderRadius: 28, padding: spacing.lg, marginBottom: spacing.lg, overflow: 'hidden' },
  heroAccent: { position: 'absolute', top: 0, left: 0, width: 80, height: 6, backgroundColor: colors.accent },
  heading: { color: '#fff', fontSize: 30, fontWeight: '800', marginBottom: 8 },
  subheading: { color: '#DBEAFE', fontSize: 16, lineHeight: 24, maxWidth: '80%' },
  heroCircle: { position: 'absolute', right: -34, top: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.12)' },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: spacing.lg, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#0F172A', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg },
  avatarRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 0, backgroundColor: '#fff' },
  avatar: { width: 104, height: 104, borderRadius: 52 },
  avatarEmpty: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.primarySoft, justifyContent: 'center', alignItems: 'center' },
  avatarEmptyText: { color: colors.primary, fontSize: 32, fontWeight: '800' },
  profileInfo: { flex: 1, justifyContent: 'center' },
  nameTag: { color: colors.text, fontSize: 22, fontWeight: '800' },
  emailTag: { color: colors.muted, fontSize: 14, marginTop: 4 },
  statusBadge: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  statusText: { color: colors.primary, fontWeight: '700' },
  formSection: { marginTop: spacing.sm },
  label: { color: colors.muted, marginBottom: 8, marginTop: spacing.md, fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.md, fontSize: 16, color: colors.text, backgroundColor: colors.primarySoft },
  button: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: 18, alignItems: 'center', marginTop: spacing.lg, shadowColor: colors.primary, shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: { marginTop: spacing.md, paddingVertical: spacing.md, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: colors.primary, backgroundColor: '#fff' },
  secondaryText: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  logoutButton: { backgroundColor: '#EF4444', marginTop: spacing.md },
  logoutText: { color: '#fff', fontWeight: '700' }
});
