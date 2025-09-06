import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Range } from '../../lib/types';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';

interface RangeEditorProps {
  ranges: Range[];
  onChange: (ranges: Range[]) => void;
  onApply: () => void;
}

export const RangeEditor: React.FC<RangeEditorProps> = ({
  ranges,
  onChange,
  onApply,
}) => {
  const [newRange, setNewRange] = useState<Range>({ start: 1, end: 100 });
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  const validateRange = (range: Range): string | null => {
    if (range.start < 1 || range.end < 1) {
      return 'Números devem ser positivos';
    }
    if (range.start > range.end) {
      return 'Início deve ser menor ou igual ao fim';
    }
    if (range.start > 10000 || range.end > 10000) {
      return 'Números não podem exceder 10.000';
    }
    return null;
  };

  const addRange = () => {
    const error = validateRange(newRange);
    if (error) {
      setErrors({ ...errors, [-1]: error });
      return;
    }

    const updatedRanges = [...ranges, newRange];
    onChange(updatedRanges);
    setNewRange({ start: 1, end: 100 });
    setErrors({});
  };

  const removeRange = (index: number) => {
    const updatedRanges = ranges.filter((_, i) => i !== index);
    onChange(updatedRanges);
    
    // Limpar erro deste índice
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const updateRange = (index: number, field: 'start' | 'end', value: string) => {
    const numValue = parseInt(value) || 0;
    const updatedRanges = ranges.map((range, i) => 
      i === index ? { ...range, [field]: numValue } : range
    );
    onChange(updatedRanges);

    // Validar range atualizado
    const error = validateRange(updatedRanges[index]);
    setErrors({
      ...errors,
      [index]: error || '',
    });
  };

  const mergeOverlappingRanges = () => {
    if (ranges.length === 0) return;

    // Ordenar ranges por início
    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    const merged: Range[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      // Se há sobreposição ou adjacência, mesclar
      if (current.start <= last.end + 1) {
        last.end = Math.max(last.end, current.end);
      } else {
        merged.push(current);
      }
    }

    onChange(merged);
    setErrors({});
  };

  const getTotalNumbers = () => {
    const numbersSet = new Set<number>();
    ranges.forEach(range => {
      for (let i = range.start; i <= range.end; i++) {
        numbersSet.add(i);
      }
    });
    return numbersSet.size;
  };

  const hasErrors = Object.values(errors).some(error => error);

  return (
    <div className="space-y-4">
      {/* Ranges existentes */}
      <AnimatePresence>
        {ranges.map((range, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center space-x-2 p-3 bg-secondary-50 rounded-lg"
          >
            <Field
              type="number"
              value={range.start}
              onChange={(e) => updateRange(index, 'start', e.target.value)}
              placeholder="Início"
              min="1"
              max="10000"
              className="w-20"
            />
            <span className="text-secondary-500">até</span>
            <Field
              type="number"
              value={range.end}
              onChange={(e) => updateRange(index, 'end', e.target.value)}
              placeholder="Fim"
              min="1"
              max="10000"
              className="w-20"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeRange(index)}
              aria-label={`Remover range ${range.start}-${range.end}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
            {errors[index] && (
              <span className="text-red-500 text-sm">{errors[index]}</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Adicionar novo range */}
      <div className="flex items-center space-x-2 p-3 border-2 border-dashed border-secondary-300 rounded-lg">
        <Field
          type="number"
          value={newRange.start}
          onChange={(e) => setNewRange({ ...newRange, start: parseInt(e.target.value) || 1 })}
          placeholder="Início"
          min="1"
          max="10000"
          className="w-20"
        />
        <span className="text-secondary-500">até</span>
        <Field
          type="number"
          value={newRange.end}
          onChange={(e) => setNewRange({ ...newRange, end: parseInt(e.target.value) || 100 })}
          placeholder="Fim"
          min="1"
          max="10000"
          className="w-20"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={addRange}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar
        </Button>
        {errors[-1] && (
          <span className="text-red-500 text-sm">{errors[-1]}</span>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={mergeOverlappingRanges}
            disabled={ranges.length === 0}
          >
            Mesclar Sobrepostos
          </Button>
        </div>
        
        <div className="text-sm text-secondary-600">
          Total: {getTotalNumbers()} números
        </div>
      </div>

      {/* Aplicar */}
      <Button
        variant="primary"
        onClick={onApply}
        disabled={ranges.length === 0 || hasErrors}
        className="w-full"
      >
        Aplicar Ranges
      </Button>
    </div>
  );
};
