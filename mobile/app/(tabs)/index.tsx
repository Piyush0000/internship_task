import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { useAuthStore } from '../../src/stores/authStore';
import { useTaskStore } from '../../src/stores/taskStore';
import { colors, spacing } from '../../src/constants/theme';

export default function TasksScreen() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, filters, setFilter } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDateTime, setDueDateTime] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const visibleTasks = tasks.filter((task) => {
    if (filters === 'pending') return task.status === 'pending';
    if (filters === 'completed') return task.status === 'completed';
    return true;
  });

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Task title is required');
      return;
    }
    await createTask({ title, description, dueDateTime, priority });
    setTitle('');
    setDescription('');
    setDueDateTime('');
    setPriority('medium');
    setShowModal(false);
  };

  const handleDownloadTask = async (task: TaskItem) => {
    try {
      const taskText = `
Task: ${task.title}
Description: ${task.description || 'No description'}
Priority: ${task.priority}
Status: ${task.status}
Due Date: ${task.dueDateTime ? new Date(task.dueDateTime).toLocaleString() : 'Not set'}
      `.trim();
      
      const filename = `task-${task._id}.txt`;
      const fileUri = `file://${filename}`;
      
      await Sharing.shareAsync(taskText, {
        mimeType: 'text/plain',
        dialogTitle: 'Share task details'
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Share failed', 'Unable to share task details');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello, {user?.name ? user.name.split(' ')[0] : 'star'}</Text>
          <Text style={styles.name}>{user?.name ?? 'Your workspace'}</Text>
          <Text style={styles.headerSubtitle}>Your colorful task universe awaits.</Text>
        </View>
        <View style={styles.avatarBadge}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarBadgeText}>{user?.name?.charAt(0).toUpperCase() ?? 'T'}</Text>
          )}
        </View>
      </View>

      <View style={styles.chipsRow}>
        {['all', 'pending', 'completed'].map((filter) => (
          <Pressable key={filter} onPress={() => setFilter(filter as any)} style={[styles.chip, filters === filter && styles.chipActive]}>
            <Text style={[styles.chipText, filters === filter && styles.chipTextActive]}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={<View style={styles.emptyState}><Text style={styles.emptyTitle}>No tasks yet</Text><Text style={styles.emptyText}>Start your day by adding a fresh task.</Text></View>}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, item.status === 'completed' && styles.completedText]}>{item.title}</Text>
              {item.description ? <Text style={styles.taskDesc}>{item.description}</Text> : null}
              <View style={styles.metaRow}>
                <View style={[styles.priorityBadge, styles[`${item.priority}Priority`]]}>
                  <Text style={styles.priorityText}>{item.priority}</Text>
                </View>
                <Text style={styles.meta}>{item.status}</Text>
                {item.dueDateTime ? <Text style={styles.dueText}>{new Date(item.dueDateTime).toLocaleString()}</Text> : null}
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => updateTask(item._id, { status: item.status === 'completed' ? 'pending' : 'completed' })} style={styles.iconButton}>
                <Text>{item.status === 'completed' ? '↺' : '✓'}</Text>
              </Pressable>
              <Pressable onPress={() => deleteTask(item._id)} style={styles.iconButton}>
                <Text>✕</Text>
              </Pressable>
              <Pressable onPress={() => handleDownloadTask(item)} style={styles.iconButton}>
                <Text>⬇</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New task</Text>
            <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={[styles.input, styles.textArea]} multiline />
            <TextInput placeholder="Deadline (YYYY-MM-DD HH:MM)" value={dueDateTime} onChangeText={setDueDateTime} style={styles.input} />
            <View style={styles.priorityRow}>
              {(['low', 'medium', 'high'] as const).map((value) => (
                <Pressable key={value} onPress={() => setPriority(value)} style={[styles.priorityOption, priority === value && styles.priorityOptionActive]}>
                  <Text style={styles.priorityOptionText}>{value}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowModal(false)} style={styles.secondaryButton}><Text style={styles.secondaryText}>Cancel</Text></Pressable>
              <Pressable onPress={handleCreateTask} style={styles.primaryButton}><Text style={styles.primaryText}>Create</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.md },
  headerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.md, backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 28, borderWidth: 1, borderColor: colors.border, shadowColor: colors.primary, shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
  headerContent: { flex: 1, paddingRight: spacing.md },
  greeting: { color: colors.muted, fontSize: 14, marginBottom: 4 },
  name: { color: colors.text, fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: colors.muted, marginTop: 4 },
  avatarBadge: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', shadowColor: colors.accent, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  avatarImage: { width: 64, height: 64, borderRadius: 32 },
  avatarBadgeText: { color: colors.text, fontSize: 24, fontWeight: '900' },
  logoutButton: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 999, backgroundColor: colors.primarySoft },
  logoutText: { color: colors.primary, fontWeight: '600' },
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  taskCard: { backgroundColor: colors.surface, borderRadius: 24, padding: spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', marginBottom: spacing.sm, shadowColor: colors.primary, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  taskTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  completedText: { textDecorationLine: 'line-through', color: colors.muted },
  taskDesc: { color: colors.muted, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  dueText: { color: colors.muted, fontSize: 12, marginLeft: 4, flexShrink: 1 },
  lowPriority: { backgroundColor: '#D1FAE5' },
  mediumPriority: { backgroundColor: '#FEF3C7' },
  highPriority: { backgroundColor: '#FEE2E2' },
  priorityText: { color: colors.text, textTransform: 'capitalize', fontWeight: '600' },
  meta: { color: colors.muted, textTransform: 'capitalize' },
  actions: { marginLeft: 8, justifyContent: 'space-between' },
  iconButton: { width: 36, height: 36, borderRadius: 999, backgroundColor: colors.primarySoft, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  emptyState: { paddingVertical: 48, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { color: colors.muted, marginTop: 6 },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent2, justifyContent: 'center', alignItems: 'center', shadowColor: colors.accent2, shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  fabText: { color: '#fff', fontSize: 30, fontWeight: '900' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.35)' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.md },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: spacing.md, marginBottom: spacing.md },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  priorityOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  priorityOptionActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  priorityOptionText: { textTransform: 'capitalize', color: colors.text, fontWeight: '600' },
  taskTag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.accent, alignSelf: 'flex-start', marginTop: spacing.sm },
  taskTagText: { color: colors.text, fontWeight: '700', fontSize: 12 },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  secondaryButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.primarySoft },
  secondaryText: { color: colors.primary, fontWeight: '700' },
  primaryButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.primary },
  primaryText: { color: '#fff', fontWeight: '700' }
});
