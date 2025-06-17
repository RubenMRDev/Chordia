# Chordia Backend API

Este backend expone endpoints REST para acceder a la base de datos de Firebase (Firestore) de Chordia.

## Pasos para usar

1. **Instala las dependencias:**

   ```bash
   npm install
   ```

2. **Agrega tu archivo de credenciales:**
   - Descarga el archivo `serviceAccountKey.json` desde la consola de Firebase (Configuración del proyecto > Cuentas de servicio > Generar nueva clave privada).
   - Coloca el archivo en la carpeta `api/`.
   - Reemplaza `<TU_PROJECT_ID>` en `firebase.js` por el ID de tu proyecto de Firebase.

3. **Inicia el servidor:**

   ```bash
   npm start
   ```

   El backend estará disponible en `http://localhost:4000`.

## Endpoints disponibles

- `GET    /songs`           → Lista todas las canciones
- `GET    /songs/:id`       → Obtiene una canción por ID
- `POST   /songs`           → Crea una nueva canción
- `PUT    /songs/:id`       → Actualiza una canción existente
- `DELETE /songs/:id`       → Elimina una canción 