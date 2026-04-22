import type { KpiRecord } from '../../types/kpi';

export function DataTable({ data, onDelete, onDownload }: { data: KpiRecord[]; onDelete: (id: string | number) => Promise<void>; onDownload: () => void; }) {
  const formatMonth = (monthStr: string) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const getNetworkColor = (network: string) => {
    if (network === 'Facebook') return 'bg-blue-600';
    if (network === 'Instagram') return 'bg-pink-500';
    return 'bg-blue-800';
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card overflow-hidden w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Base de Dados</h2>
        <button onClick={onDownload} className="flex items-center gap-2 bg-brand-orangedark/10 text-brand-orangedark px-4 py-2 rounded-xl font-bold hover:bg-brand-orangedark/20 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="py-4 px-4 font-semibold">Rede Social</th><th className="py-4 px-4 font-semibold">Mês/Ano</th><th className="py-4 px-4 font-semibold">Nº Posts</th><th className="py-4 px-4 font-semibold">Novos Seg.</th><th className="py-4 px-4 font-semibold">Reach</th><th className="py-4 px-4 font-semibold">Engagement</th><th className="py-4 px-4 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((record) => (
              <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${getNetworkColor(record['Rede Social'])}`}></div><span className="font-medium text-gray-800">{record['Rede Social']}</span></td>
                <td className="py-3 px-4 text-gray-600">{formatMonth(record['Mês/Ano'])}</td>
                <td className="py-3 px-4 font-semibold">{record['Nº Posts']}</td>
                <td className="py-3 px-4 font-semibold">{Number(record['Novos Seguidores']).toLocaleString()}</td>
                <td className="py-3 px-4 font-semibold">{Number(record['Account Reached']).toLocaleString()}</td>
                <td className="py-3 px-4 font-semibold">{record['Engagement %']}%</td>
                <td className="py-3 px-4 text-right"><button onClick={() => { if (window.confirm('Apagar registo de forma permanente?')) { onDelete(record.id); } }} className="text-gray-400 hover:text-brand-red transition-colors"><svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
