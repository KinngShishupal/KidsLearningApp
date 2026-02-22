import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameResult {
  gameId: string;
  gameName: string;
  subject: 'math' | 'science' | 'english';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: number;
  completedSuccessfully: boolean;
}

export interface GameStats {
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  perfectScores: number;
  highestScore: number;
  lastPlayedDate: number;
  consecutiveDays: number;
  mathGamesPlayed: number;
  scienceGamesPlayed: number;
  englishGamesPlayed: number;
  achievements: string[];
}

const STORAGE_KEY = '@learn_with_fun_data';

export const GameTracker = {
  async saveGameResult(result: GameResult): Promise<void> {
    try {
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      const data = existingData ? JSON.parse(existingData) : { results: [], stats: null };
      
      data.results.push(result);
      
      if (data.results.length > 100) {
        data.results = data.results.slice(-100);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      await this.updateStats();
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  },

  async getGameResults(): Promise<GameResult[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.results || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting game results:', error);
      return [];
    }
  },

  async getStats(): Promise<GameStats> {
    try {
      const results = await this.getGameResults();
      
      const totalGamesPlayed = results.length;
      const totalQuestionsAnswered = results.reduce((sum, r) => sum + r.totalQuestions, 0);
      const totalCorrectAnswers = results.reduce((sum, r) => sum + r.correctAnswers, 0);
      const perfectScores = results.filter(r => r.correctAnswers === r.totalQuestions && r.totalQuestions > 0).length;
      const highestScore = Math.max(...results.map(r => r.score), 0);
      
      const mathGamesPlayed = results.filter(r => r.subject === 'math').length;
      const scienceGamesPlayed = results.filter(r => r.subject === 'science').length;
      const englishGamesPlayed = results.filter(r => r.subject === 'english').length;
      
      const lastPlayedDate = results.length > 0 ? results[results.length - 1].timestamp : 0;
      const consecutiveDays = this.calculateStreak(results);
      
      const achievements = this.calculateAchievements(results, {
        totalGamesPlayed,
        perfectScores,
        mathGamesPlayed,
        scienceGamesPlayed,
        englishGamesPlayed,
      });
      
      return {
        totalGamesPlayed,
        totalQuestionsAnswered,
        totalCorrectAnswers,
        perfectScores,
        highestScore,
        lastPlayedDate,
        consecutiveDays,
        mathGamesPlayed,
        scienceGamesPlayed,
        englishGamesPlayed,
        achievements,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        perfectScores: 0,
        highestScore: 0,
        lastPlayedDate: 0,
        consecutiveDays: 0,
        mathGamesPlayed: 0,
        scienceGamesPlayed: 0,
        englishGamesPlayed: 0,
        achievements: [],
      };
    }
  },

  calculateStreak(results: GameResult[]): number {
    if (results.length === 0) return 0;
    
    const dates = results.map(r => {
      const date = new Date(r.timestamp);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    });
    
    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);
    
    let streak = 1;
    const today = new Date();
    const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    if (uniqueDates[0] < todayTimestamp - 86400000) {
      return 0;
    }
    
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = uniqueDates[i] - uniqueDates[i + 1];
      if (diff === 86400000) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  },

  calculateAchievements(results: GameResult[], stats: any): string[] {
    const achievements: string[] = [];
    
    if (stats.totalGamesPlayed >= 1) achievements.push('first_game');
    if (stats.totalGamesPlayed >= 5) achievements.push('5_games');
    if (stats.totalGamesPlayed >= 10) achievements.push('10_games');
    if (stats.totalGamesPlayed >= 20) achievements.push('20_games');
    if (stats.totalGamesPlayed >= 50) achievements.push('50_games');
    
    if (stats.perfectScores >= 1) achievements.push('first_perfect');
    if (stats.perfectScores >= 5) achievements.push('5_perfect');
    if (stats.perfectScores >= 10) achievements.push('10_perfect');
    
    if (stats.mathGamesPlayed >= 5) achievements.push('math_star');
    if (stats.scienceGamesPlayed >= 5) achievements.push('science_explorer');
    if (stats.englishGamesPlayed >= 5) achievements.push('word_wizard');
    
    if (stats.mathGamesPlayed >= 10) achievements.push('math_master');
    if (stats.scienceGamesPlayed >= 10) achievements.push('science_genius');
    if (stats.englishGamesPlayed >= 10) achievements.push('english_expert');
    
    const memoryGames = results.filter(r => r.gameId.includes('memory'));
    if (memoryGames.length >= 5) achievements.push('memory_champion');
    
    const speedGames = results.filter(r => r.gameId.includes('speed'));
    if (speedGames.length >= 5) achievements.push('speed_master');
    
    return achievements;
  },

  async updateStats(): Promise<void> {
    await this.getStats();
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  async getRecentGames(limit: number = 10): Promise<GameResult[]> {
    try {
      const results = await this.getGameResults();
      return results.slice(-limit).reverse();
    } catch (error) {
      console.error('Error getting recent games:', error);
      return [];
    }
  },
};
