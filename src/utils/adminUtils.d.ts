/**
 * Función para convertir un usuario a admin
 * Esta función debe ser ejecutada desde la consola del navegador
 * @param userId - El ID del usuario que se quiere convertir a admin
 */
export declare const makeUserAdmin: (userId: string) => Promise<void>;
/**
 * Función para convertir un admin a usuario normal
 * @param userId - El ID del usuario que se quiere convertir a usuario normal
 */
export declare const makeAdminUser: (userId: string) => Promise<void>;
/**
 * Función para verificar el rol del usuario actual
 * @param userId - El ID del usuario a verificar
 */
export declare const checkUserRole: (userId: string) => Promise<string | null>;
/**
 * Función para convertir el usuario actual a admin
 * Requiere que el usuario esté autenticado
 */
export declare const makeCurrentUserAdmin: () => Promise<void>;
