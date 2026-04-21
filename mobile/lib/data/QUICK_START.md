# 🚀 Import Dataset - Hướng Dẫn Nhanh

## Cách Import 25 Phrasal Verbs từ JSON

### Cách 1: Từ Code (Dễ nhất)

Thêm vào bất kỳ screen nào (ví dụ: Profile):

```typescript
import { importPhrasalVerbsDataset } from '../../lib/database/importDataset';
import { sqliteDB } from '../../lib/database/sqlite';

const handleImportDataset = async () => {
  try {
    // 1. Init database
    await sqliteDB.init();

    // 2. Import 25 phrasal verbs từ file JSON
    await importPhrasalVerbsDataset();

    alert('Thành công! Đã import 25 phrasal verbs.');
  } catch (error: any) {
    alert('Lỗi: ' + error.message);
  }
};

// Trong UI
<TouchableOpacity onPress={handleImportDataset}>
  <Text>📥 Import 25 Phrasal Verbs</Text>
</TouchableOpacity>
```

### Cách 2: Từ React Native Debugger

1. Mở React Native Debugger
2. Trong console, gõ:

```javascript
importPhrasalVerbsDataset()
```

### Cách 3: Import Full Mock Data (10 items nhanh)

```typescript
import { seedPhrasalVerbsMock } from '../../lib/database/seedPhrasalVerbsMock';
import { sqliteDB } from '../../lib/database/sqlite';

await sqliteDB.init();
await seedPhrasalVerbsMock();
```

## Dataset Được Import

### File: phrasalVerbsDataset.json

**25 Phrasal Verbs:**
1. account for (B2, business)
2. back up (B1, technology)
3. break down (B1, daily)
4. call off (A2, daily)
5. carry out (B2, business)
6. come across (B2, daily)
7. cut down (B1, health)
8. drop off (B1, daily)
9. figure out (A2, daily)
10. get along (B1, social)
11. give up (A2, daily)
12. go on (A1, daily)
13. hold on (A1, daily)
14. keep up (B1, daily)
15. look after (A2, family)
16. look forward to (B1, daily) - có grammar_note quan trọng!
17. look up (B1, study)
18. make up (B1, daily)
19. pass out (B2, health)
20. put off (B1, business)
21. run out of (B1, daily)
22. set up (B1, business)
23. show up (B1, social)
24. take after (B2, family)
25. take off (B1, travel)

## Exercise Tạo Tự Động

**Exercise:** "25 Phrasal Verbs Thông Dụng"
- **ID:** ex-pv-dataset-001
- **Category:** Phrasal Verbs
- **Questions:** 25 câu (mỗi câu 1 phrasal verb)
- **Type:** Multiple Choice Anh-Việt
- **Difficulty:** Beginner

## Test Sau Khi Import

1. **Mở tab "Danh sách bài tập"**
2. **Tìm exercise:** "25 Phrasal Verbs Thông Dụng"
3. **Click "Bắt đầu →"**
4. **Làm 25 câu hỏi**
5. **Xem kết quả**

## Các Files Liên Quan

- **Dataset JSON:** `mobile/lib/data/phrasalVerbsDataset.json`
- **Import Function:** `mobile/lib/database/importDataset.ts`
- **Mock Data (10 items):** `mobile/lib/data/phrasalVerbsMockData.ts`
- **Seed Function:** `mobile/lib/database/seedPhrasalVerbsMock.ts`

## Troubleshooting

### Error: "Database not initialized"
```typescript
// Thêm dòng này trước khi import
await sqliteDB.init();
```

### Exercise đã tồn tại
Function sẽ skip exercise nếu đã tồn tại, chỉ add vocabulary mới.

### Vocabulary đã tồn tại
Function sẽ check và skip vocabulary đã có trong database (dựa vào `word`).

## Full Example Code

```typescript
import React from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { importPhrasalVerbsDataset } from '../lib/database/importDataset';
import { sqliteDB } from '../lib/database/sqlite';

export default function ImportScreen() {
  const handleImport = async () => {
    try {
      await sqliteDB.init();
      await importPhrasalVerbsDataset();
      Alert.alert('Thành công', 'Đã import 25 phrasal verbs!');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleImport}>
        <Text style={styles.buttonText}>📥 Import 25 Phrasal Verbs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  button: { backgroundColor: '#22c55e', padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
});
```

---

**Ready to import! 🎉**
