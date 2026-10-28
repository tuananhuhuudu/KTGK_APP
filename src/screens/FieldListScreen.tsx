import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import FieldCard from '../components/FieldCard';
import { useApp } from '../context/AppContext';
import { colors, fontSize, spacing } from '../theme/colors';
import { Field, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldList'>;

export default function FieldListScreen({ navigation }: Props) {
  const { fields, loading, deleteField, hasBooking } = useApp();

  const activeCount = fields.filter(f => f.status === 'Hoạt động').length;

  const confirmDelete = (field: Field) => {
    if (hasBooking(field.id)) {
      Alert.alert('Không thể xoá', `${field.name} đang có lượt đặt, không thể xoá.`);
      return;
    }
    Alert.alert('Xác nhận xoá', `Bạn có chắc muốn xoá ${field.name}?`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => deleteField(field.id) },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.summary}>
          {activeCount}/{fields.length} sân hoạt động
        </Text>
        <AppButton title="+ Thêm sân" onPress={() => navigation.navigate('FieldForm', {})} />
      </View>

      <FlatList
        data={fields}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="Chưa có sân nào. Nhấn + Thêm sân để bắt đầu." />}
        renderItem={({ item }) => (
          <FieldCard
            field={item}
            onPress={() => navigation.navigate('FieldDetail', { fieldId: item.id })}
            onEdit={() => navigation.navigate('FieldForm', { fieldId: item.id })}
            onDelete={() => confirmDelete(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  summary: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
