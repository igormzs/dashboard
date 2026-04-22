export function EmptyState({ onAction }: { onAction: () => void }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-100 shadow-card">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Sem Dados Disponíveis</h3>
      <p className="text-gray-500 mb-6 text-center max-w-sm">Não existem registos de performance social para apresentar neste momento.</p>
      <button onClick={onAction} className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl font-semibold shadow-sm transition-colors">
        Inserir o Primeiro Registo
      </button>
    </div>
  );
}
