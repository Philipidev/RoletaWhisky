import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrawStore, useAvailableNumbers } from '../store/useDrawStore';
import { Wheel } from '../components/wheel/Wheel';
import type { WheelRef } from '../components/wheel/Wheel';
import { Controls } from '../components/controls/Controls';
import { HistoryList } from '../components/history/HistoryList';
import WhiskyLoganSemBg from '../assets/WhiskyLoganSemBg.png';
import WhyskySorteioNumeroTemplate from '../assets/WhyskySorteioNumeroTemplate.png';

export const App: React.FC = () => {
  const {
    lastDrawn,
    isSpinning,
    options,
    hydrate,
  } = useDrawStore();

  const availableNumbers = useAvailableNumbers();
  const [showResult, setShowResult] = useState(false);
  const [wheelSize, setWheelSize] = useState(() => {
    const saved = localStorage.getItem('wheelSize');
    return saved ? Number(saved) : 500;
  });
  const [showNumbers, setShowNumbers] = useState(() => {
    const saved = localStorage.getItem('showNumbers');
    return saved ? JSON.parse(saved) : true;
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? Number(saved) : 16;
  });
  const [showControls, setShowControls] = useState(() => {
    const saved = localStorage.getItem('showControls');
    return saved ? JSON.parse(saved) : true;
  });
  const wheelRef = useRef<WheelRef>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null);

  // Hidratar estado do localStorage na inicialização
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Mostrar resultado quando um número é sorteado
  useEffect(() => {
    if (lastDrawn && !isSpinning) {
      setShowResult(true);
    }
  }, [lastDrawn, isSpinning]);

  // Esconder resultado imediatamente quando a roleta começar a girar
  useEffect(() => {
    if (isSpinning) {
      setShowResult(false);
    }
  }, [isSpinning]);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('wheelSize', wheelSize.toString());
  }, [wheelSize]);

  useEffect(() => {
    localStorage.setItem('showNumbers', JSON.stringify(showNumbers));
  }, [showNumbers]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('showControls', JSON.stringify(showControls));
  }, [showControls]);

  const handleSpinComplete = (number: number) => {
    // Callback quando a animação da roleta termina
    console.log(`Número sorteado: ${number}`);
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2">
                <img
                  src={WhiskyLoganSemBg}
                  alt="Whisky Logan"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-secondary-800">
                  Operação Lua de Mel
                </h1>
                <p className="text-sm text-secondary-600 mt-1">
                  Casamento Italo & Raíssa - Sorteio Especial
                </p>
                <p className="text-xs text-secondary-500 mt-1">
                  Sorteando os participantes do evento do whisky
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>


      {/* Conteúdo principal */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${showControls ? 'py-8' : 'py-4'} ${!showControls ? 'min-h-screen flex flex-col justify-center' : ''}`}>
        {/* Controles e Histórico */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
            >
              {/* Controles */}
              <div>
                <Controls />
              </div>

              {/* Histórico */}
              <div>
                <HistoryList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roleta - Seção isolada */}
        <div className="flex flex-col items-center space-y-8">
          {/* Botão para mostrar/ocultar controles */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowControls(!showControls)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-md"
            >
              {showControls ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                  <span>Ocultar Controles</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Mostrar Controles</span>
                </>
              )}
            </button>
          </div>

          {/* Configurações da Roleta */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-secondary-200 w-full max-w-4xl"
              >
                <div className="flex flex-col space-y-6">
                  <h3 className="text-lg font-semibold text-secondary-800 text-center">
                    Configurações da Roleta
                  </h3>

                  {/* Tamanho da Roleta */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-secondary-700 text-center block">
                      Tamanho da Roleta
                    </label>

                    {/* Slider e valor atual */}
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-secondary-500 min-w-[40px]">300px</span>
                      <input
                        type="range"
                        min="300"
                        max="1000"
                        step="10"
                        value={wheelSize}
                        onChange={(e) => setWheelSize(Number(e.target.value))}
                        className="flex-1 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="text-xs text-secondary-500 min-w-[40px]">1000px</span>
                    </div>

                    {/* Valor atual destacado */}
                    <div className="text-center">
                      <span className="inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-lg font-medium">
                        {wheelSize}px
                      </span>
                    </div>

                    {/* Botões de tamanhos predefinidos */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {[300, 400, 500, 600, 700, 800, 900, 1000].map((size) => (
                        <button
                          key={size}
                          onClick={() => setWheelSize(size)}
                          className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${wheelSize === size
                              ? 'bg-primary-500 text-white shadow-md scale-105'
                              : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 hover:scale-105'
                            }`}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divisor */}
                  <div className="border-t border-secondary-200"></div>

                  {/* Configurações de Exibição */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Exibir Números */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-secondary-700 block">
                        Exibição dos Números
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setShowNumbers(!showNumbers)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showNumbers ? 'bg-primary-500' : 'bg-secondary-300'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showNumbers ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                        <span className="text-sm text-secondary-600">
                          {showNumbers ? 'Mostrar números' : 'Ocultar números'}
                        </span>
                      </div>
                    </div>

                    {/* Tamanho da Fonte */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-secondary-700 block">
                        Tamanho da Fonte
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-secondary-500 min-w-[30px]">8px</span>
                          <input
                            type="range"
                            min="2"
                            max="32"
                            step="1"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="flex-1 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
                            disabled={!showNumbers}
                          />
                          <span className="text-xs text-secondary-500 min-w-[30px]">32px</span>
                        </div>
                        <div className="text-center">
                          <span className={`inline-block px-3 py-1 rounded-md font-medium ${showNumbers
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-secondary-100 text-secondary-500'
                            }`}>
                            {fontSize}px
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={wheelContainerRef} className="relative">
            <Wheel
              ref={wheelRef}
              size={wheelSize}
              showNumbers={showNumbers}
              fontSize={fontSize}
              onSpinComplete={handleSpinComplete}
            />

            {/* Popup do resultado - posicionado no centro da roleta */}
            <AnimatePresence>
              {showResult && lastDrawn && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.1
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.1
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: 0.8
                  }}
                  className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                  <div className="relative pointer-events-auto">
                    {/* Imagem do whisky como fundo */}
                    <img
                      src={WhyskySorteioNumeroTemplate}
                      alt="Whisky Sorteio"
                      className="w-[30rem] h-auto drop-shadow-2xl"
                    />

                    {/* Número sobreposto na imagem */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div style={{ marginTop: '180px' }}>
                        <div className="font-bold text-white drop-shadow-lg mb-2" style={{ fontSize: '7rem', textShadow: '6px 6px 8px rgba(0,0,0,0.8)' }}>
                          {lastDrawn}
                        </div>
                      </div>
                    </div>

                    {/* Botão para fechar */}
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                      <motion.button
                        onClick={handleCloseResult}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                        }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 4px 15px rgba(34, 197, 94, 0.4)",
                            "0 8px 25px rgba(34, 197, 94, 0.6)",
                            "0 4px 15px rgba(34, 197, 94, 0.4)"
                          ]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition-all duration-200 text-xl overflow-hidden"
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          UHUUU!
                        </motion.div>

                        {/* Efeito de brilho */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                          animate={{
                            x: ["-100%", "100%"]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


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
