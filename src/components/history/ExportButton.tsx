import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { downloadHistoryCSV } from '../../lib/csv';
import type { DrawnNumber } from '../../lib/types';

interface ExportButtonProps {
  drawn: DrawnNumber[];
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  drawn,
  disabled = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (drawn.length === 0) return;

    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `historico-roleta-${timestamp}.csv`;
      
      downloadHistoryCSV(drawn, filename);
      
      // Pequeno delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Erro ao exportar histórico:', error);
      alert('Erro ao exportar histórico. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleExport}
      disabled={disabled || drawn.length === 0 || isExporting}
      isLoading={isExporting}
      aria-label="Exportar histórico como CSV"
    >
      <svg 
        className="w-4 h-4 mr-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      {isExporting ? 'Exportando...' : 'Exportar CSV'}
    </Button>
  );
};
