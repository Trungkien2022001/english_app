# 🚀 Quick Start - Import Mock Data

## Cách nhanh nhất để test với 10 Phrasal Verbs

### Bước 1: Thêm button để import data

Mở file `mobile/app/(tabs)/profile.tsx` (hoặc bất kỳ screen nào), thêm:

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { seedPhrasalVerbsMock } from '../../lib/database/seedPhrasalVerbsMock';
import { sqliteDB } from '../../lib/database/sqlite';

export default function ProfileScreen() {
  const handleImportMockData = async () => {
    try {
      // 1. Init database
      await sqliteDB.init();

      // 2. Import 10 phrasal verbs
      await seedPhrasalVerbsMock();

      Alert.alert(
        'Thành công!',
        'Đã import 10 phrasal verbs mock data thành công!'
      );
    } catch (error: any) {
      console.error('Import error:', error);
      Alert.alert('Lỗi', 'Không thể import data: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Nút import mock data */}
      <TouchableOpacity
        style={styles.importButton}
        onPress={handleImportMockData}
      >
        <Text style={styles.buttonText}>📥 Import Mock Data (10 PV)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  importButton: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### Bước 2: Chạy app và import

1. Start Expo server:
   ```bash
   cd mobile
   npx expo start
   ```

2. Mở tab Profile

3. Click "📥 Import Mock Data (10 PV)"

4. Done! Bạn sẽ thấy alert "Thành công!"

### Bước 3: Test exercise

1. Mở tab "Danh sách bài tập"
2. Tìm exercise: **"Top 10 Phrasal Verbs Thông Dụng"**
3. Click "Bắt đầu →"
4. Làm 10 câu hỏi multiple choice
5. Xem kết quả

### Bước 4: Xem lịch sử

1. Mở tab "Lịch sử"
2. Bạn sẽ thấy bài test vừa làm với điểm số
3. Click vào để xem chi tiết từng câu

## 🔄 Reset và Import lại

Nếu muốn reset database và import lại:

```typescript
import { sqliteDB } from '../../lib/database/sqlite';
import { seedPhrasalVerbsMock } from '../../lib/database/seedPhrasalVerbsMock';

const handleResetAndImport = async () => {
  try {
    // Reset database (xóa tất cả data)
    await sqliteDB.resetDatabase();

    // Import lại mock data
    await seedPhrasalVerbsMock();

    Alert.alert('Thành công!', 'Đã reset và import lại mock data.');
  } catch (error: any) {
    Alert.alert('Lỗi', error.message);
  }
};
```

## ✅ Kiểm tra data đã import

### Cách 1: Từ UI
- Mở tab "Danh sách bài tập"
- Tìm exercise "Top 10 Phrasal Verbs"
- Click vào và xem có 10 questions

### Cách 2: Từ console (React Native Debugger)
```javascript
// Trong browser console
import { sqliteDB } from './lib/database/sqlite';

const db = sqliteDB.getDatabase();
const vocabularies = await db.getAllAsync('SELECT * FROM vocabularies WHERE word_type = "phrasal_verb"');

console.log('Total phrasal verbs:', vocabularies.length);
console.log('Data:', vocabularies);
```

## 📋 10 Phrasal Verbs trong Mock Data

1. **look for** - tìm kiếm (A1, freq: 95)
2. **give up** - từ bỏ, bỏ cuộc (A2, freq: 90)
3. **run out of** - hết sạch (B1, freq: 85)
4. **look forward to** - mong chờ (B1, freq: 85)
5. **break down** - hỏng, phân tích (B1, freq: 80)
6. **figure out** - hiểu ra (A2, freq: 90)
7. **call off** - hủy bỏ (A2, freq: 75)
8. **set up** - thiết lập (B1, freq: 85)
9. **put off** - hoãn lại (B1, freq: 75)
10. **take off** - cất cánh, thành công (B1, freq: 80)

Mỗi từ có:
- ✅ Meaning VI + EN
- ✅ Pronunciation (IPA)
- ✅ Grammar pattern + note quan trọng
- ✅ 2 Example sentences
- ✅ Synonyms, Collocations
- ✅ CEFR Level
- ✅ Frequency score

## 🐛 Troubleshooting

### Lỗi: "Database not initialized"
```typescript
// Thêm dòng này trước khi import
await sqliteDB.init();
```

### Lỗi: "Data already seeded"
```typescript
// Reset database trước
await sqliteDB.resetDatabase();
await seedPhrasalVerbsMock();
```

### Lỗi: Schema outdated
```typescript
// Check và update nếu cần
const needsUpdate = await sqliteDB.needsUpdate();
if (needsUpdate) {
  await sqliteDB.resetDatabase();
}
```

## 📞 Help

Nếu có vấn đề:
1. Check console log để xem error chi tiết
2. Đảm bảo Expo server đang chạy
3. Try reset database: `sqliteDB.resetDatabase()`
4. Rebuild app: `npx expo start --clear`

---

**Ready to test! 🚀**
