import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDrawStore, useCanDraw } from '../../store/useDrawStore';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { Toggle } from '../ui/Toggle';
import { RangeEditor } from './RangeEditor';

export const Controls: React.FC = () => {
  const {
    inputMode,
    quantity,
    ranges,
    options,
    isSpinning,
    setInputMode,
    setQuantity,
    setRanges,
    toggleAllowRepeats,
    resetAll,
    clearHistoryOnly,
  } = useDrawStore();

  const canDraw = useCanDraw();
  const [localQuantity, setLocalQuantity] = useState(quantity.toString());
  const [localRanges, setLocalRanges] = useState(ranges);
  const [quantityError, setQuantityError] = useState('');

  const handleQuantityChange = (value: string) => {
    setLocalQuantity(value);
    
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      setQuantityError('Deve ser um número maior que 0');
    } else if (num > 10000) {
      setQuantityError('Máximo 10.000 números');
    } else {
      setQuantityError('');
    }
  };

  const applyQuantity = () => {
    const num = parseInt(localQuantity);
    if (!quantityError && num >= 1 && num <= 10000) {
      setQuantity(num);
    }
  };

  const applyRanges = () => {
    setRanges(localRanges);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar tudo? Isso limpará os números e o histórico.')) {
      resetAll();
      setLocalQuantity('100');
      setLocalRanges([{ start: 1, end: 100 }]);
      setQuantityError('');
    }
  };

  const handleClearHistory = () => {
    if (confirm('Tem certeza que deseja limpar apenas o histórico?')) {
      clearHistoryOnly();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-secondary-800">Configurações</h2>
        <Toggle
          checked={options.allowRepeats}
          onChange={toggleAllowRepeats}
          label="Permitir repetidos"
          disabled={isSpinning}
          tooltip={options.allowRepeats 
            ? "Números já sorteados podem ser sorteados novamente" 
            : "Números já sorteados não podem ser sorteados novamente até resetar"
          }
        />
      </div>

      {/* Modo de entrada */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Modo de entrada
        </label>
        <div className="flex bg-secondary-100 rounded-lg p-1">
          <button
            onClick={() => setInputMode('quantity')}
            className={`
              flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${inputMode === 'quantity'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-800'
              }
            `}
            disabled={isSpinning}
          >
            Quantidade
          </button>
          <button
            onClick={() => setInputMode('ranges')}
            className={`
              flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${inputMode === 'ranges'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-800'
              }
            `}
            disabled={isSpinning}
          >
            Ranges
          </button>
        </div>
      </div>

      {/* Configuração por quantidade */}
      {inputMode === 'quantity' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex space-x-2">
            <Field
              type="number"
              label="Quantidade de números (1 até N)"
              value={localQuantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="Ex: 500"
              min="1"
              max="10000"
              error={quantityError}
              disabled={isSpinning}
              className="flex-1"
            />
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={applyQuantity}
                disabled={!!quantityError || isSpinning}
              >
                Aplicar
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-secondary-600">
            Gerará números de 1 até {localQuantity || '0'}
          </p>
        </motion.div>
      )}

      {/* Configuração por ranges */}
      {inputMode === 'ranges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Intervalos de números
          </label>
          <RangeEditor
            ranges={localRanges}
            onChange={setLocalRanges}
            onApply={applyRanges}
          />
        </motion.div>
      )}

      {/* Status */}
      <div className="bg-secondary-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">Status:</span>
          <span className={`font-medium ${canDraw ? 'text-green-600' : 'text-red-600'}`}>
            {canDraw ? 'Pronto para sortear' : 'Não é possível sortear'}
          </span>
        </div>
        
        {!options.allowRepeats && (
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-secondary-600">Números restantes:</span>
            <span className="font-medium text-primary-600">
              {/* Será calculado no componente pai */}
            </span>
          </div>
        )}
      </div>

      {/* Ações globais */}
      <div className="flex space-x-2">
        <Button
          variant="danger"
          size="sm"
          onClick={handleReset}
          disabled={isSpinning}
          className="flex-1"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Geral
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleClearHistory}
          disabled={isSpinning}
          className="flex-1"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpar Histórico
        </Button>
      </div>
    </div>
  );
};
