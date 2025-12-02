# Fase 1: Autenticación y Seguridad

**Tiempo estimado**: 8-10 horas
**Prioridad**: 🔴 Crítica
**Dependencias**: Ninguna

---

## Objetivos

Implementar un sistema de autenticación seguro para proteger el dashboard de creación de artículos. El sistema debe ser simple pero robusto, utilizando best practices de seguridad web.

## Stack Técnico

- **Auth.js (NextAuth)** v5 - Framework de autenticación
- **Bcrypt** - Hashing de passwords
- **Jose** - Manejo de JWT
- **Zod** - Validación de credenciales
- **Astro Middleware** - Protección de rutas

## Estructura de Archivos

```
src/
├── pages/
│   ├── dashboard/
│   │   └── login.astro              # Página de login
│   └── api/
│       └── auth/
│           ├── login.ts              # POST /api/auth/login
│           ├── logout.ts             # POST /api/auth/logout
│           └── session.ts            # GET /api/auth/session
├── middleware/
│   └── auth.ts                       # Middleware de autenticación
├── lib/
│   └── auth/
│       ├── session.ts                # Gestión de sesiones
│       ├── password.ts               # Hash y verificación
│       └── config.ts                 # Configuración de auth
└── types/
    └── auth.ts                       # TypeScript interfaces
```

## Paso 1: Instalación de Dependencias

```bash
npm install bcryptjs jose
npm install -D @types/bcryptjs
```

### package.json actualizado
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "jose": "^5.2.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6"
  }
}
```

## Paso 2: Variables de Entorno

### .env.local
```env
# Autenticación
AUTH_SECRET=tu-secreto-minimo-32-caracteres-aleatorios-muy-seguros
AUTH_USERNAME=admin
AUTH_PASSWORD_HASH=$2b$12$EXAMPLE_HASH_GENERADO_CON_BCRYPT

# Sesión
SESSION_MAX_AGE=1800000  # 30 minutos en ms
SESSION_COOKIE_NAME=dashboard_session
```

### Generar hash de password
```typescript
// scripts/generate-password-hash.ts
import bcrypt from 'bcryptjs';

async function generateHash(password: string) {
  const hash = await bcrypt.hash(password, 12);
  console.log('Password hash:', hash);
  console.log('\nAgrega esto a tu .env:');
  console.log(`AUTH_PASSWORD_HASH=${hash}`);
}

// Uso: npx tsx scripts/generate-password-hash.ts
generateHash('tu-password-super-seguro');
```

## Paso 3: Types y Schemas

### src/types/auth.ts
```typescript
import { z } from 'zod';

