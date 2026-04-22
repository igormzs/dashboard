import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [settings, setSettings] = useState({
    currency: 'EUR',
    showDecimals: true,
    compactMode: false
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (user?.user_metadata) {
      const meta = user.user_metadata;
      setFirstName(meta.first_name || '');
      setLastName(meta.last_name || '');
      setUsername(meta.username || '');
      setAvatarUrl(meta.avatar_url || '');
      if (meta.settings) {
        setSettings({ ...settings, ...meta.settings });
      }
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (2MB)
    if (!file.type.startsWith('image/')) {
      setStatus({ msg: 'Por favor, selecione uma imagem válida.', type: 'error' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setStatus({ msg: 'A imagem deve ter menos de 2MB.', type: 'error' });
      return;
    }

    setUploading(true);
    setStatus({ msg: 'A carregar imagem...', type: 'info' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      setStatus({ msg: 'Imagem carregada com sucesso!', type: 'success' });
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatus({ 
        msg: 'Erro no upload: Certifica-te que o bucket "avatars" existe e é público.', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        username: username,
        avatar_url: avatarUrl,
        settings: settings
      });
      setStatus({ msg: 'Perfil atualizado com sucesso!', type: 'success' });
    } catch (err: any) {
      setStatus({ msg: 'Erro ao guardar as alterações: ' + err.message, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayedAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName || user?.email || 'User')}&background=F59652&color=fff&size=128`;

  return (
    <div className="flex flex-col min-h-full max-w-4xl mx-auto p-6 md:p-10 animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/')}
            className="w-11 h-11 flex items-center justify-center bg-white border border-gray-100 text-gray-500 rounded-full hover:bg-gray-50 hover:text-brand-orange transition-all shadow-sm shrink-0"
            title="Voltar ao Dashboard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">O meu Perfil</h1>
            <p className="text-gray-500 mt-1">Gira as tuas informações e preferências do dashboard.</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="px-5 py-2.5 bg-white border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar - Avatar and quick info */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card flex flex-col items-center h-fit">
          <div 
            className="relative group mb-6 cursor-pointer"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md transition-all ${uploading ? 'opacity-50' : 'group-hover:scale-105 group-hover:border-brand-orange/30'}`}>
              <img 
                src={displayedAvatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
              <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Alterar</span>
            </div>

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 text-center">{firstName || 'Utilizador'} {lastName}</h3>
          <p className="text-sm text-gray-500 mb-6 italic">@{username || 'antigravity_user'}</p>
          
          <div className="w-full pt-6 border-t border-gray-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Email</span>
                <span className="text-gray-700 font-medium truncate max-w-[120px]">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Conta</span>
                <span className="text-brand-orange font-bold px-2 py-0.5 bg-brand-orange/5 rounded-md text-[10px] uppercase">Pro Partner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Informações Pessoais</h2>
                {status && status.type === 'info' && (
                   <span className="text-xs font-bold text-brand-orange animate-pulse">{status.msg}</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Primeiro Nome</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="João" 
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Apelido</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Silva" 
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Username</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="joaosilva" 
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Definições do Dashboard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-700">Mostrar Decimais</p>
                      <p className="text-xs text-gray-400">Exibir valores como "12.5%" em vez de "13%"</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.showDecimals} 
                        onChange={(e) => setSettings({...settings, showDecimals: e.target.checked})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-700">Modo Compacto</p>
                      <p className="text-xs text-gray-400">Reduzir o espaçamento entre elementos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.compactMode} 
                        onChange={(e) => setSettings({...settings, compactMode: e.target.checked})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Moeda Principal</label>
                    <select 
                      value={settings.currency} 
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar ($)</option>
                      <option value="GBP">Pound (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                {status && status.type !== 'info' && (
                  <p className={`text-sm font-bold ${status.type === 'success' ? 'text-brand-orangedark' : 'text-brand-red'}`}>
                    {status.msg}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 sm:flex-none px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all border-none"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 sm:flex-none px-8 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg shadow-brand-orange/20 hover:bg-brand-orange/90 transition-all disabled:opacity-50"
                >
                  {saving ? 'A guardar...' : 'Guardar Alterações'}
                </button>
              </div>
            </div>
          </form>

          <div className="bg-orange-50/50 rounded-3xl p-6 border border-orange-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-orange-800 font-bold">Configuração Adicional</h4>
              <p className="text-orange-700/70 text-sm mt-1">
                Lembre-se de criar o bucket <code className="bg-orange-100 px-1 rounded text-orange-900">avatars</code> no painel Supabase e defini-lo como <strong>público</strong> para os uploads funcionarem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
