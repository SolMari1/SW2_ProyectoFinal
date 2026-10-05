import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await registerAuth(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nombre</label>
          <input type="text" {...register('name')} />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
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
          {isSubmitting ? 'Cargando...' : 'Registrar'}
        </button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
};

export default Register;
