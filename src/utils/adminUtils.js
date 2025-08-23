import { updateUserRole, getUserProfile } from '../firebase/userService';
/**
 * Función para convertir un usuario a admin
 * Esta función debe ser ejecutada desde la consola del navegador
 * @param userId - El ID del usuario que se quiere convertir a admin
 */
export const makeUserAdmin = async (userId) => {
    try {
        await updateUserRole(userId, 'admin');
        console.log(`✅ Usuario ${userId} convertido a admin exitosamente`);
    }
    catch (error) {
        console.error(`❌ Error al convertir usuario a admin:`, error);
        throw error;
    }
};
/**
 * Función para convertir un admin a usuario normal
 * @param userId - El ID del usuario que se quiere convertir a usuario normal
 */
export const makeAdminUser = async (userId) => {
    try {
        await updateUserRole(userId, 'user');
        console.log(`✅ Usuario ${userId} convertido a usuario normal exitosamente`);
    }
    catch (error) {
        console.error(`❌ Error al convertir admin a usuario:`, error);
        throw error;
    }
};
/**
 * Función para verificar el rol del usuario actual
 * @param userId - El ID del usuario a verificar
 */
export const checkUserRole = async (userId) => {
    try {
        const profile = await getUserProfile(userId);
        if (profile) {
            console.log(`👤 Usuario: ${profile.displayName}`);
            console.log(`📧 Email: ${profile.email}`);
            console.log(`🔑 Rol: ${profile.role}`);
            return profile.role;
        }
        else {
            console.log(`❌ No se encontró perfil para el usuario ${userId}`);
            return null;
        }
    }
    catch (error) {
        console.error(`❌ Error al verificar rol del usuario:`, error);
        return null;
    }
};
/**
 * Función para convertir el usuario actual a admin
 * Requiere que el usuario esté autenticado
 */
export const makeCurrentUserAdmin = async () => {
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
    }
    catch (error) {
        console.error(`❌ Error al convertir usuario actual a admin:`, error);
        throw error;
    }
};
// Exponer las funciones globalmente para uso en consola
if (typeof window !== 'undefined') {
    window.makeUserAdmin = makeUserAdmin;
    window.makeAdminUser = makeAdminUser;
    window.checkUserRole = checkUserRole;
    window.makeCurrentUserAdmin = makeCurrentUserAdmin;
}
