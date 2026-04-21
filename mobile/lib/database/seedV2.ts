/**
 * Seed Data Examples for Enhanced Vocabulary Schema
 * Ví dụ dữ liệu với schema mở rộng
 */

import phrasalVerbsDataset from '../data/phrasalVerbsDataset.json';

// Transform phrasal verbs dataset to seed format
const phrasalVerbsSeed = phrasalVerbsDataset.phrasal_verbs.map((pv, index) => {
  const id = `voc-pv-${String(index + 1).padStart(3, '0')}`;
  const categoryIdMap: Record<string, string> = {
    'business': 'cat-business-001',
    'technology': 'cat-technology-001',
    'daily': 'cat-daily-001',
    'health': 'cat-health-001',
    'social': 'cat-social-001',
    'family': 'cat-family-001',
    'study': 'cat-study-001',
    'travel': 'cat-travel-001',
  };

  return {
    id,
    word: pv.phrasal_verb,
    word_type: pv.type,
    subtype: pv.subtype || null,
    meaning_vi: pv.meaning_vi,
    meaning_en: pv.meaning_en,
    pronunciation: pv.pronunciation,
    audio_url: null,
    part_of_speech: 'phrasal_verb',
    grammar_pattern: pv.grammar_pattern,
    grammar_note: pv.grammar_note || null,
    example_sentence: pv.examples[0]?.sentence || '',
    example_translation: pv.examples[0]?.translation || '',
    example_2_sentence: pv.examples[1]?.sentence || null,
    example_2_translation: pv.examples[1]?.translation || null,
    synonyms: JSON.stringify(pv.synonyms || []),
    antonyms: JSON.stringify([]),
    collocations: JSON.stringify(pv.collocations || []),
    level: pv.level,
    difficulty_level: pv.level.startsWith('A') ? 'beginner' : pv.level.startsWith('B') ? 'intermediate' : 'advanced',
    category_id: categoryIdMap[pv.topic] || 'cat-daily-001',
    topic: pv.topic,
    tags: JSON.stringify(['phrasal-verb', pv.topic, pv.is_common ? 'common' : 'uncommon']),
    image_url: null,
    frequency: pv.frequency,
    is_common: pv.is_common ? 1 : 0,
  };
});

