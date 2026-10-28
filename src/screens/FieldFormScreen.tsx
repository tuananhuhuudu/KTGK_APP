import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import OptionGroup from '../components/OptionGroup';
import { useApp } from '../context/AppContext';
import { colors, spacing } from '../theme/colors';
import { FieldStatus, FieldType, RootStackParamList } from '../types';
import { validateFieldName, validatePrice } from '../utils/validate';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldForm'>;

const FIELD_TYPES: readonly FieldType[] = ['5 người', '7 người'];
const FIELD_STATUSES: readonly FieldStatus[] = ['Hoạt động', 'Bảo trì'];

export default function FieldFormScreen({ navigation, route }: Props) {
  const { fieldId } = route.params ?? {};
  const { getField, addField, updateField, isNameDuplicated } = useApp();
  const editing = getField(fieldId ?? '');

  const [name, setName] = useState(editing?.name ?? '');
  const [type, setType] = useState<FieldType>(editing?.type ?? '5 người');
  const [price, setPrice] = useState(editing ? String(editing.pricePerHour) : '');
  const [status, setStatus] = useState<FieldStatus>(editing?.status ?? 'Hoạt động');
  const [nameError, setNameError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: editing ? 'Sửa sân' : 'Thêm sân' });
  }, [navigation, editing]);

  const handleSubmit = () => {
    const duplicated = isNameDuplicated(name, editing?.id);
    const errName = validateFieldName(name, duplicated);
    const errPrice = validatePrice(price);

    setNameError(errName);
    setPriceError(errPrice);

    if (errName || errPrice) {
      return;
    }

    const data = {
      name: name.trim(),
      type,
      pricePerHour: Number(price.trim()),
      status,
    };

    if (editing) {
      updateField(editing.id, data);
    } else {
      addField(data);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <AppInput
            label="Tên sân"
            value={name}
            onChangeText={text => {
              setName(text);
              setNameError(null);
            }}
            error={nameError}
            placeholder="Ví dụ: Sân A1"
          />

          <OptionGroup label="Loại sân" options={FIELD_TYPES} value={type} onChange={setType} />

          <AppInput
            label="Giá thuê mỗi giờ (VNĐ)"
            value={price}
            onChangeText={text => {
              setPrice(text);
              setPriceError(null);
            }}
            error={priceError}
            placeholder="Ví dụ: 300000"
            keyboardType="numeric"
          />

          <OptionGroup
            label="Trạng thái"
            options={FIELD_STATUSES}
            value={status}
            onChange={setStatus}
          />

          <AppButton title={editing ? 'Lưu thay đổi' : 'Thêm sân'} onPress={handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
