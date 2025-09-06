import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrawStore } from '../../store/useDrawStore';
import { NumberBadge } from '../ui/NumberBadge';
import { ExportButton } from './ExportButton';

export const HistoryList: React.FC = () => {
  const { drawn, removeFromPool, isSpinning } = useDrawStore();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
  };

  // Agrupar por data
  const groupedByDate = drawn.reduce((groups, item) => {
    const date = formatDate(item.at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, typeof drawn>);

  const handleRemoveFromPool = (number: number) => {
    if (confirm(`Remover o número ${number} da roleta permanentemente?`)) {
      removeFromPool(number);
    }
  };

  if (drawn.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-secondary-800">Histórico</h2>
          <ExportButton drawn={drawn} disabled />
        </div>
        
        <div className="text-center py-8">
          <svg 
            className="w-16 h-16 mx-auto text-secondary-300 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
          <p className="text-secondary-500">Nenhum número sorteado ainda</p>
          <p className="text-sm text-secondary-400 mt-1">
            Gire a roleta para começar o histórico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-secondary-800">
          Histórico ({drawn.length})
        </h2>
        <ExportButton drawn={drawn} disabled={isSpinning} />
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {Object.entries(groupedByDate).map(([date, items]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              {/* Cabeçalho da data */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-secondary-200"></div>
                <span className="px-3 text-sm font-medium text-secondary-500 bg-white">
                  {date}
                </span>
                <div className="flex-1 border-t border-secondary-200"></div>
              </div>

              {/* Números da data */}
              <div className="space-y-2">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.at}-${item.value}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <NumberBadge
                        number={item.value}
                        variant={index === 0 && date === formatDate(drawn[0].at) ? 'highlighted' : 'default'}
                        size="lg"
                      />
                      <div className="text-sm text-secondary-600">
                        <div className="font-medium">#{drawn.length - drawn.indexOf(item)}</div>
                        <div>{formatTime(item.at)}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFromPool(item.value)}
                      disabled={isSpinning}
                      className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={`Remover número ${item.value} da roleta`}
                      title="Remover da roleta"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Estatísticas rápidas */}
      {drawn.length > 0 && (
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-secondary-800">Último sorteado</div>
              <div className="text-primary-600 font-bold text-lg">
                {drawn[0].value}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium text-secondary-800">Total de sorteios</div>
              <div className="text-primary-600 font-bold text-lg">
                {drawn.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
