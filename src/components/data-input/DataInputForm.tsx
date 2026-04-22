import { useState } from 'react';
import type { KpiRecord, NetworkName } from '../../types/kpi';

export function DataInputForm({ onSave }: { onSave: (record: KpiRecord) => Promise<void> }) {
  const [status, setStatus] = useState<{ msg: string; isError: boolean } | null>(null);
  const [network, setNetwork] = useState<NetworkName>('Facebook');
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [posts, setPosts] = useState<string>('');
  const [followers, setFollowers] = useState<string>('');
  const [reach, setReach] = useState<string>('');
  const [engagement, setEngagement] = useState<string>('');

  const showStatus = (msg: string, isError: boolean) => { setStatus({ msg, isError }); setTimeout(() => setStatus(null), 3500); };
  const handleSave = async () => {
    if (!month) { showStatus('Por favor, defina um Mês/Ano!', true); return; }
    const record: KpiRecord = {
      id: Date.now(), 'Rede Social': network, 'Mês/Ano': month,
      'Nº Posts': parseInt(posts, 10) || 0, 'Novos Seguidores': parseInt(followers, 10) || 0,
      'Account Reached': parseInt(reach, 10) || 0, 'Engagement %': parseFloat(engagement) || 0.0,
    };
    try { await onSave(record); showStatus(`✓ Registo de ${network} (${month}) guardado com sucesso!`, false); handleClear(); }
    catch (err) { showStatus('Erro ao guardar o registo.', true); }
  };
  const handleClear = () => { setNetwork('Facebook'); setPosts(''); setFollowers(''); setReach(''); setEngagement(''); };

  return (
    <div className="bg-white rounded-3xl p-8 max-w-3xl mx-auto border border-gray-100 shadow-card w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Inserção de Dados de Performance</h2>
      {status && (<div className={`mb-6 p-4 rounded-xl text-sm font-semibold block ${status.isError ? 'bg-brand-red/20 text-red-700' : 'bg-brand-orangedark/10 text-brand-orangedark'}`}>{status.msg}</div>)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-gray-600">Rede Social</label><select value={network} onChange={(e) => setNetwork(e.target.value as NetworkName)} className="glass-input px-4 py-3 rounded-xl transition-all"><option value="Facebook">Facebook</option><option value="LinkedIn">LinkedIn</option><option value="Instagram">Instagram</option></select></div>
        <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-gray-600">Mês/Ano</label><input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="glass-input px-4 py-3 rounded-xl transition-all" /></div>
        <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-gray-600">Nº Posts</label><input type="number" value={posts} onChange={(e) => setPosts(e.target.value)} placeholder="0" min="0" className="glass-input px-4 py-3 rounded-xl transition-all" /></div>
        <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-gray-600">Novos Seguidores</label><input type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} placeholder="0" min="0" className="glass-input px-4 py-3 rounded-xl transition-all" /></div>
        <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-gray-600">Account Reached</label><input type="number" value={reach} onChange={(e) => setReach(e.target.value)} placeholder="0" min="0" className="glass-input px-4 py-3 rounded-xl transition-all" /></div>
        <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-gray-600">Engagement %</label><input type="number" value={engagement} onChange={(e) => setEngagement(e.target.value)} placeholder="0.0" min="0" step="0.1" className="glass-input px-4 py-3 rounded-xl transition-all" /></div>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button onClick={handleSave} className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-brand-orange/20 transition-all">Guardar Registo</button>
        <button onClick={handleClear} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all">Limpar</button>
      </div>
    </div>
  );
}
