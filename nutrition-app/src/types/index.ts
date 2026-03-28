export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  provider: 'email' | 'google' | 'facebook';
  profile?: UserProfile;
}

export interface UserProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female' | 'other';
}

export interface FoodItem {
  name: string;
  weight: number; // grams
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
}

export interface NutritionResult {
  foods: FoodItem[];
  total: {
    carbs: number;
    protein: number;
    fat: number;
    calories: number;
  };
  imageAnalysis?: boolean;
  estimatedWeights?: boolean;
}

export type MessageType = 'user' | 'assistant' | 'loading' | 'error';

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  nutrition?: NutritionResult;
  imageUri?: string;
  timestamp: Date;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ProfileSetup: { user: Partial<User> };
  Chat: undefined;
};
