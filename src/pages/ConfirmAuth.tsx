import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Input, Button, cn } from '../components/UI';
import { ShieldCheck, RefreshCw, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const ConfirmAuth: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [canResend, setCanResend] = useState(false);
  
  const { confirmAuth, resendAuthCode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await confirmAuth(code);
      if (response.success) {
        navigate('/');
      } else {
        setError(response.error?.message || 'Código inválido');
      }
    } catch (err) {
      setError('Erro ao validar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      await resendAuthCode();
      setTimeRemaining(180);
      setCanResend(false);
    } catch (err) {
      setError('Erro ao reenviar código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Verificação</h1>
        <p className="text-slate-500 text-sm mt-1 text-center">
          Enviamos um código de 6 dígitos para o seu dispositivo.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <div className="w-full">
            <Input
              label="Código de Verificação"
              placeholder="123456"
              maxLength={6}
              className="text-center text-2xl tracking-[0.5em] font-bold"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={16} />
            <span>O código expira em: <span className="font-bold text-slate-900">{formatTime(timeRemaining)}</span></span>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
            disabled={code.length !== 6}
          >
            Confirmar Identidade
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={cn(
              "flex items-center gap-2 text-sm font-semibold transition-colors",
              canResend ? "text-indigo-600 hover:text-indigo-700" : "text-slate-300 cursor-not-allowed"
            )}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Reenviar Código
          </button>
        </div>
      </form>
    </motion.div>
  );
};
