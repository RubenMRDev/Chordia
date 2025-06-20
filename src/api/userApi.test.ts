import * as userService from '../firebase/userService';
import * as userApi from './userApi';

describe('userApi', () => {
  const mockProfile = {
    uid: 'test-uid',
    displayName: 'Test User',
    email: 'test@example.com',
    joinDate: '2024-01-01',
    role: 'user',
    socialLinks: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUserProfile calls userService.getUserProfile', async () => {
    const spy = jest.spyOn(userService, 'getUserProfile').mockResolvedValue(mockProfile as any);
    const result = await userApi.getUserProfile('test-uid');
    expect(spy).toHaveBeenCalledWith('test-uid');
    expect(result).toEqual(mockProfile);
  });

  it('createUserProfile calls userService.createUserProfile', async () => {
    const spy = jest.spyOn(userService, 'createUserProfile').mockResolvedValue();
    await userApi.createUserProfile(mockProfile as any);
    expect(spy).toHaveBeenCalledWith(mockProfile);
  });

  it('updateUserProfile calls userService.updateUserProfile', async () => {
    const spy = jest.spyOn(userService, 'updateUserProfile').mockResolvedValue();
    await userApi.updateUserProfile('test-uid', { displayName: 'New Name' });
    expect(spy).toHaveBeenCalledWith('test-uid', { displayName: 'New Name' });
  });

  it('deleteUserProfile calls userService.deleteUserProfile', async () => {
    const spy = jest.spyOn(userService, 'deleteUserProfile').mockResolvedValue();
    await userApi.deleteUserProfile('test-uid');
    expect(spy).toHaveBeenCalledWith('test-uid');
  });

  it('updateUserRole calls userService.updateUserRole', async () => {
    const spy = jest.spyOn(userService, 'updateUserRole').mockResolvedValue();
    await userApi.updateUserRole('test-uid', 'admin');
    expect(spy).toHaveBeenCalledWith('test-uid', 'admin');
  });
}); 