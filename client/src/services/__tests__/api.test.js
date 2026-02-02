import { authAPI, projectAPI, taskAPI } from '../api';

// Mock axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    }
  };
  return mockAxios;
});

describe('API Service', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('authAPI', () => {
    it('should have login method', () => {
      expect(typeof authAPI.login).toBe('function');
    });

    it('should have register method', () => {
      expect(typeof authAPI.register).toBe('function');
    });

    it('should have getCurrentUser method', () => {
      expect(typeof authAPI.getCurrentUser).toBe('function');
    });
  });

  describe('projectAPI', () => {
    it('should have getAllProjects method', () => {
      expect(typeof projectAPI.getAllProjects).toBe('function');
    });

    it('should have getProject method', () => {
      expect(typeof projectAPI.getProject).toBe('function');
    });

    it('should have createProject method', () => {
      expect(typeof projectAPI.createProject).toBe('function');
    });

    it('should have updateProject method', () => {
      expect(typeof projectAPI.updateProject).toBe('function');
    });

    it('should have deleteProject method', () => {
      expect(typeof projectAPI.deleteProject).toBe('function');
    });
  });

  describe('taskAPI', () => {
    it('should have getAllTasks method', () => {
      expect(typeof taskAPI.getAllTasks).toBe('function');
    });

    it('should have getTask method', () => {
      expect(typeof taskAPI.getTask).toBe('function');
    });

    it('should have createTask method', () => {
      expect(typeof taskAPI.createTask).toBe('function');
    });

    it('should have updateTask method', () => {
      expect(typeof taskAPI.updateTask).toBe('function');
    });

    it('should have deleteTask method', () => {
      expect(typeof taskAPI.deleteTask).toBe('function');
    });
  });
});
