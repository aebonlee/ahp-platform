// API 설정 - 백엔드 서버 URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' 
    : 'https://ahp-backend.onrender.com');

// API 엔드포인트
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify'
  },
  // Projects
  PROJECTS: {
    LIST: '/api/projects',
    CREATE: '/api/projects',
    GET: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`
  },
  // Criteria
  CRITERIA: {
    LIST: (projectId: string) => `/api/projects/${projectId}/criteria`,
    CREATE: '/api/criteria',
    UPDATE: (id: string) => `/api/criteria/${id}`,
    DELETE: (id: string) => `/api/criteria/${id}`
  },
  // Alternatives
  ALTERNATIVES: {
    LIST: (projectId: string) => `/api/projects/${projectId}/alternatives`,
    CREATE: '/api/alternatives',
    UPDATE: (id: string) => `/api/alternatives/${id}`,
    DELETE: (id: string) => `/api/alternatives/${id}`
  },
  // Evaluations
  EVALUATIONS: {
    SUBMIT: '/api/evaluate',
    GET_MATRIX: (projectId: string) => `/api/matrix/${projectId}`,
    COMPUTE: '/api/compute',
    RESULTS: (projectId: string) => `/api/results/${projectId}`
  },
  // Export
  EXPORT: {
    EXCEL: (projectId: string) => `/api/export/${projectId}/excel`,
    PDF: (projectId: string) => `/api/export/${projectId}/pdf`
  }
};