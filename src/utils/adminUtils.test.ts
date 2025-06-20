import { makeUserAdmin, makeAdminUser, checkUserRole, makeCurrentUserAdmin } from './adminUtils';
import * as userApi from '../api/userApi';

let mockCurrentUser: any = { uid: 'abc', email: 'test@a.com' };
jest.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: mockCurrentUser })
}));

describe('adminUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = { uid: 'abc', email: 'test@a.com' };
  });

  describe('makeUserAdmin', () => {
    it('convierte usuario a admin exitosamente', async () => {
      jest.spyOn(userApi, 'updateUserRole').mockResolvedValue(undefined);
      const log = jest.spyOn(console, 'log').mockImplementation();
      await makeUserAdmin('123');
      expect(userApi.updateUserRole).toHaveBeenCalledWith('123', 'admin');
      expect(log).toHaveBeenCalledWith(expect.stringContaining('convertido a admin'));
    });
    it('lanza error si falla', async () => {
      jest.spyOn(userApi, 'updateUserRole').mockRejectedValue(new Error('fail'));
      const error = jest.spyOn(console, 'error').mockImplementation();
      await expect(makeUserAdmin('123')).rejects.toThrow('fail');
      expect(error).toHaveBeenCalled();
    });
  });

  describe('makeAdminUser', () => {
    it('convierte admin a usuario normal exitosamente', async () => {
      jest.spyOn(userApi, 'updateUserRole').mockResolvedValue(undefined);
      const log = jest.spyOn(console, 'log').mockImplementation();
      await makeAdminUser('123');
      expect(userApi.updateUserRole).toHaveBeenCalledWith('123', 'user');
      expect(log).toHaveBeenCalledWith(expect.stringContaining('convertido a usuario normal'));
    });
    it('lanza error si falla', async () => {
      jest.spyOn(userApi, 'updateUserRole').mockRejectedValue(new Error('fail'));
      const error = jest.spyOn(console, 'error').mockImplementation();
      await expect(makeAdminUser('123')).rejects.toThrow('fail');
      expect(error).toHaveBeenCalled();
    });
  });

  describe('checkUserRole', () => {
    it('devuelve el rol si el perfil existe', async () => {
      jest.spyOn(userApi, 'getUserProfile').mockResolvedValue({ displayName: 'Test', email: 'a@a.com', role: 'admin', uid: '1', joinDate: '2024-01-01' });
      const log = jest.spyOn(console, 'log').mockImplementation();
      const role = await checkUserRole('123');
      expect(role).toBe('admin');
      expect(log).toHaveBeenCalledWith(expect.stringContaining('Usuario: Test'));
    });
    it('devuelve null si no hay perfil', async () => {
      jest.spyOn(userApi, 'getUserProfile').mockResolvedValue(null);
      const log = jest.spyOn(console, 'log').mockImplementation();
      const role = await checkUserRole('123');
      expect(role).toBeNull();
      expect(log).toHaveBeenCalledWith(expect.stringContaining('No se encontró perfil'));
    });
    it('devuelve null y loguea error si hay excepción', async () => {
      jest.spyOn(userApi, 'getUserProfile').mockRejectedValue(new Error('fail'));
      const error = jest.spyOn(console, 'error').mockImplementation();
      const role = await checkUserRole('123');
      expect(role).toBeNull();
      expect(error).toHaveBeenCalled();
    });
  });

  describe('makeCurrentUserAdmin', () => {
    it('convierte el usuario actual a admin si está autenticado', async () => {
      const update = jest.spyOn(userApi, 'updateUserRole').mockResolvedValue(undefined);
      const log = jest.spyOn(console, 'log').mockImplementation();
      await makeCurrentUserAdmin();
      expect(update).toHaveBeenCalledWith('abc', 'admin');
      expect(log).toHaveBeenCalledWith(expect.stringContaining('convertido a admin'));
    });
    it('no hace nada si no hay usuario autenticado', async () => {
      mockCurrentUser = null;
      const log = jest.spyOn(console, 'error').mockImplementation();
      await makeCurrentUserAdmin();
      expect(log).toHaveBeenCalledWith(expect.stringContaining('No hay usuario autenticado'));
    });
    it('lanza error si falla', async () => {
      const update = jest.spyOn(userApi, 'updateUserRole').mockRejectedValue(new Error('fail'));
      const error = jest.spyOn(console, 'error').mockImplementation();
      await expect(makeCurrentUserAdmin()).rejects.toThrow('fail');
      expect(error).toHaveBeenCalled();
    });
  });
}); 