// Schema de validación para login
export const LoginSchema = z.object({
  username: z.string().min(3, 'Usuario debe tener al menos 3 caracteres'),
  password: z.string().min(8, 'Password debe tener al menos 8 caracteres'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// Tipo de sesión
export interface Session {
  userId: string;
  username: string;
  createdAt: number;
  expiresAt: number;
}

// Payload del JWT
export interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}
```

## Paso 4: Librería de Autenticación

### src/lib/auth/password.ts
```typescript
import bcrypt from 'bcryptjs';

/**
 * Hash de password con bcrypt (12 rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Verificar password contra hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

### src/lib/auth/session.ts
```typescript
import { SignJWT, jwtVerify } from 'jose';
import type { Session, JWTPayload } from '@/types/auth';

const SECRET = new TextEncoder().encode(
  import.meta.env.AUTH_SECRET || 'fallback-secret-for-development'
);

const SESSION_MAX_AGE = Number(import.meta.env.SESSION_MAX_AGE) || 1800000; // 30 min

/**
 * Crear token JWT de sesión
 */
export async function createSessionToken(
  userId: string,
  username: string
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_MAX_AGE / 1000;

  return await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(SECRET);
}

/**
 * Verificar y decodificar token JWT
 */
export async function verifySessionToken(
  token: string
): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);

    return {
      userId: payload.userId as string,
      username: payload.username as string,
      createdAt: (payload.iat as number) * 1000,
      expiresAt: (payload.exp as number) * 1000,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Obtener sesión desde cookies
 */
export async function getSession(
  cookies: AstroCookies
): Promise<Session | null> {
  const token = cookies.get(import.meta.env.SESSION_COOKIE_NAME || 'dashboard_session')?.value;

  if (!token) {
    return null;
  }

  return await verifySessionToken(token);
}

/**
 * Destruir sesión
 */
export function destroySession(cookies: AstroCookies): void {
  cookies.delete(import.meta.env.SESSION_COOKIE_NAME || 'dashboard_session', {
    path: '/',
  });
}
```

### src/lib/auth/config.ts
```typescript
export const authConfig = {
  secret: import.meta.env.AUTH_SECRET,
  username: import.meta.env.AUTH_USERNAME || 'admin',
  passwordHash: import.meta.env.AUTH_PASSWORD_HASH,
  sessionMaxAge: Number(import.meta.env.SESSION_MAX_AGE) || 1800000,
  cookieName: import.meta.env.SESSION_COOKIE_NAME || 'dashboard_session',
} as const;
```

## Paso 5: API Endpoints

### src/pages/api/auth/login.ts
```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken } from '@/lib/auth/session';
import { authConfig } from '@/lib/auth/config';
import { LoginSchema } from '@/types/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse body
    const body = await request.json();

    // Validar con Zod
    const credentials = LoginSchema.parse(body);

    // Verificar username
    if (credentials.username !== authConfig.username) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Credenciales inválidas',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar password
    const isValidPassword = await verifyPassword(
      credentials.password,
      authConfig.passwordHash
    );

    if (!isValidPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Credenciales inválidas',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Crear sesión
    const token = await createSessionToken('1', credentials.username);

    // Set cookie
    cookies.set(authConfig.cookieName, token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: authConfig.sessionMaxAge / 1000,
      path: '/',
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login exitoso',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Error de validación Zod
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors[0].message,
          errors: error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### src/pages/api/auth/logout.ts
```typescript
import type { APIRoute } from 'astro';
import { destroySession } from '@/lib/auth/session';

export const POST: APIRoute = async ({ cookies }) => {
  destroySession(cookies);

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Logout exitoso',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

### src/pages/api/auth/session.ts
```typescript
import type { APIRoute } from 'astro';
import { getSession } from '@/lib/auth/session';

export const GET: APIRoute = async ({ cookies }) => {
  const session = await getSession(cookies);

  if (!session) {
    return new Response(
      JSON.stringify({
        authenticated: false,
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: {
        username: session.username,
      },
      expiresAt: session.expiresAt,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

## Paso 6: Middleware de Protección

### src/middleware/auth.ts
```typescript
import { defineMiddleware } from 'astro:middleware';
import { getSession } from '@/lib/auth/session';

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  // Rutas que requieren autenticación
  const protectedPaths = ['/dashboard'];
  const isProtectedPath = protectedPaths.some(path => url.pathname.startsWith(path));

  // Si no es ruta protegida, continuar
  if (!isProtectedPath) {
    return next();
  }

  // Excluir la página de login
  if (url.pathname === '/dashboard/login') {
    return next();
  }

  // Verificar sesión
  const session = await getSession(cookies);

  if (!session) {
    // Redirigir a login si no hay sesión
    return redirect('/dashboard/login');
  }

  // Sesión válida, continuar
  return next();
});
```

### src/middleware/index.ts
```typescript
import { sequence } from 'astro:middleware';
import { onRequest as authMiddleware } from './auth';

export const onRequest = sequence(authMiddleware);
```

## Paso 7: Página de Login

### src/pages/dashboard/login.astro
```astro
---
import BaseLayout from '@/layouts/base/index.astro';
import LoginForm from '@/components/dashboard/LoginForm';

const title = 'Dashboard - Login';
---

<BaseLayout title={title}>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white">Dashboard</h1>
        <p class="text-gray-400 mt-2">Inicia sesión para continuar</p>
      </div>

      <LoginForm client:load />
    </div>
  </div>
</BaseLayout>
```

### src/components/dashboard/LoginForm.tsx
```tsx
import { useState } from 'react';
import type { FormEvent } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al iniciar sesión');
        return;
      }

      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 shadow-xl">
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
          Usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded transition-colors"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
```

## Consideraciones de Seguridad

### 1. Password Hashing
- **Bcrypt con 12 rounds**: Balance entre seguridad y performance
- **Salt automático**: Bcrypt genera salt único por password
- **No almacenar passwords en texto plano**

### 2. JWT Sessions
- **HS256 algorithm**: Simétrico, adecuado para single-server
- **Secret de 32+ caracteres**: Entropy suficiente
- **Expiración de 30 minutos**: Balance seguridad/UX

### 3. Cookies
- **httpOnly**: No accesible desde JavaScript
- **secure**: Solo HTTPS en producción
- **sameSite: strict**: Protección CSRF
- **path: /**: Scope correcto

### 4. Rate Limiting (Opcional - Fase futura)
```typescript
// Implementar con Vercel Rate Limiting o Redis
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxAttempts: 5,
};
```

### 5. Logging (Opcional - Fase futura)
```typescript
// Log de intentos de login fallidos
console.warn(`Failed login attempt for user: ${username} from IP: ${ip}`);
```

## Testing Manual

### 1. Generar password hash
```bash
npx tsx scripts/generate-password-hash.ts
```

### 2. Configurar .env.local
```env
AUTH_SECRET=abc123xyz789...
AUTH_USERNAME=admin
AUTH_PASSWORD_HASH=$2b$12$...
```

### 3. Probar login
```bash
# Iniciar dev server
npm run dev

# Abrir http://localhost:4321/dashboard
# Debe redirigir a /dashboard/login

# Login con credenciales correctas
# Debe redirigir a /dashboard

# Verificar cookie en DevTools
# Nombre: dashboard_session
# httpOnly: true
# secure: false (en dev)
```

### 4. Probar logout
```bash
# Desde /dashboard, llamar:
fetch('/api/auth/logout', { method: 'POST' })

# Cookie debe eliminarse
# Refresh debe redirigir a /login
```

## Mejoras Futuras

1. **Two-Factor Authentication (2FA)**
   - TOTP con Google Authenticator
   - Códigos de backup

2. **Rate Limiting**
   - Límite de intentos por IP
   - Cooldown después de fallos

3. **Session Management**
   - Listar sesiones activas
   - Revocar sesiones remotamente
   - Remember me option

4. **Audit Log**
   - Log de todos los logins
   - Tracking de cambios
   - IP y user agent

5. **Multi-user Support**
   - Base de datos de usuarios
   - Roles y permisos
   - Invitaciones

## Checklist de Implementación

- [ ] Instalar dependencias (bcryptjs, jose)
- [ ] Crear script de generación de hash
- [ ] Configurar variables de entorno
- [ ] Implementar types y schemas
- [ ] Crear lib/auth/* (password, session, config)
- [ ] Implementar API endpoints (login, logout, session)
- [ ] Crear middleware de autenticación
- [ ] Diseñar página de login
- [ ] Crear componente LoginForm
- [ ] Testing manual completo
- [ ] Validar seguridad (cookies, JWT, headers)
- [ ] Documentar proceso

## Resultado Esperado

Al completar esta fase, tendrás:
- ✅ Sistema de autenticación funcional
- ✅ Login/logout seguros
- ✅ Protección de rutas /dashboard/*
- ✅ Sesiones con JWT
- ✅ Cookies httpOnly seguras
- ✅ Validación con Zod
- ✅ UI de login moderna

**Tiempo real estimado**: 8-10 horas

**Siguiente fase**: `02_arquitectura-dashboard.md`
