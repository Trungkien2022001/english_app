# 📚 Vocabulary Import Template - Hướng dẫn chi tiết

## 🎯 Tổng quan

Template này dùng để import vocabulary data vào EnglishApp mobile app. Hỗ trợ 2 format:
- **JSON** (khuyên dùng) - Format chuẩn, dễ validate
- **Excel/CSV** - Dễ điền dữ liệu thủ công

## 📋 Cấu trúc dữ liệu

### Format JSON

```json
{
  "vocabularies": [
    {
      // ... fields
    }
  ]
}
```

### Danh sách fields

| Field | Type | Bắt buộc | Mô tả | Ví dụ |
|-------|------|----------|-------|-------|
| `word` | string | ✅ | Từ/Cụm từ tiếng Anh | "look forward to" |
| `word_type` | string | ✅ | Loại từ | "word", "phrasal_verb", "idiom", "collocation" |
| `subtype` | string | ❌ | Loại chi tiết | "V+To", "V+V-ing", "V+N", etc. |
| `meaning_vi` | string | ✅ | Nghĩa tiếng Việt | "mong chờ, trông đợi" |
| `meaning_en` | string | ❌ | Nghĩa tiếng Anh | "to feel happy and excited..." |
| `pronunciation` | string | ❌ | Phiên âm IPA | "/lʊk ˈfɔːwəd tuː/" |
| `part_of_speech` | string | ❌ | Từ ngữ | "verb", "noun", "adjective", etc. |
| `grammar_pattern` | string | ❌ | Cấu trúc ngữ pháp | "look forward to + V-ing" |
| `grammar_note` | string | ❌ | Ghi chú ngữ pháp | "Luôn đi với V-ing" |
| `example_sentence` | string | ✅ | Câu ví dụ 1 | "I look forward to seeing you." |
| `example_translation` | string | ✅ | Dịch câu 1 | "Tôi mong chờ được gặp bạn." |
| `example_2_sentence` | string | ❌ | Câu ví dụ 2 | "We look forward to your reply." |
| `example_2_translation` | string | ❌ | Dịch câu 2 | "Chúng tôi mong chờ phản hồi." |
| `synonyms` | string | ❌ | Từ đồng nghĩa (JSON array) | "[\"expect\", \"anticipate\"]" |
| `antonyms` | string | ❌ | Từ trái nghĩa (JSON array) | "[\"dread\", \"fear\"]" |
| `collocations` | string | ❌ | Từ đi kèm (JSON array) | "[\"look forward to + noun\"]" |
| `level` | string | ❌ | CEFR Level | "A1", "A2", "B1", "B2", "C1", "C2" |
| `difficulty_level` | string | ❌ | Độ khó | "beginner", "intermediate", "advanced" |
| `category_id` | string | ✅ | ID danh mục | "cat-phrasal-001" |
| `topic` | string | ❌ | Chủ đề | "daily", "business", "travel" |
| `tags` | string | ❌ | Tags (JSON array) | "[\"common\", \"formal\"]" |
| `frequency` | number | ❌ | Tần suất (1-100) | 85 |
| `is_common` | number | ❌ | Có phải từ thông dụng | 0 hoặc 1 |

## 📦 Word Types

| word_type | Mô tả | Ví dụ | subtype |
|-----------|-------|-------|---------|
| `word` | Từ đơn | "allocate", "revenue" | null |
| `phrasal_verb` | Cụm động từ | "look forward to" | "V+To", "V+V-ing", "V+N", "V+adv", "V+prep" |
| `idiom` | Thành ngữ | "break a leg" | null |
| `collocation` | Từ đi kèm | "make a decision" | "V+N", "V+prep", "N+of" |

### Phrasal Verb Subtypes

- **V+To**: Verb + To (look forward to + V-ing)
- **V+V-ing**: Verb + V-ing (enjoy doing)
- **V+N**: Verb + Noun (make a decision)
- **V+prep**: Verb + Preposition (rely on)
- **V+adv**: Verb + Adverb (break down)
- **V+adv+prep**: Verb + Adverb + Preposition (put up with)

## 🏷️ Category IDs

| ID | Name | Mô tả |
|----|------|-------|
| `cat-toeic-001` | TOEIC | Từ vựng TOEIC |
| `cat-ielts-001` | IELTS | Từ vựng IELTS |
| `cat-phrasal-001` | Phrasal Verbs | Cụm động từ |
| `cat-business-001` | Business English | Tiếng Anh thương mại |
| `cat-daily-001` | Daily Conversation | Giao tiếp hàng ngày |
| `cat-technology-001` | Technology | Công nghệ |
| `cat-health-001` | Health & Body | Sức khỏe |
| `cat-social-001` | Social & Relationships | Xã hội |
| `cat-family-001` | Family | Gia đình |
| `cat-study-001` | Study & Learning | Học tập |
| `cat-travel-001` | Travel | Du lịch |

## 📊 CEFR Levels

