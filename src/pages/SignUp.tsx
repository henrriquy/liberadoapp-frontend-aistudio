import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Input, Button, cn } from '../components/UI';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    company: '',
    agreements: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    const val = formData.password;
    if (!val) return null;
    return {
      hasUpperCase: /[A-Z]/.test(val),
      hasLowerCase: /[a-z]/.test(val),
      hasNumeric: /[0-9]/.test(val),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val),
      isLengthValid: val.length >= 8
    };
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    if (!passwordStrength) return false;
    return Object.values(passwordStrength).every(Boolean);
  }, [passwordStrength]);

  const isFormValid = useMemo(() => {
    return (
      formData.name.length >= 3 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      isPasswordValid &&
      formData.password === formData.passwordConfirm &&
      formData.agreements
    );
  }, [formData, isPasswordValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.email.split('@')[0],
        company: formData.company,
        agreements: formData.agreements
      });

      if (response.success) {
        navigate('/auth/confirm-signup');
      } else {
        setError(response.error?.message || 'Erro ao cadastrar');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-xl border border-slate-100"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Criar Conta</h1>
        <p className="text-slate-500 text-sm mt-1">Junte-se ao LiberadoApp hoje</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="exemplo@empresa.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <Input
          label="Empresa (Opcional)"
          placeholder="Nome da sua empresa"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="••••••••"
            value={formData.passwordConfirm}
            onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
            required
            error={formData.passwordConfirm && formData.password !== formData.passwordConfirm ? 'As senhas não coincidem' : undefined}
          />
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requisitos da Senha:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              <StrengthItem label="8+ caracteres" met={passwordStrength?.isLengthValid} />
              <StrengthItem label="Letra maiúscula" met={passwordStrength?.hasUpperCase} />
              <StrengthItem label="Letra minúscula" met={passwordStrength?.hasLowerCase} />
              <StrengthItem label="Número" met={passwordStrength?.hasNumeric} />
              <StrengthItem label="Caractere especial" met={passwordStrength?.hasSpecialChar} />
            </div>
          </div>
        )}

        <label className="flex items-start space-x-3 cursor-pointer group pt-2">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            checked={formData.agreements}
            onChange={(e) => setFormData({ ...formData, agreements: e.target.checked })}
            required
          />
          <span className="text-sm text-slate-600 leading-relaxed">
            Eu li e aceito os <a href="#" className="text-indigo-600 font-semibold hover:underline">Termos de Serviço</a> e a <a href="#" className="text-indigo-600 font-semibold hover:underline">Política de Privacidade</a>.
          </span>
        </label>

        <Button 
          type="submit" 
          className="w-full mt-4" 
          isLoading={isLoading}
          disabled={!isFormValid}
        >
          Cadastrar
        </Button>

        <div className="text-center pt-4">
          <p className="text-sm text-slate-500">
            Já tem uma conta?{' '}
            <Link 
              to="/auth/sign-in" 
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

const StrengthItem = ({ label, met }: { label: string; met?: boolean }) => (
  <div className="flex items-center gap-2">
    <CheckCircle2 className={cn("w-3.5 h-3.5", met ? "text-emerald-500" : "text-slate-300")} />
    <span className={cn("text-xs transition-colors", met ? "text-emerald-700 font-medium" : "text-slate-400")}>
      {label}
    </span>
  </div>
);
