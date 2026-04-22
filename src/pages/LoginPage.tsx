import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) navigate('/'); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { if (session) navigate('/'); });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus(null);
    if (!email || !password) { setStatus({ msg: 'Por favor, preencha todos os campos.', type: 'error' }); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login credentials')) throw new Error('Credenciais inválidas. Verifique o email e a password.');
          else if (error.message.includes('Email not confirmed')) throw new Error('Email não confirmado. Por favor, verifique a sua caixa de entrada.');
          throw error;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data?.user?.identities?.length === 0) throw new Error('Este email já está em uso.');
        if (!data.session) {
          setStatus({ msg: 'Conta criada! Por favor, verifique o seu email para confirmar o registo antes de entrar.', type: 'success' });
          setTimeout(() => { setMode('login'); setPassword(''); }, 4000);
        }
      }
    } catch (err: any) { setStatus({ msg: err.message || 'Ocorreu um erro inesperado.', type: 'error' }); } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 min-w-full relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(245, 150, 82, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(230, 118, 38, 0.05), transparent 40%)' }}>
      {/* Mosaic Logo Pattern */}
      <div className="logo-pattern absolute inset-0 z-0"></div>
      
      <div className="bg-white/85 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.05)] w-full max-w-md rounded-[32px] p-10 relative overflow-hidden z-10">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-orange rounded-full opacity-10 blur-2xl z-0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8"><img src="/logo.png" alt="Stat-o Logo" className="w-10 h-10 drop-shadow-sm" /><h1 className="text-3xl font-extrabold tracking-tight text-brand-dark">Stat-o</h1></div>
          <div className="flex p-1 bg-gray-100/80 rounded-xl mb-8">
            <button onClick={() => { setMode('login'); setStatus(null); }} className={`flex-1 py-2 text-sm rounded-lg transition-all ${mode === 'login' ? 'font-bold bg-white shadow-sm text-brand-orange' : 'font-semibold text-gray-500 hover:text-gray-700'}`}>Sign In</button>
            <button onClick={() => { setMode('register'); setStatus(null); }} className={`flex-1 py-2 text-sm rounded-lg transition-all ${mode === 'register' ? 'font-bold bg-white shadow-sm text-brand-orange' : 'font-semibold text-gray-500 hover:text-gray-700'}`}>Create Account</button>
          </div>
          <p className="text-sm text-gray-500 mb-6 text-center font-medium">{mode === 'login' ? 'Bem-vindo de volta! Insira os seus dados.' : 'Junte-se a nós para aceder às métricas.'}</p>
          {status && (<div className={`mb-6 p-4 rounded-xl text-sm font-semibold text-center border block ${status.type === 'success' ? 'bg-brand-orangelight/20 border-brand-orangelight text-brand-orangedark' : 'bg-brand-red/10 border-brand-red/30 text-red-600'}`}>{status.msg}</div>)}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 ml-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@exemplo.com" className="w-full glass-input px-4 py-3 rounded-xl text-sm" /></div>
            <div className="space-y-1.5"><label className="text-xs font-bold text-gray-700 ml-1">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} className="w-full glass-input px-4 py-3 rounded-xl text-sm" /></div>
            <button type="submit" disabled={loading} className={`w-full bg-brand-dark hover:bg-black text-white py-3.5 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : (mode === 'login' ? 'Entrar no Dashboard' : 'Criar Conta')}
            </button>
          </form>
          {mode === 'register' && (<p className="text-xs text-center text-gray-400 mt-6 font-medium">Iremos enviar um email com um link para confirmar o seu acesso.</p>)}
        </div>
      </div>
    </div>
  );
}
