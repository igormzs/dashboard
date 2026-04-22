import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
}

export function Sidebar({ activeTab, onTabChange, user, onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const meta = user?.user_metadata || {};
  const displayName = meta.first_name ? `${meta.first_name} ${meta.last_name || ''}` : user?.email || 'Utilizador';
  const displayUsername = meta.username ? `@${meta.username}` : 'Pro Plan';
  
  const firstName = meta.first_name;
  const avatarUrl = meta.avatar_url;
  const displayedAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName || user?.email || 'User')}&background=F59652&color=fff&size=128`;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: 'comparison', label: 'Comparações YoY', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /> },
    { id: 'input', label: 'Inserir Dados', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> },
    { id: 'data', label: 'Ver Dados', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /> },
  ];

  const handleTabClick = (id: string) => {
    onTabChange(id);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <aside className="w-64 bg-white shadow-sidebar h-full flex flex-col z-20 relative overflow-hidden">
      <div className="logo-pattern absolute inset-0 z-0 opacity-[0.02]"></div>
      <div className="px-8 py-8 flex flex-col gap-1 cursor-pointer relative z-10" onClick={() => navigate('/')}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Stat-o Logo" className="w-8 h-8 drop-shadow-sm" />
          <h2 className="text-xl font-bold tracking-tight text-brand-dark">Stat-o</h2>
        </div>
      </div>
      <nav className="flex-1 px-4 flex flex-col gap-2 relative z-10">
        {navItems.map((item) => (
          <div key={item.id} className={`nav-item px-4 py-3 rounded-xl flex items-center gap-3 ${activeTab === item.id ? 'active bg-brand-orange/10 text-brand-orange font-semibold' : ''}`} onClick={() => handleTabClick(item.id)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
            {item.label}
          </div>
        ))}
      </nav>
      <div className="p-6 mt-auto flex flex-col gap-3 relative z-10">
        <div 
          onClick={() => navigate('/profile')}
          className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3 overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <img src={displayedAvatar} alt="Profile" className="w-10 h-10 rounded-full shadow-sm shrink-0" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate" title={displayName}>{displayName}</p>
            <p className="text-xs text-gray-500">{displayUsername}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full text-center text-sm font-bold text-gray-500 hover:text-brand-orange transition-all py-2 rounded-xl border border-transparent hover:border-brand-orange/20 hover:bg-brand-orange/5">
          Sair
        </button>
      </div>
    </aside>
  );
}
