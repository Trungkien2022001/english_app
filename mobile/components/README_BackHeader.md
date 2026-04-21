# 📱 BackHeader Component - Hướng dẫn sử dụng

## Cách dùng đơn giản nhất:

### 1. Import component
```typescript
import BackHeader from '../../components/BackHeader';
```

### 2. Dùng trong screen

#### Cơ bản (chỉ có back button và title):
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackHeader from '../../components/BackHeader';

export default function MyScreen() {
  return (
    <View style={styles.container}>
      {/* Back Header */}
      <BackHeader title="Tiêu đề screen" />

      {/* Content */}
      <View style={styles.content}>
        <Text>Nội dung screen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
```

#### Có custom component bên phải:
```typescript
import BackHeader from '../../components/BackHeader';
import { Text, TouchableOpacity } from 'react-native';

export default function MyScreen() {
  const rightComponent = (
    <TouchableOpacity onPress={() => alert('Menu')}>
      <Text>⋯</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <BackHeader 
        title="My Screen" 
        rightComponent={rightComponent}
      />
      {/* Content */}
    </View>
  );
}
```

#### Không có title (chỉ back button):
```typescript
<View>
  <BackHeader showBack={true} />
  {/* Content */}
</View>
```

#### Không có back button (chỉ title):
```typescript
<View>
  <BackHeader 
    title="Title Only" 
    showBack={false}
  />
  {/* Content */}
</View>
```

## Props:

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `title` | string | - | Tiêu đề của screen |
| `showBack` | boolean | true | Hiển thị back button |
| `rightComponent` | ReactNode | - | Component tùy chỉnh bên phải |

## Ví dụ với các screen hiện có:

### History Screen:
```typescript
// Thay thế toàn bộ header cũ
import BackHeader from '../../components/BackHeader';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <BackHeader title="Lịch sử bài test" />
      
      {/* Rest of content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>
            Chưa có bài test nào. Hãy bắt đầu làm bài tập!
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

// Remove old header styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // ... rest styles
  // XÓA headerContainer, title styles cũ
});
```

### Exercises Screen:
```typescript
import BackHeader from '../../components/BackHeader';

export default function ExercisesScreen() {
  return (
    <View style={styles.container}>
      <BackHeader title="Danh sách bài tập" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : exercises.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có bài tập nào</Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => /* ... */}
        />
      )}
    </View>
  );
}
```

### Import Dataset Screen:
```typescript
import BackHeader from '../../components/BackHeader';

export default function ImportDatasetScreen() {
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <BackHeader title="Import Dataset" />
      
      <View style={styles.content}>
        {/* Options */}
      </View>
    </View>
  );
}
```

## ✨ Features:

- ✅ **SafeArea aware** - Tự động padding cho iPhone notch/Dynamic Island
- ✅ **Back button** - Quay lại screen trước
- ✅ **Title centered** - Tiêu đề ở giữa
- ✅ **Right slot** - Thêm button/action bên phải
- ✅ **Consistent height** - 56px (Material Design standard)
- ✅ **Border bottom** - Phân tách header với content

## 🎨 Style:

- Background: White (#ffffff)
- Border: 1px solid #e5e5e5
- Back button color: Blue (#0ea5e9)
- Title: Bold, dark (#1a1a1a)
- Height: 56px (icon + text)

## 📱 Screens nên dùng BackHeader:

1. ✅ History detail
2. ✅ Exercise detail  
3. ✅ Import dataset
4. ✅ Template view
5. ✅ Admin screens
6. ❌ Tab screens (có navigation bar riêng)

## 🔄 Từ old header sang BackHeader:

### Before:
```typescript
<SafeAreaView style={styles.container}>
  <View style={styles.headerContainer}>
    <Text style={styles.title}>Lịch sử bài test</Text>
  </View>
  {/* Content */}
</SafeAreaView>
```

### After:
```typescript
<View style={styles.container}>
  <BackHeader title="Lịch sử bài test" />
  {/* Content */}
</View>
```

---

**Simple & Clean! 🎉**
