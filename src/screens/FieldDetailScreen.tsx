import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import BookingCard from '../components/BookingCard';
import BookingModal from '../components/BookingModal';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { colors, fontSize, radius, spacing } from '../theme/colors';
import { Booking, RootStackParamList } from '../types';
import { formatPrice } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldDetail'>;

export default function FieldDetailScreen({ navigation, route }: Props) {
  const { fieldId } = route.params;
  const { getField, getBookingsOfField, addBooking, deleteBooking } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const field = getField(fieldId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: field?.name ?? 'Chi tiết sân' });
  }, [navigation, field]);

  if (!field) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState message="Không tìm thấy sân." />
      </SafeAreaView>
    );
  }

  const fieldBookings = getBookingsOfField(field.id);
  const underMaintenance = field.status === 'Bảo trì';

  const confirmCancel = (booking: Booking) => {
    Alert.alert('Xác nhận huỷ', `Huỷ lượt đặt của ${booking.customerName}?`, [
      { text: 'Không', style: 'cancel' },
      { text: 'Huỷ lượt đặt', style: 'destructive', onPress: () => deleteBooking(booking.id) },
    ]);
  };

  const handleBook = (data: Omit<Booking, 'id'>) => {
    addBooking(data);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={fieldBookings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.name}>{field.name}</Text>
                <StatusBadge status={field.status} />
              </View>
              <Text style={styles.info}>Loại sân: {field.type}</Text>
              <Text style={styles.price}>{formatPrice(field.pricePerHour)}</Text>
            </View>

            <AppButton
              title={underMaintenance ? 'Sân đang bảo trì' : 'Đặt sân'}
              onPress={() => setModalVisible(true)}
              disabled={underMaintenance}
              style={styles.bookButton}
            />

            <Text style={styles.sectionTitle}>Lượt đặt ({fieldBookings.length})</Text>
          </View>
        }
        ListEmptyComponent={<EmptyState message="Sân này chưa có lượt đặt nào." />}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            pricePerHour={field.pricePerHour}
            onCancel={() => confirmCancel(item)}
          />
        )}
      />

      <BookingModal
        visible={modalVisible}
        field={field}
        bookings={fieldBookings}
        onClose={() => setModalVisible(false)}
        onSubmit={handleBook}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  info: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  price: {
    marginTop: spacing.xs,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  bookButton: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
});
