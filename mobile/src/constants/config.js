const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android Emulator
// const API_BASE_URL = 'http://localhost:5000/api'; // iOS Simulator  
// const API_BASE_URL = 'http://192.168.1.100:5000/api'; // Physical device - thay đổi IP theo mạng

export const CONFIG = {
  API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },
    CLASSES: {
      LIST: '/classes',
      DETAIL: '/classes',
      REGISTER: '/classes/register',
      UNREGISTER: '/classes/unregister'
    },
    MEMBERSHIPS: {
      LIST: '/memberships',
      PURCHASE: '/memberships/purchase'
    },
    PAYMENTS: {
      LIST: '/payments',
      CREATE: '/payments'
    },
    USERS: {
      PROFILE: '/users/profile',
      UPDATE: '/users/profile',
      ATTENDANCE: '/users/attendance'
    },
    SERVICES: {
      LIST: '/services',
      DETAIL: '/services'
    }
  },
  STORAGE_KEYS: {
    TOKEN: '@gym_app_token',
    USER: '@gym_app_user',
    THEME: '@gym_app_theme'
  },
  COLORS: {
    PRIMARY: '#FF6B6B',
    SECONDARY: '#4ECDC4',
    SUCCESS: '#45B7D1',
    WARNING: '#FFA07A',
    ERROR: '#FF6B6B',
    DARK: '#2C3E50',
    LIGHT: '#ECF0F1',
    WHITE: '#FFFFFF',
    BLACK: '#000000'
  },
  FONTS: {
    REGULAR: 'System',
    BOLD: 'System',
    LIGHT: 'System'
  }
};