- **A1**: Beginner (Cơ bản)
- **A2**: Elementary (Sơ cấp)
- **B1**: Intermediate (Trung cấp)
- **B2**: Upper Intermediate (Trung cao)
- **C1**: Advanced (Cao cấp)
- **C2**: Proficiency (Thành thạo)

## ✅ Ví dụ đầy đủ

### Ví dụ 1: Phrasal Verb
```json
{
  "word": "run out of",
  "word_type": "phrasal_verb",
  "subtype": "V+adv+prep",
  "meaning_vi": "hết sạch",
  "meaning_en": "to use up all of something",
  "pronunciation": "/rʌn aʊt ʌv/",
  "part_of_speech": "phrasal_verb",
  "grammar_pattern": "run out of + noun",
  "grammar_note": "Luôn đi với danh từ sau 'of'",
  "example_sentence": "We ran out of milk.",
  "example_translation": "Chúng tôi hết sữa rồi.",
  "synonyms": "[\"exhaust\", \"deplete\"]",
  "antonyms": "[\"have plenty of\"]",
  "collocations": "[\"run out of money\", \"run out of time\"]",
  "level": "B1",
  "difficulty_level": "beginner",
  "category_id": "cat-phrasal-001",
  "topic": "daily",
  "tags": "[\"common\", \"essential\"]",
  "frequency": 85,
  "is_common": 1
}
```

### Ví dụ 2: Từ đơn (Verb)
```json
{
  "word": "allocate",
  "word_type": "word",
  "subtype": null,
  "meaning_vi": "phân bổ",
  "meaning_en": "to distribute resources",
  "pronunciation": "/ˈæləkeɪt/",
  "part_of_speech": "verb",
  "grammar_pattern": "allocate + noun + to + noun",
  "example_sentence": "Allocate resources to projects.",
  "example_translation": "Phân bổ nguồn lực cho dự án.",
  "level": "B2",
  "difficulty_level": "intermediate",
  "category_id": "cat-business-001",
  "topic": "business",
  "frequency": 70,
  "is_common": 1
}
```

### Ví dụ 3: Idiom
```json
{
  "word": "break a leg",
  "word_type": "idiom",
  "subtype": null,
  "meaning_vi": "chúc may mắn",
  "meaning_en": "good luck (before performance)",
  "example_sentence": "Break a leg! You'll be great.",
  "example_translation": "Chúc may mắn! Bạn sẽ làm tốt.",
  "level": "B1",
  "difficulty_level": "beginner",
  "category_id": "cat-daily-001",
  "topic": "daily",
  "frequency": 60,
  "is_common": 1
}
```

## 🔧 Quy tắc quan trọng

### 1. JSON Arrays trong string
Các field như `synonyms`, `antonyms`, `collocations`, `tags` phải là **string chứa JSON array**:

```json
// ✅ ĐÚNG
"synonyms": "[\"expect\", \"anticipate\"]"

// ❌ SAI
"synonyms": ["expect", "anticipate"]
"synonyms": "expect, anticipate"
```

### 2. Null vs empty string
- Nếu không có dữ liệu, dùng `null`:
```json
"pronunciation": null,
"example_2_sentence": null
```

- Không nên dùng empty string `""` trừ khi field bắt buộc.

### 3. Grammar note quan trọng
**QUAN TRỌNG**: Các phrasal verbs có grammar đặc biệt PHẢI ghi trong `grammar_note`:

```json
{
  "word": "look forward to",
  "grammar_note": "QUAN TRỌNG: Luôn đi với V-ing, KHÔNG dùng nguyên mẫu (to V)"
}
```

### 4. Example format
- Luôn đi đôi: sentence + translation
- 2 examples: `example_sentence` + `example_2_sentence`
- Nếu chỉ có 1 example, để `example_2` = `null`

## 📁 File locations

- **JSON Template**: `mobile/lib/data/templates/vocabulary_template.json`
- **Excel Template**: (coming soon)
- **Mock Data**: `mobile/lib/data/phrasalVerbsMockData.ts`
- **Import UI**: `mobile/app/admin/data-import.tsx`

## 🚀 Cách import

1. **Tải template**: Copy `vocabulary_template.json`
2. **Điền dữ liệu**: Thêm vocabularies vào array `vocabularies`
3. **Validate**: Kiểm tra JSON syntax (dùng JSONLint)
4. **Import**: Mở app → Admin → Import Data → Chọn file

## ⚠️ Common mistakes

| Mistake | Fix |
|---------|-----|
| Quên quotes around JSON arrays | `"[\"a\", \"b\"]"` |
| Dùng empty string thay vì null | `"pronunciation": null` |
| Word_type không đúng | Check danh sách word_types |
| Category_id không tồn tại | Check danh sách categories |
| Quên example translation | Luôn có cả sentence VÀ translation |

## 📞 Support

Nếu có vấn đề:
1. Check console log để xem error chi tiết
2. Validate JSON file trước khi import
3. Test với 1-2 items trước khi import hàng loạt

---

**Updated**: 2025-04-21
**Version**: 1.0
