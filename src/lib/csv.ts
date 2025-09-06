import type { DrawnNumber } from './types';

/**
 * Converte o histórico de números sorteados para formato CSV
 */
export function exportHistoryToCSV(drawn: DrawnNumber[]): string {
  const headers = ['order', 'value', 'timestamp'];
  
  // Ordenar por ordem decrescente de tempo (mais recente primeiro)
  const sortedDrawn = [...drawn].sort((a, b) => 
    new Date(b.at).getTime() - new Date(a.at).getTime()
  );
  
  const rows = sortedDrawn.map((item, index) => [
    (index + 1).toString(),
    item.value.toString(),
    item.at
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Faz download do CSV do histórico
 */
export function downloadHistoryCSV(drawn: DrawnNumber[], filename: string = 'historico-roleta.csv'): void {
  const csvContent = exportHistoryToCSV(drawn);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Valida se uma string é um CSV válido do histórico
 */
export function validateHistoryCSV(csvContent: string): boolean {
  try {
    const lines = csvContent.trim().split('\n');
    
    if (lines.length < 2) return false; // Pelo menos header + 1 linha
    
    const headers = lines[0].split(',');
    if (headers.length !== 3 || 
        headers[0] !== 'order' || 
        headers[1] !== 'value' || 
        headers[2] !== 'timestamp') {
      return false;
    }
    
    // Validar algumas linhas de dados
    for (let i = 1; i < Math.min(lines.length, 10); i++) {
      const row = lines[i].split(',');
      if (row.length !== 3) return false;
      
      const order = parseInt(row[0]);
      const value = parseInt(row[1]);
      const timestamp = row[2];
      
      if (isNaN(order) || isNaN(value) || !isValidISODate(timestamp)) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Importa histórico de um CSV
 */
export function importHistoryFromCSV(csvContent: string): DrawnNumber[] {
  if (!validateHistoryCSV(csvContent)) {
    throw new Error('Formato de CSV inválido');
  }
  
  const lines = csvContent.trim().split('\n');
  const dataLines = lines.slice(1); // Pular header
  
  return dataLines.map(line => {
    const [, value, timestamp] = line.split(',');
    return {
      value: parseInt(value),
      at: timestamp
    };
  });
}

/**
 * Valida se uma string é uma data ISO válida
 */
function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && date.toISOString() === dateString;
}
