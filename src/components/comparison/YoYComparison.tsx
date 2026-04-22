import { useState, useMemo } from 'react';
import type { KpiRecord, NetworkFilter } from '../../types/kpi';

export function YoYComparison({ data }: { data: KpiRecord[] }) {
  const [m1, setM1] = useState<string>('');
  const [m2, setM2] = useState<string>('');
  const [network, setNetwork] = useState<NetworkFilter>('all');

  const months = useMemo(() => Array.from(new Set(data.map((d) => d['Mês/Ano']))).sort().reverse(), [data]);

  const formatMonth = (monthStr: string) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const currentData = useMemo(() => {
    if (!m1 || !m2) return null;
    let d1 = data.filter((d) => d['Mês/Ano'] === m1);
    let d2 = data.filter((d) => d['Mês/Ano'] === m2);
    if (network !== 'all') { d1 = d1.filter((d) => d['Rede Social'] === network); d2 = d2.filter((d) => d['Rede Social'] === network); }
    if (d1.length === 0 && d2.length === 0) return { networks: [] };
    const networksToCompare = Array.from(new Set([...d1, ...d2].map((d) => d['Rede Social'])));
    return {
      networks: networksToCompare.map((n) => ({
        name: n, c1: d1.find((x) => x['Rede Social'] === n) || ({} as Partial<KpiRecord>), c2: d2.find((x) => x['Rede Social'] === n) || ({} as Partial<KpiRecord>),
      })),
    };
  }, [data, m1, m2, network]);

  const kpis: { label: string; key: keyof KpiRecord }[] = [
    { label: 'Total Posts', key: 'Nº Posts' }, { label: 'Seguidores', key: 'Novos Seguidores' },
    { label: 'Reach', key: 'Account Reached' }, { label: 'Engagement', key: 'Engagement %' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card w-full">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <select value={m1} onChange={(e) => setM1(e.target.value)} className="glass-input px-4 py-2 rounded-xl text-sm font-medium">
          <option value="">Período Base...</option>{months.map((m) => (<option key={m} value={m}>{formatMonth(m)}</option>))}
        </select>
        <select value={m2} onChange={(e) => setM2(e.target.value)} className="glass-input px-4 py-2 rounded-xl text-sm font-medium">
          <option value="">Período de Comparação...</option>{months.map((m) => (<option key={m} value={m}>{formatMonth(m)}</option>))}
        </select>
        <select value={network} onChange={(e) => setNetwork(e.target.value as NetworkFilter)} className="glass-input px-4 py-2 rounded-xl text-sm font-medium">
          <option value="all">Todas as redes</option><option value="Facebook">Facebook</option><option value="LinkedIn">LinkedIn</option><option value="Instagram">Instagram</option>
        </select>
      </div>
      <div className="w-full">
        {!currentData ? ( <div className="text-center py-20 text-gray-400">Selecione dois meses para gerar a comparação YoY.</div> ) 
        : currentData.networks.length === 0 ? ( <div className="text-center py-20 text-gray-400">Sem dados encontrados nestes períodos.</div>) 
        : (
          <>
            <div className="mb-6 flex gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold">Comparando</span>
              <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-lg text-sm font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                {formatMonth(m1)} <span className="text-gray-400 font-normal">vs</span> {formatMonth(m2)}
              </span>
            </div>
            <div className="space-y-6">
              {currentData.networks.map((n) => (
                <div key={n.name} className="bg-white border text-gray-800 border-gray-100 p-6 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${n.name === 'Facebook' ? 'bg-blue-600' : n.name === 'Instagram' ? 'bg-pink-500' : 'bg-blue-800'}`}></div>{n.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {kpis.map((metric) => {
                      const v1 = parseFloat(String(n.c1[metric.key] || 0));
                      const v2 = parseFloat(String(n.c2[metric.key] || 0));
                      const diff = v1 - v2; const pct = v2 !== 0 ? (diff / v2) * 100 : 0; const isPos = diff >= 0;
                      const cColor = isPos ? 'text-brand-orangedark' : 'text-brand-red'; const cBg = isPos ? 'bg-brand-orangedark/10' : 'bg-brand-red/10';
                      const isPctKey = metric.key.includes('%');
                      return (
                        <div key={metric.key} className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between">
                          <span className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{metric.label}</span>
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-2xl font-extrabold text-gray-900">{isPctKey ? v1.toFixed(1) + '%' : v1.toLocaleString()}</div>
                              <div className="text-xs text-gray-400 mt-1">vs {isPctKey ? v2.toFixed(1) + '%' : v2.toLocaleString()}</div>
                            </div>
                            <div className={`flex items-center gap-1 ${cBg} ${cColor} px-2 py-1 rounded-lg text-xs font-bold`}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isPos ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />)}
                              </svg>
                              {diff > 0 ? '+' : ''}{isPctKey ? diff.toFixed(1) : diff} {!isPctKey && `(${Math.abs(pct).toFixed(0)}%)`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