export const EXAMPLE_VOCABULARIES_V2 = [
  // All phrasal verbs from dataset (25 items)
  ...phrasalVerbsSeed,

  // ==================== REGULAR VERBS ====================
  {
    id: 'voc-biz-001',
    word: 'allocate',
    word_type: 'word',
    subtype: null,
    meaning_vi: 'phân bổ, phân chia (nguồn lực, tiền bạc, thời gian)',
    meaning_en: 'to distribute resources or duties for a particular purpose',
    pronunciation: '/ˈæləkeɪt/',
    audio_url: null,
    part_of_speech: 'verb',
    grammar_pattern: 'allocate + noun + (for/to) + noun',
    grammar_note: 'Thường dùng trong business/academic context. Chia: allocate - allocated - allocated',
    example_sentence: 'We need to allocate more resources to this project.',
    example_translation: 'Chúng ta cần phân bổ nhiều tài nguyên hơn cho dự án này.',
    example_2_sentence: 'The government allocated funds for education.',
    example_2_translation: 'Chính phủ đã phân bổ ngân sách cho giáo dục.',
    synonyms: JSON.stringify(['distribute', 'assign', 'apportion', 'allot']),
    antonyms: JSON.stringify(['withhold', 'keep', 'retain']),
    collocations: JSON.stringify([
      'allocate resources',
      'allocate funds/money/budget',
      'allocate time',
      'allocate money to/for'
    ]),
    level: 'B2',
    difficulty_level: 'intermediate',
    category_id: 'cat-business-001',
    topic: 'business',
    tags: JSON.stringify(['formal', 'business', 'academic']),
    image_url: null,
    frequency: 70,
    is_common: 1,
  },

  // ==================== NOUNS ====================
  {
    id: 'voc-biz-002',
    word: 'revenue',
    word_type: 'word',
    subtype: null,
    meaning_vi: 'doanh thu, thu nhập',
    meaning_en: 'income that a company or government receives regularly',
    pronunciation: '/ˈrevənjuː/',
    audio_url: null,
    part_of_speech: 'noun',
    grammar_pattern: 'revenue + from + noun / revenue + of + noun',
    grammar_note: 'Không thể đếm được (uncountable noun). Synonym: turnover (UK)',
    example_sentence: 'Our revenue increased by 20% this quarter.',
    example_translation: 'Doanh thu của chúng tôi tăng 20% trong quý này.',
    example_2_sentence: 'Advertising revenue has declined significantly.',
    example_2_translation: 'Doanh thu từ quảng cáo đã giảm đáng kể.',
    synonyms: JSON.stringify(['income', 'earnings', 'turnover', 'proceeds']),
    antonyms: JSON.stringify(['expenses', 'costs', 'expenditure']),
    collocations: JSON.stringify([
      'generate revenue',
      'increase/boost revenue',
      'revenue stream',
      'annual/quarterly revenue',
      'revenue from'
    ]),
    level: 'B2',
    difficulty_level: 'intermediate',
    category_id: 'cat-business-001',
    topic: 'business',
    tags: JSON.stringify(['business', 'finance', 'formal']),
    image_url: null,
    frequency: 80,
    is_common: 1,
  },

  // ==================== IDIOMS ====================
  {
    id: 'voc-idiom-001',
    word: 'break a leg',
    word_type: 'idiom',
    subtype: null,
    meaning_vi: 'chúc may mắn (dùng cho người diễn xuất)',
    meaning_en: 'used to wish someone good luck, especially before a performance',
    pronunciation: null,
    audio_url: null,
    part_of_speech: 'idiom',
    grammar_pattern: 'Break a leg! (standalone)',
    grammar_note: 'Chỉ dùng trong ngành giải trí (sân khấu, ca nhạc, etc.)',
    example_sentence: 'Break a leg! You\'ll be great.',
    example_translation: 'Chúc may mắn! Bạn sẽ làm rất tốt.',
    example_2_sentence: 'She said "break a leg" before I went on stage.',
    example_2_translation: 'Cô ấy chúc tôi may mắn trước khi tôi lên sân khấu.',
    synonyms: JSON.stringify(['good luck', 'all the best']),
    antonyms: JSON.stringify([]),
    collocations: JSON.stringify([]),
    level: 'B1',
    difficulty_level: 'beginner',
    category_id: 'cat-daily-001',
    topic: 'daily',
    tags: JSON.stringify(['informal', 'theater', 'entertainment']),
    image_url: null,
    frequency: 60,
    is_common: 1,
  },

  // ==================== COLLOCATIONS ====================
  {
    id: 'voc-coll-001',
    word: 'make a decision',
    word_type: 'collocation',
    subtype: 'V+N',
    meaning_vi: 'đưa ra quyết định',
    meaning_en: 'to decide something',
    pronunciation: null,
    audio_url: null,
    part_of_speech: 'verb phrase',
    grammar_pattern: 'make a decision + (to + V) / (about + noun)',
    grammar_note: 'Collocation chuẩn: "make a decision", KHÔNG dùng "do a decision"',
    example_sentence: 'We need to make a decision soon.',
    example_translation: 'Chúng ta cần sớm đưa ra quyết định.',
    example_2_sentence: 'She made a decision to change her career.',
    example_2_translation: 'Cô ấy đã quyết định thay đổi nghề nghiệp.',
    synonyms: JSON.stringify(['decide', 'reach a decision', 'come to a decision']),
    antonyms: JSON.stringify(['postpone', 'delay']),
    collocations: JSON.stringify([
      'make a decision + to V: to change jobs',
      'make a decision + about: the project',
      'make a quick/tough/wise decision'
    ]),
    level: 'A2',
    difficulty_level: 'beginner',
    category_id: 'cat-daily-001',
    topic: 'daily',
    tags: JSON.stringify(['common', 'formal', 'essential']),
    image_url: null,
    frequency: 95,
    is_common: 1,
  },

  // ==================== ADJECTIVES ====================
  {
    id: 'voc-daily-001',
    word: 'awkward',
    word_type: 'word',
    subtype: null,
    meaning_vi: 'lúng túng, ngượng ngùng, khó xử',
    meaning_en: 'making you feel embarrassed or uncomfortable',
    pronunciation: '/ˈɔːkwəd/',
    audio_url: null,
    part_of_speech: 'adjective',
    grammar_pattern: 'awkward + (for + someone) + to + V / awkward + situation/moment',
    grammar_note: 'Chia: awkward - more awkward - most awkward',
    example_sentence: 'It was an awkward situation.',
    example_translation: 'Đó là một tình huống khó xử.',
    example_2_sentence: 'I felt awkward when everyone looked at me.',
    example_2_translation: 'Tôi thấy lúng túng khi mọi người nhìn tôi.',
    synonyms: JSON.stringify(['embarrassing', 'uncomfortable', 'difficult']),
    antonyms: JSON.stringify(['comfortable', 'natural', 'easy']),
    collocations: JSON.stringify([
      'awkward situation',
      'awkward silence',
      'awkward moment',
      'feel awkward',
      'slightly/very awkward'
    ]),
    level: 'B1',
    difficulty_level: 'intermediate',
    category_id: 'cat-daily-001',
    topic: 'daily',
    tags: JSON.stringify(['emotion', 'social', 'common']),
    image_url: null,
    frequency: 65,
    is_common: 1,
  },

  // ==================== BUSINESS EXPRESSIONS ====================
  {
    id: 'voc-biz-003',
    word: 'get off the ground',
    word_type: 'idiom',
    subtype: null,
    meaning_vi: 'bắt đầu thành công, khởi động (dự án, kế hoạch)',
    meaning_en: 'to start happening or functioning successfully',
    pronunciation: null,
    audio_url: null,
    part_of_speech: 'phrasal verb',
    grammar_pattern: 'get + something + off the ground',
    grammar_note: 'Thường dùng cho business/project/campaign',
    example_sentence: 'The new project finally got off the ground.',
    example_translation: 'Dự án mới cuối cùng cũng đã khởi động.',
    example_2_sentence: 'It takes time to get a business off the ground.',
    example_2_translation: 'Cần thời gian để bắt đầu kinh doanh thành công.',
    synonyms: JSON.stringify(['start', 'launch', 'begin']),
    antonyms: JSON.stringify(['fail', 'collapse', 'stop']),
    collocations: JSON.stringify([
      'get a project off the ground',
      'get a business off the ground',
      'get a campaign off the ground',
      'finally/successfully get off the ground'
    ]),
    level: 'B2',
    difficulty_level: 'intermediate',
    category_id: 'cat-business-001',
    topic: 'business',
    tags: JSON.stringify(['business', 'idiom', 'positive']),
    image_url: null,
    frequency: 55,
    is_common: 0,
  },
];

