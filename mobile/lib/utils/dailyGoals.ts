/**
 * Daily Goals System
 * Track and reward daily learning activities
 */

export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  icon: string;
  xpReward: number;
  completed: boolean;
}

export interface DailyGoalsData {
  date: string;
  goals: DailyGoal[];
  totalXP: number;
  streak: number;
  lastCompletedAt: string | null;
}

/**
 * Get default daily goals
 */
export function getDefaultDailyGoals(): DailyGoal[] {
  return [
    {
      id: 'learn-new',
      title: 'Học từ mới',
      description: 'Học 10 từ vựng mới',
      target: 10,
      current: 0,
      unit: 'từ',
      icon: '📚',
      xpReward: 50,
      completed: false,
    },
    {
      id: 'review-flashcards',
      title: 'Ôn tập flashcards',
      description: 'Hoàn thành 20 thẻ từ',
      target: 20,
      current: 0,
      unit: 'thẻ',
      icon: '🎴',
      xpReward: 30,
      completed: false,
    },
    {
      id: 'complete-quiz',
      title: 'Làm bài tập',
      description: 'Hoàn thành 1 bài test',
      target: 1,
      current: 0,
      unit: 'bài',
      icon: '✅',
      xpReward: 40,
      completed: false,
    },
    {
      id: 'perfect-score',
      title: 'Điểm tuyệt đối',
      description: 'Đạt 100% điểm trong 1 bài',
      target: 1,
      current: 0,
      unit: 'lần',
      icon: '⭐',
      xpReward: 60,
      completed: false,
    },
  ];
}

/**
 * Load daily goals from storage
 */
export async function loadDailyGoals(): Promise<DailyGoalsData> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const today = new Date().toISOString().split('T')[0];

    const stored = await AsyncStorage.getItem('dailyGoals');
    if (stored) {
      const data = JSON.parse(stored) as DailyGoalsData;

      // Reset if new day
      if (data.date !== today) {
        return await resetDailyGoals(data);
      }

      return data;
    }

    // Initialize new goals
    const newData: DailyGoalsData = {
      date: today,
      goals: getDefaultDailyGoals(),
      totalXP: 0,
      streak: 0,
      lastCompletedAt: null,
    };

    await AsyncStorage.setItem('dailyGoals', JSON.stringify(newData));
    return newData;
  } catch (error) {
    console.error('Error loading daily goals:', error);
    return {
      date: new Date().toISOString().split('T')[0],
      goals: getDefaultDailyGoals(),
      totalXP: 0,
      streak: 0,
      lastCompletedAt: null,
    };
  }
}

/**
 * Reset daily goals for new day
 */
async function resetDailyGoals(previousData: DailyGoalsData): Promise<DailyGoalsData> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const today = new Date().toISOString().split('T')[0];

  // Calculate streak
  let streak = previousData.streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check if all goals were completed yesterday
  const allCompletedYesterday = previousData.goals.every((g) => g.completed);
  if (allCompletedYesterday && previousData.date === yesterdayStr) {
    streak += 1;
  } else if (!allCompletedYesterday) {
    streak = 0;
  }

  const newData: DailyGoalsData = {
    date: today,
    goals: getDefaultDailyGoals(),
    totalXP: 0,
    streak,
    lastCompletedAt: null,
  };

  await AsyncStorage.setItem('dailyGoals', JSON.stringify(newData));
  return newData;
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(
  goalId: string,
  increment: number = 1
): Promise<DailyGoalsData | null> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const data = await loadDailyGoals();

    const goal = data.goals.find((g) => g.id === goalId);
    if (!goal) return null;

    const wasCompleted = goal.completed;
    goal.current = Math.min(goal.current + increment, goal.target);

    if (goal.current >= goal.target && !wasCompleted) {
      goal.completed = true;
      data.totalXP += goal.xpReward;
      data.lastCompletedAt = new Date().toISOString();

      // Save total XP to main storage
      await AsyncStorage.setItem('xp', String(data.totalXP));
    }

    await AsyncStorage.setItem('dailyGoals', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return null;
  }
}

/**
 * Check if all daily goals are completed
 */
export function areAllGoalsCompleted(data: DailyGoalsData): boolean {
  return data.goals.every((g) => g.completed);
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage(data: DailyGoalsData): number {
  const completedGoals = data.goals.filter((g) => g.completed).length;
  return Math.round((completedGoals / data.goals.length) * 100);
}

/**
 * Format goal progress text
 */
export function formatGoalProgress(goal: DailyGoal): string {
  return `${goal.current}/${goal.target} ${goal.unit}`;
}

/**
 * Get streak reward bonus
 */
export function getStreakReward(streak: number): number {
  if (streak >= 30) return 100;
  if (streak >= 14) return 50;
  if (streak >= 7) return 25;
  if (streak >= 3) return 10;
  return 0;
}

/**
 * Get streak message
 */
export function getStreakMessage(streak: number): string {
  if (streak >= 30) return '🔥 Tuyệt vời! 30 ngày liên tục!';
  if (streak >= 14) return '💪 2 tuần học đều đặn!';
  if (streak >= 7) return '⭐ 1 tuần hết mình!';
  if (streak >= 3) return '👍 Bắt đầu có chuỗi tốt!';
  if (streak >= 1) return '🎯 Tiếp tục duy trì!';
  return '📅 Hãy bắt đầu chuỗi ngày của bạn!';
}
