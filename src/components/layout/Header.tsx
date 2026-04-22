import { SyncStatus } from '../../types/kpi';

interface HeaderProps {
  title: string;
  subtitle: string;
  syncStatus: SyncStatus;
}

export function Header({ title, subtitle, syncStatus }: HeaderProps) {
  let badgeClasses = 'bg-blue-50 text-blue-600';
  let dotClasses = 'bg-blue-500 animate-pulse';

  if (syncStatus.type === 'success') {
    badgeClasses = 'bg-brand-orangelight/50 text-brand-orangedark';
    dotClasses = 'bg-brand-orangedark animate-pulse';
  } else if (syncStatus.type === 'warning') {
    badgeClasses = 'bg-amber-50 text-amber-600';
    dotClasses = 'bg-amber-500';
  } else if (syncStatus.type === 'error') {
    badgeClasses = 'bg-red-50 text-red-600';
    dotClasses = 'bg-red-500';
  }

  return (
    <header className="h-20 px-10 flex items-center justify-between border-b border-gray-200/50 bg-white/50 backdrop-blur-md sticky top-0 z-10 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-2 transition-all duration-300 ${badgeClasses}`}>
          <span className={`w-2 h-2 rounded-full ${dotClasses}`}></span>
          {syncStatus.message}
        </span>
      </div>
    </header>
  );
}
