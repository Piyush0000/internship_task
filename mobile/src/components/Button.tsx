import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

export default function Button({ children, onPress, disabled }: { children: React.ReactNode; onPress?: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, disabled && styles.disabled]} disabled={disabled}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: 12, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '700' },
  disabled: { opacity: 0.6 }
});
