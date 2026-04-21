# ✅ Data Import Feature - Hoàn thành

## 🎉 Tính năng đã tạo

### 1. **Mock Data** (10 Phrasal Verbs)
📁 `mobile/lib/data/phrasalVerbsMockData.ts`

10 phrasal verbs thông dụng nhất:
- look for, give up, run out of, look forward to
- break down, figure out, call off, set up
- put off, take off

Mỗi item có đầy đủ:
- ✓ Meaning VI + EN
- ✓ Pronunciation (IPA)
- ✓ Grammar patterns + notes
- ✓ 2 Examples with translations
- ✓ Synonyms, Antonyms, Collocations
- ✓ CEFR Level (A1-B2)
- ✓ Frequency score

### 2. **Import UI**
📁 `mobile/app/admin/data-import.tsx`

Features:
- ✅ Pick file (JSON/Excel/CSV)
- ✅ Preview data before import
- ✅ Validate format
- ✅ Import vào database
- ✅ Download template

### 3. **Templates**
📁 `mobile/lib/data/templates/`

- **vocabulary_template.json** - Template đầy đủ
- **README.md** - Hướng dẫn chi tiết
- **template-view.tsx** - Screen hiển thị template

### 4. **Database Fixes**
📁 `mobile/lib/database/sqlite.ts`

- ✅ Fixed schema V2 (xóa comments SQL)
- ✅ Fixed generateQuestions() (dùng meaning_vi)
- ✅ Added seedPhrasalVerbsMock() function

## 📋 Cách sử dụng

### Cách 1: Import Mock Data Nhanh

```typescript
import { seedPhrasalVerbsMock } from '../../lib/database/seedPhrasalVerbsMock';
import { sqliteDB } from '../../lib/database/sqlite';

// 1. Init database
await sqliteDB.init();

// 2. Seed mock data
await seedPhrasalVerbsMock();

// 3. Done! 10 phrasal verbs đã có trong app
```

### Cách 2: Import Từ File JSON/Excel

1. **Download template**
   - Mở app → Admin → Import Data
   - Click "Download Template"

2. **Điền dữ liệu**
   ```json
   {
     "vocabularies": [
       {
         "word": "your word",
         "word_type": "phrasal_verb",
         "meaning_vi": "nghĩa tiếng Việt",
         "example_sentence": "example",
         "example_translation": "dịch",
         // ... more fields
       }
     ]
   }
   ```

3. **Import vào app**
   - Mở app → Admin → Import Data
   - Chọn file
   - Preview (5 items đầu)
   - Click "Import Data"

## 📊 File Templates

### JSON Template Structure
```
mobile/lib/data/templates/
├── vocabulary_template.json    # Full template
├── README.md                     # Detailed guide
└── phrasalVerbsMockData.ts      # Mock data (10 items)
```

### Required Fields
- ✅ word
- ✅ word_type
- ✅ meaning_vi
- ✅ example_sentence
- ✅ example_translation
- ✅ category_id

### Optional Fields
- pronunciation, meaning_en
- grammar_pattern, grammar_note
- synonyms, antonyms, collocations
- level, difficulty_level, topic, tags
- frequency, is_common

## 🎯 Word Types & Subtypes

| Type | Description | Subtype Examples |
|------|-------------|------------------|
| word | Từ đơn | null |
| phrasal_verb | Cụm động từ | V+To, V+V-ing, V+N, V+prep, V+adv |
| idiom | Thành ngữ | null |
| collocation | Từ đi kèm | V+N, V+prep, N+of |

## 📦 Category IDs Available

```
cat-toeic-001       (TOEIC)
cat-ielts-001       (IELTS)
cat-phrasal-001     (Phrasal Verbs) ⭐
cat-business-001    (Business English)
cat-daily-001       (Daily Conversation)
cat-technology-001  (Technology)
cat-health-001      (Health)
cat-social-001      (Social)
cat-family-001      (Family)
cat-study-001       (Study)
cat-travel-001      (Travel)
```

## ✨ Testing Checklist

- [ ] Mock data seeded thành công
- [ ] 10 phrasal verbs hiển thị trong exercise
- [ ] Làm bài test với 10 câu hỏi
- [ ] Check kết quả (điểm, chi tiết)
- [ ] Xem lịch sử trong tab "Lịch sử"
- [ ] Test import file JSON mới
- [ ] Validate data trước khi import

## 🐛 Known Issues

1. **Clipboard copy** - Feature coming soon
   - Current: Hiển thị alert
   - Need: Implement `expo-clipboard`

2. **Excel parsing** - Cần thêm thư viện
   ```bash
   npm install xlsx
   npm install expo-file-system
   ```

3. **Large file import** - Cần progress indicator
   - Current: Loading spinner
   - Improve: Show percentage (0%, 50%, 100%)

## 🚀 Next Steps

1. **Install dependencies** (if needed)
   ```bash
   npm install expo-document-picker
   npm install xlsx
   npm install expo-file-system
   ```

2. **Add admin button to navigation**
   - Thêm button trong Profile screen
   - Hoặc tạo Admin tab

3. **Test với real data**
   - User fills template
   - Import real dataset
   - Validate và fix bugs

## 📞 Help

- Template guide: `mobile/lib/data/templates/README.md`
- Mock data: `mobile/lib/data/phrasalVerbsMockData.ts`
- Import UI: `mobile/app/admin/data-import.tsx`

---

**Status**: ✅ Ready for testing
**Date**: 2025-04-21
**Version**: 1.0
