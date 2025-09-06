import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrawStore, useAvailableNumbers } from '../store/useDrawStore';
import { Wheel } from '../components/wheel/Wheel';
import type { WheelRef } from '../components/wheel/Wheel';
import { Controls } from '../components/controls/Controls';
import { HistoryList } from '../components/history/HistoryList';
import { Button } from '../components/ui/Button';
import { NumberBadge } from '../components/ui/NumberBadge';

export const App: React.FC = () => {
  const {
    lastDrawn,
    isSpinning,
    options,
    hydrate,
  } = useDrawStore();

  const availableNumbers = useAvailableNumbers();
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef<WheelRef>(null);

  // Hidratar estado do localStorage na inicialização
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Mostrar resultado quando um número é sorteado
  useEffect(() => {
    if (lastDrawn && !isSpinning) {
      setShowResult(true);
      const timer = setTimeout(() => setShowResult(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastDrawn, isSpinning]);

  const handleSpin = () => {
    if (availableNumbers.length === 0) {
      alert('Não há números disponíveis para sortear!');
      return;
    }
    
    if (!options.allowRepeats && availableNumbers.length === 0) {
      alert('Todos os números já foram sorteados! Ative "Permitir repetidos" ou reset a roleta.');
      return;
    }

    // Chamar a função spin do componente Wheel
    wheelRef.current?.spin();
  };

  const handleSpinComplete = (number: number) => {
    // Callback quando a animação da roleta termina
    console.log(`Número sorteado: ${number}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 2 L12 12 L18 6 Z" fill="currentColor"/>
                  <path d="M12 12 L12 2 L6 6 Z" fill="rgba(255,255,255,0.3)"/>
                  <path d="M12 12 L6 18 L12 22 Z" fill="currentColor"/>
                  <path d="M12 12 L12 22 L18 18 Z" fill="rgba(255,255,255,0.3)"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-secondary-800">
                  Roleta Numérica
                </h1>
                <p className="text-sm text-secondary-600 mt-1">
                  Sorteios justos e transparentes
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!options.allowRepeats && (
                <div className="text-sm text-secondary-600">
                  <span className="font-medium">Restantes:</span>{' '}
                  <span className="text-primary-600 font-bold">
                    {availableNumbers.length}
                  </span>
                </div>
              )}
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleSpin}
                disabled={isSpinning || availableNumbers.length === 0}
                isLoading={isSpinning}
              >
                {isSpinning ? 'Girando...' : '🎲 Girar Roleta'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Resultado em destaque */}
      <AnimatePresence>
        {showResult && lastDrawn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-primary-500">
              <div className="text-center">
                <div className="text-sm font-medium text-secondary-600 mb-2">
                  NÚMERO SORTEADO
                </div>
                <NumberBadge
                  number={lastDrawn}
                  variant="highlighted"
                  size="lg"
                  className="text-4xl px-8 py-4"
                />
                <div className="mt-4">
                  <div className="flex justify-center">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="w-2 h-2 bg-primary-500 rounded-full mx-1"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles e Histórico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Controles */}
          <div>
            <Controls />
          </div>

          {/* Histórico */}
          <div>
            <HistoryList />
          </div>
        </div>

        {/* Roleta - Seção isolada */}
        <div className="flex flex-col items-center space-y-8">
          <Wheel
            ref={wheelRef}
            size={500}
            onSpinComplete={handleSpinComplete}
          />
          
          {/* Status da roleta */}
          <div className="text-center">
            {availableNumbers.length === 0 ? (
              <div className="text-red-600">
                <div className="font-medium text-lg">⚠️ Nenhum número disponível</div>
                <div className="text-sm">Configure os números para começar</div>
              </div>
            ) : !options.allowRepeats && availableNumbers.length === 0 ? (
              <div className="text-yellow-600">
                <div className="font-medium text-lg">⚠️ Todos os números foram sorteados</div>
                <div className="text-sm">Ative "Permitir repetidos" ou reset a roleta</div>
              </div>
            ) : (
              <div className="text-green-600">
                <div className="font-medium text-lg">✅ Pronto para sortear</div>
                <div className="text-sm">
                  {availableNumbers.length} número{availableNumbers.length !== 1 ? 's' : ''} disponível{availableNumbers.length !== 1 ? 'eis' : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
};
