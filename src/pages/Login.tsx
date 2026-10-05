import { useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useHookForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h2>LOGIN</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input type="email" {...register('email')} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" {...register('password')} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cargando...' : 'Login'}
        </button>
      </form>
      <br></br>
      <Link to="/register">
        <button type="button">Crear cuenta</button>
      </Link>
    </div>
  );
};

export default Login;
