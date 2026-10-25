// src/pages/Login.tsx
// Pantalla de inicio de sesión con panel de ayuda y credenciales de prueba predefinidas
import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { TEST_USERS } from '../data/mockUsers';
import { mensajeDeError } from '../lib/errores';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useHookForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const usuario = await login(data);

      // El rol lo define el backend: admin va a los informes, cliente al catálogo
      if (usuario.role === 'admin') {
        navigate('/admin/informes');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(mensajeDeError(err, 'Error al iniciar sesión'));
    }
  };

  // Función de ayuda para autocompletar credenciales con un solo clic
  const handleSeleccionarUsuarioPrueba = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="login-container-con-ayuda">
        {/* Formulario de Login */}
        <div className="login-container">
          <h2>LOGIN</h2>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                {...register('email')}
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>

            <div>
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••"
                {...register('password')}
              />
              {errors.password && <span>{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <br />
          <Link to="/register">
            <button type="button">Crear cuenta</button>
          </Link>

          <p>
            <Link to="/">← Ir al Catálogo sin iniciar sesión</Link>
          </p>
        </div>

        {/* Panel de Credenciales de Prueba Predefinidas */}
        <div className="panel-credenciales-prueba">
          <h3>Usuarios de Prueba Predefinidos</h3>
          <p className="texto-guia-credenciales">
            Haz clic en cualquiera de los usuarios para autocompletar el formulario y probar sus roles:
          </p>

          <div className="lista-usuarios-prueba">
            {TEST_USERS.map((item) => (
              <div
                key={item.user.id}
                className="tarjeta-usuario-prueba-item"
                onClick={() =>
                  handleSeleccionarUsuarioPrueba(item.user.email, item.password)
                }
              >
                <div className="usuario-prueba-cabecera">
                  <strong>{item.user.name}</strong>
                  <span className={`rol-tag-pequeno rol-${item.user.role}`}>
                    {item.user.role === 'admin' ? 'Admin' : 'Cliente'}
                  </span>
                </div>
                <div className="credenciales-detalles">
                  <span><strong>Email:</strong> {item.user.email}</span>
                  <span><strong>Clave:</strong> {item.password}</span>
                </div>
                <p className="descripcion-usuario-prueba">{item.descripcion}</p>
                <button
                  type="button"
                  className="btn-autocompletar-clic"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeleccionarUsuarioPrueba(item.user.email, item.password);
                  }}
                >
                  Usar estas credenciales
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
