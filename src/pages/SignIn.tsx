import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Input, Button, cn } from '../components/UI';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const SignIn: React.FC = () => {
  // State for form fields as per spec
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI States
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'warning' } | null>(null);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Validations as per spec:
  // Email: required, valid email
  // Password: required, min 6 chars
  const isEmailValid = useMemo(() => {
    return email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const isPasswordValid = useMemo(() => {
    return password.length >= 6;
  }, [password]);

  const isFormValid = isEmailValid && isPasswordValid;

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setAlert(null);

    try {
      const response = await signIn({ email, password, rememberMe });
      
      if (response.success) {
        // Se sucesso: redireciona para / (dashboard)
        navigate('/');
      } else {
        // Tratamento de erros conforme especificação:
        const errorCode = response.error?.code;
        
        if (errorCode === 'INVALID_CREDENTIALS') {
          // Se erro 401: mostra alerta "Credenciais inválidas"
          setAlert({ message: 'Credenciais inválidas', type: 'error' });
        } else if (errorCode === 'ACCOUNT_BLOCKED') {
          // Se erro 403: mostra alerta "Sua conta está bloqueada"
          setAlert({ message: 'Sua conta está bloqueada', type: 'error' });
        } else if (errorCode === 'TOO_MANY_ATTEMPTS') {
          // Se erro 429: mostra alerta "Muitas tentativas. Tente novamente em 15 minutos"
          setAlert({ message: 'Muitas tentativas. Tente novamente em 15 minutos', type: 'warning' });
        } else {
          setAlert({ message: response.error?.message || 'Erro ao entrar', type: 'error' });
        }
      }
    } catch (err) {
      setAlert({ message: 'Erro inesperado. Tente novamente.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container w-full max-w-md">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white rounded-3xl shadow-xl border border-slate-100"
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-2">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
          </div>

          {alert && (
            <div className={cn(
              "p-4 rounded-xl text-sm font-medium flex items-start gap-3 border",
              alert.type === 'error' ? "bg-red-50 border-red-100 text-red-600" : "bg-amber-50 border-amber-100 text-amber-700"
            )}>
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{alert.message}</span>
            </div>
          )}

          {/* Mat-form-field equivalent for Email */}
          <div className="space-y-1">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              error={email && !isEmailValid ? 'Email inválido' : undefined}
              required
            />
          </div>

          {/* Mat-form-field equivalent for Password */}
          <div className="relative space-y-1">
            <Input
              label="Senha"
              type={hidePassword ? 'password' : 'text'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              error={password && password.length < 6 ? 'Mínimo 6 caracteres' : undefined}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
            >
              {hidePassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Lembrar-me</span>
            </label>
            
            <Link 
              to="/auth/forgot-password" 
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>

          {/* Submit Button - Disabled if invalid as per spec */}
          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
            disabled={!isFormValid}
          >
            Entrar
          </Button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Não tem conta?{' '}
              <Link 
                to="/auth/sign-up" 
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

