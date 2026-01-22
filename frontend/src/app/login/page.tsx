'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '@/lib/graphql/mutations';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import { AuthPayload } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('admin@seed28.com');
  const [password, setPassword] = useState('seed28');
  const [error, setError] = useState('');

  const [login, { loading }] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      setAuth(data.login.user, data.login.accessToken);
      router.push('/dashboard');
    },
    onError: (err) => {
      setError(err.message || 'Error al iniciar sesion');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    login({
      variables: {
        input: { email, password },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <span className="text-white font-semibold text-2xl">Bulltrack</span>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Bienvenido
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Ingresa tus credenciales para acceder
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contrasena"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contrasena"
              required
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Iniciar Sesion
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              Credenciales de prueba:
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              <span className="text-emerald-400">admin@seed28.com</span> / <span className="text-emerald-400">seed28</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
