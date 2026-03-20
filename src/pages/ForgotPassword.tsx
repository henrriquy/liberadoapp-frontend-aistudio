import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Input, Button } from '../components/UI';
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      setError('Usuário não encontrado ou erro no servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-slate-100 text-center"
      >
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Enviado!</h1>
        <p className="text-slate-500 mb-8">
          Enviamos as instruções de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
        </p>
        <Link to="/auth/sign-in" className="inline-flex items-center text-indigo-600 font-bold hover:gap-2 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
          <KeyRound className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Recuperar Senha</h1>
        <p className="text-slate-500 text-sm mt-1 text-center">
          Informe seu email para receber um link de redefinição
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email de Cadastro"
          type="email"
          placeholder="exemplo@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
        >
          Enviar Link de Recuperação
        </Button>

        <div className="text-center">
          <Link 
            to="/auth/sign-in" 
            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o login
          </Link>
        </div>
      </form>
    </motion.div>
  );
};
