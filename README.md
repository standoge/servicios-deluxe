# servicios-deluxe
Sistema de gestión de servicios y equipo como trabajo final de la asignatura de SGI.

# Ejecutar
```bash
npm run start  #si usas npm
pnpm start     #si usas pnpm
```

## Actulizar bd
Actualizar los modelos de la base de datos a partir de los modelos existentes.

```bash
pnpm sequelize-auto -o "./src/models" -d railway -h host -u postgres -x pasword -p 39834 -e postgres # si usas npm reemplaza 'pnpm' por 'npx'
```

> [!NOTE]
> Se debe de reemplazar los archivos de .js generados a .cjs para ser usados (revisar como se usa en init-models.cjs) 

# Configuraciones por defecto

- Vista default 'login.hbs'
- Layout default 'main.hbs'. En esta vista se debe de definir el contenido que se quiere que todas las vistgas tengan por defecto, por ejemplo un header y un footer.
- Endpoint default 'login.routes.js'
- En `.env` con las credenciales de la base de datos debe de estar en el raíz, a nivel de `src` y `views`.

## Variables de entorno

| Varible | Descripción                  |
|---------------|-----------------------------|
| DB_USER | Nombre de usuario            |
| DB_HOST| Dirección del servidor       |
| DB_DATABASE| Nombre de la base de datos   |
| DB_PASSWORD| Contraseña de acceso         |
| DB_PORT | Puerto de conexión           |

# Convenciones

- Variables, constantes, funciones y métodos en camelCase e Inglés.