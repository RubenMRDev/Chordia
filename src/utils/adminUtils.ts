import { updateUserRole, getUserProfile } from '../firebase/userService';

/**
 * Función para convertir un usuario a admin
 * Esta función debe ser ejecutada desde la consola del navegador
 * @param userId - El ID del usuario que se quiere convertir a admin
 */
export const makeUserAdmin = async (userId: string): Promise<void> => {
  try {
    await updateUserRole(userId, 'admin');
    console.log(`✅ Usuario ${userId} convertido a admin exitosamente`);
  } catch (error) {
    console.error(`❌ Error al convertir usuario a admin:`, error);
    throw error;
  }
};

/**
 * Función para convertir un admin a usuario normal
 * @param userId - El ID del usuario que se quiere convertir a usuario normal
 */
export const makeAdminUser = async (userId: string): Promise<void> => {
  try {
    await updateUserRole(userId, 'user');
    console.log(`✅ Usuario ${userId} convertido a usuario normal exitosamente`);
  } catch (error) {
    console.error(`❌ Error al convertir admin a usuario:`, error);
    throw error;
  }
};

/**
 * Función para verificar el rol del usuario actual
 * @param userId - El ID del usuario a verificar
 */
export const checkUserRole = async (userId: string): Promise<string | null> => {
  try {
    const profile = await getUserProfile(userId);
    if (profile) {
      console.log(`👤 Usuario: ${profile.displayName}`);
      console.log(`📧 Email: ${profile.email}`);
      console.log(`🔑 Rol: ${profile.role}`);
      return profile.role;
    } else {
      console.log(`❌ No se encontró perfil para el usuario ${userId}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error al verificar rol del usuario:`, error);
    return null;
  }
};

/**
 * Función para convertir el usuario actual a admin
 * Requiere que el usuario esté autenticado
 */
export const makeCurrentUserAdmin = async (): Promise<void> => {
  try {
    // Obtener el usuario actual desde Firebase Auth
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('❌ No hay usuario autenticado');
      return;
    }
    
    await updateUserRole(currentUser.uid, 'admin');
    console.log(`✅ Usuario actual (${currentUser.email}) convertido a admin exitosamente`);
    console.log('🔄 Recarga la página para ver los cambios');
  } catch (error) {
    console.error(`❌ Error al convertir usuario actual a admin:`, error);
    throw error;
  }
};

/**
 * Ayudas de administracion que se llaman a mano desde la consola del
 * navegador. Se declara la forma en vez de castear a `any` cuatro veces, para
 * que el nombre y la firma de cada una queden comprobados.
 */
interface AdminConsole {
  makeUserAdmin: typeof makeUserAdmin;
  makeAdminUser: typeof makeAdminUser;
  checkUserRole: typeof checkUserRole;
  makeCurrentUserAdmin: typeof makeCurrentUserAdmin;
}

if (typeof window !== 'undefined') {
  Object.assign(window as unknown as AdminConsole, {
    makeUserAdmin,
    makeAdminUser,
    checkUserRole,
    makeCurrentUserAdmin,
  } satisfies AdminConsole);
} 