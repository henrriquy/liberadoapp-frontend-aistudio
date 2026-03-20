import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ConfirmAuth } from './pages/ConfirmAuth';
import { Button } from './components/UI';
import { LogOut, LayoutDashboard, User, Settings, Shield, CheckCircle } from 'lucide-react';
import { cn } from './components/UI';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
    {children}
  </div>
);

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar / Nav */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">L</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">LiberadoApp</span>
        </div>

        <div className="space-y-1 flex-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<User size={20} />} label="Perfil" />
          <NavItem icon={<Shield size={20} />} label="Segurança" />
          <NavItem icon={<Settings size={20} />} label="Configurações" />
        </div>

        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors mt-auto"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bem-vindo, {user?.name}!</h1>
            <p className="text-slate-500">Aqui está o resumo das suas atividades hoje.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role === 'operator' ? 'Operador' : 'Administrador'}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Consultas Realizadas" value="1,284" trend="+12%" />
          <StatCard title="Background Checks" value="452" trend="+5%" />
          <StatCard title="Alertas Ativos" value="12" trend="-2" negative />
        </div>

        <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Atividades Recentes</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Consulta de CPF realizada</p>
                    <p className="text-sm text-slate-500">Há {i * 15} minutos atrás</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Sucesso</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <a href="#" className={cn(
    "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
    active ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
  )}>
    {icon}
    {label}
  </a>
);

const StatCard = ({ title, value, trend, negative = false }: { title: string, value: string, trend: string, negative?: boolean }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      <span className={cn(
        "text-xs font-bold px-2 py-1 rounded-lg",
        negative ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
      )}>
        {trend}
      </span>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!isAuthenticated) return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/auth" element={<Navigate to="/auth/sign-in" replace />} />
      
      <Route path="/auth/sign-in" element={
        <PublicRoute>
          <AuthLayout><SignIn /></AuthLayout>
        </PublicRoute>
      } />
      
      <Route path="/auth/sign-up" element={
        <PublicRoute>
          <AuthLayout><SignUp /></AuthLayout>
        </PublicRoute>
      } />
      
      <Route path="/auth/forgot-password" element={
        <PublicRoute>
          <AuthLayout><ForgotPassword /></AuthLayout>
        </PublicRoute>
      } />

      <Route path="/auth/confirm-auth" element={
        <PublicRoute>
          <AuthLayout><ConfirmAuth /></AuthLayout>
        </PublicRoute>
      } />

      <Route path="/auth/confirm-signup" element={
        <PublicRoute>
          <AuthLayout>
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verifique seu Email</h1>
              <p className="text-slate-500 mb-6">Enviamos um link de confirmação para o seu email. Por favor, clique no link para ativar sua conta.</p>
              <Link to="/auth/sign-in">
                <Button className="w-full">Ir para o Login</Button>
              </Link>
            </div>
          </AuthLayout>
        </PublicRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
