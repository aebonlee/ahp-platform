import { authAPI, projectAPI } from './apiService';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console.error to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('authAPI', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    consoleSpy.mockClear();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginResponse = { token: 'jwt-token', user: { id: 1, email: 'test@example.com' } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => loginResponse,
      } as Response);

      const result = await authAPI.login('test@example.com', 'password');

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      });
      expect(result.data).toEqual(loginResponse);
    });

    it('should handle login failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      } as Response);

      const result = await authAPI.login('test@example.com', 'wrongpassword');

      expect(result.error).toBe('Invalid credentials');
    });

    it('should handle network errors during login', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await authAPI.login('test@example.com', 'password');

      expect(result.error).toBe('Network error occurred');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role: 'evaluator'
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, user: registerData }),
      } as Response);

      const result = await authAPI.register(registerData);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      expect(result.data?.success).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user when token exists', async () => {
      const userData = { id: 1, email: 'test@example.com', role: 'evaluator' };
      localStorageMock.getItem.mockReturnValueOnce('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => userData,
      } as Response);

      const result = await authAPI.getCurrentUser();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/me'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
      });
      expect(result.data).toEqual(userData);
    });

    it('should return error when no token exists', async () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const result = await authAPI.getCurrentUser();

      expect(result.error).toBe('No authentication token found');
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      authAPI.logout();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });
});

describe('projectAPI', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    consoleSpy.mockClear();
  });

  describe('getProjects', () => {
    it('should fetch projects list', async () => {
      const projects = [
        { id: 1, title: 'Project 1' },
        { id: 2, title: 'Project 2' }
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => projects,
      } as Response);

      const result = await projectAPI.getProjects();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/projects'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result.data).toEqual(projects);
    });

    it('should handle projects fetch error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Unauthorized' }),
      } as Response);

      const result = await projectAPI.getProjects();

      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('createProject', () => {
    it('should create new project', async () => {
      const projectData = { title: 'New Project', description: 'Description' };
      const createdProject = { id: 1, ...projectData };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdProject,
      } as Response);

      const result = await projectAPI.createProject(projectData);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/projects'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      expect(result.data).toEqual(createdProject);
    });

    it('should handle project creation error', async () => {
      const projectData = { title: 'New Project', description: 'Description' };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid data' }),
      } as Response);

      const result = await projectAPI.createProject(projectData);

      expect(result.error).toBe('Invalid data');
    });
  });

  describe('getProject', () => {
    it('should fetch single project', async () => {
      const project = { id: 1, title: 'Test Project' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => project,
      } as Response);

      const result = await projectAPI.getProject('1');

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/projects/1'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result.data).toEqual(project);
    });
  });

  describe('updateProject', () => {
    it('should update project', async () => {
      const updateData = { title: 'Updated Project' };
      const updatedProject = { id: 1, ...updateData };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProject,
      } as Response);

      const result = await projectAPI.updateProject('1', updateData);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/projects/1'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      expect(result.data).toEqual(updatedProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete project', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const result = await projectAPI.deleteProject('1');

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/projects/1'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result.data?.success).toBe(true);
    });
  });
});