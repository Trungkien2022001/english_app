# Phrasal Verbs Mock Data - Hướng dẫn sử dụng

## 📚 Tổng quan

Mock data cho **10 phrasal verbs thông dụng nhất** trong tiếng Anh với đầy đủ thông tin:
- ✓ Nghĩa tiếng Việt & tiếng Anh
- ✓ Phiên âm IPA
- ✓ Cấu trúc ngữ pháp + ghi chú quan trọng
- ✓ 2 câu ví dụ với dịch
- ✓ Synonyms, Antonyms, Collocations
- ✓ CEFR Level (A1-B2)
- ✓ Tần suất sử dụng

## 🎯 Danh sách 10 Phrasal Verbs

| # | Phrasal Verb | Nghĩa | Level | Tần suất |
|---|--------------|-------|-------|----------|
| 1 | **look for** | tìm kiếm | A1 | 95 |
| 2 | **give up** | từ bỏ, bỏ cuộc | A2 | 90 |
| 3 | **run out of** | hết sạch | B1 | 85 |
| 4 | **look forward to** | mong chờ | B1 | 85 |
| 5 | **break down** | hỏng, phân tích | B1 | 80 |
| 6 | **figure out** | hiểu ra | A2 | 90 |
| 7 | **call off** | hủy bỏ | A2 | 75 |
| 8 | **set up** | thiết lập | B1 | 85 |
| 9 | **put off** | hoãn lại | B1 | 75 |
| 10 | **take off** | cất cánh, thành công | B1 | 80 |

## 🚀 Cách sử dụng

### Cách 1: Import vào code (Development)

Thêm vào bất kỳ screen nào (ví dụ Profile screen):

```typescript
import { seedPhrasalVerbsMock } from '../../lib/database/seedPhrasalVerbsMock';
import { sqliteDB } from '../../lib/database/sqlite';

const handleImportMockData = async () => {
  try {
    // Init database first
    await sqliteDB.init();

    // Import mock data
    await seedPhrasalVerbsMock();

    alert('Đã import 10 phrasal verbs mock data thành công!');
  } catch (error) {
    console.error('Lỗi import mock data:', error);
    alert('Import thất bại! Check console.');
  }
};

// Trong UI
<Button title="Import Mock Data" onPress={handleImportMockData} />
```

### Cách 2: Chạy từ React Native Debugger

1. Mở React Native Debugger
2. Trong console, gõ:

```javascript
seedPhrasalVerbsMock()
```

### Cách 3: Reset và seed lại từ đầu

```typescript
import { sqliteDB } from '../../lib/database/sqlite';
import { seedPhrasalVerbsMock } from '../../lib/database/seedPhrasalVerbsMock';

async function resetAndSeed() {
  // Reset database
  await sqliteDB.resetDatabase();

  // Seed mock data
  await seedPhrasalVerbsMock();
}
```

## 📝 Cấu trúc dữ liệu

### Exercise
```typescript
{
  id: 'ex-pv-mock-001',
  title: 'Top 10 Phrasal Verbs Thông Dụng',
  description: '10 cụm động từ được dùng nhiều nhất...',
  question_count: 10,
  pass_score: 70,
  difficulty: 'beginner'
}
```

### Vocabulary (Mỗi phrasal verb)
```typescript
{
  word: 'look forward to',
  word_type: 'phrasal_verb',
  subtype: 'V+To',
  meaning_vi: 'mong chờ, trông đợi',
  meaning_en: 'to feel happy and excited...',
  pronunciation: '/lʊk ˈfɔːwəd tuː/',
  grammar_pattern: 'look forward to + V-ing / noun',
  grammar_note: 'QUAN TRỌNG: Luôn đi với V-ing...',
  example_sentence: 'I look forward to seeing you.',
  example_translation: 'Tôi mong chờ được gặp bạn.',
  synonyms: ['anticipate', 'expect', 'await'],
  collocations: ['look forward to + V-ing', 'look forward to + noun'],
  level: 'B1',
  frequency: 85
}
```

### Questions & Answers
- **10 questions** - mỗi question cho 1 phrasal verb
- **4 answers** mỗi question (1 đúng + 3 sai)
- Answers được shuffle ngẫu nhiên
- Question format: `"look forward to" nghĩa là gì?`

## ✅ Kiểm tra sau khi import

1. **Mở tab "Bài tập"**
2. **Tìm exercise**: "Top 10 Phrasal Verbs Thông Dụng"
3. **Làm bài test** - 10 câu hỏi multiple choice
4. **Xem kết quả** - điểm số + chi tiết từng câu
5. **Xem lịch sử** - trong tab "Lịch sử"

## 🔄 Cập nhật data thật

Khi bạn có data thật (file JSON từ user), cập nhật file:

```
mobile/lib/data/phrasalVerbsMockData.ts
```

Sau đó:
1. Reset database: `sqliteDB.resetDatabase()`
2. Import lại mock data: `seedPhrasalVerbsMock()`

## 📚 Tài liệu tham khảo

- Schema đầy đủ: `mobile/lib/database/schemaV2.ts`
- Seed function: `mobile/lib/database/seedPhrasalVerbsMock.ts`
- Mock data: `mobile/lib/data/phrasalVerbsMockData.ts`

---

**Note**: Mock data này chỉ để test. Khi có data thật, thay thế bằng dataset hoàn chỉnh của user.