/**
 * Bảng tra word_type và subtype:
 *
 * WORD_TYPE:
 * - 'word': từ đơn (verb, noun, adjective, etc.)
 * - 'phrasal_verb': cụm động từ (look forward to, break down)
 * - 'idiom': thành ngữ (break a leg, piece of cake)
 * - 'collocation': từ đi kèm (make a decision, take a break)
 * - 'expression': biểu thức (how are you, thank you)
 *
 * SUBTYPE (cho phrasal verbs):
 * - 'V+To': Verb + To (look forward to + V-ing)
 * - 'V+V-ing': Verb + V-ing (enjoy doing, finish doing)
 * - 'V+N': Verb + Noun (make a decision)
 * - 'V+prep': Verb + preposition (rely on, count on)
 * - 'V+adv': Verb + adverb (break down, give up)
 * - 'V+adv+prep': Verb + adverb + preposition (put up with)
 *
 * CEFR LEVELS:
 * - A1: Beginner (cơ bản)
 * - A2: Elementary (sơ cấp)
 * - B1: Intermediate (trung cấp)
 * - B2: Upper Intermediate (trung cao)
 * - C1: Advanced (cao cấp)
 * - C2: Proficiency (thành thạo)
 */

export default EXAMPLE_VOCABULARIES_V2;
