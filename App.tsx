
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ModuleId, GameState } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import ParticleCanvas, { ParticleEffect } from './components/shared/ParticleCanvas';
import Navigation from './components/Navigation';
import GardenModule from './components/Module1GardenOfMemories';
import WorkshopModule from './components/Module2DiamondWorkshop';
import SudokuModule from './components/Module3HeartSudoku';
import TestamentModule, { TEN_MINUTES_MS } from './components/Module4TestamentOfSoul';
import ConstellationModule from './components/Module5ConstellationOfUs';
import MinigamesModule from './components/Module6Minigames';
import MyLifeModule from './components/Module7MyLife';
import Preloader from './components/Preloader';
import PinLock from './components/PinLock';

const App: React.FC = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.GARDEN);
    const [particleEffect, setParticleEffect] = useState<ParticleEffect>({ type: 'none' });

    const [gameState, setGameState] = useLocalStorage<GameState>('mariviGameState', {
        diamondPaintingComplete: false,
        sudokuComplete: false,
        testamentUnlockedTime: null,
        constellationsComplete: [false, false, false],
        minigamePoints: 0,
        unlockedRewards: [],
    });
    
    // estado especifico para el temporizador del testamento que se maneja localmente en el componente ya que es un valor derivado del tiempo actual y el tiempo de desbloqueo guardado en el gameState
    const [testamentTimeLeft, setTestamentTimeLeft] = useState(TEN_MINUTES_MS);
    const timerRef = useRef<number | null>(null);

    const updateGameState = useCallback(<K extends keyof GameState>(key: K, value: GameState[K]) => {
        setGameState(prev => ({ ...prev, [key]: value }));
    }, [setGameState]);

    // Efecto para manejar el temporizador del testamento. Se activa cada vez que cambia el tiempo de desbloqueo en el gameState
    useEffect(() => {
        const unlockedTime = gameState.testamentUnlockedTime;

        const clearTimer = () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
        
        // Si no hay tiempo de desbloqueo o ya ha pasado, nos aseguramos de que no haya ningún timer activo.
        if (!unlockedTime || Date.now() >= unlockedTime) {
            clearTimer();
            setTestamentTimeLeft(Date.now() >= (unlockedTime || 0) ? 0 : TEN_MINUTES_MS);
            return; // sale del efecto
        }
        
        // Si llegamos aquí, hay un timer activo. Lo configuramos.
        setTestamentTimeLeft(unlockedTime - Date.now()); // Sincroniza el tiempo inicial.

        timerRef.current = window.setInterval(() => {
            const remaining = unlockedTime - Date.now();
            if (remaining > 0) {
                setTestamentTimeLeft(remaining);
            } else {
                setTestamentTimeLeft(0);
                clearTimer(); // Limpiamos el timer cuando llega a cero.
            }
        }, 1000);

        return clearTimer; // La función de limpieza que se ejecuta cuando el componente se desmonta o la dependencia cambia.
    }, [gameState.testamentUnlockedTime]);


    const startTestamentTimer = useCallback(() => {
        // iniciacion del timer, pero solo si no hay uno activo o el tiempo ya ha pasado
        if (gameState.testamentUnlockedTime && Date.now() < gameState.testamentUnlockedTime) {
            return;
        }
        const unlockedTime = Date.now() + TEN_MINUTES_MS;
        updateGameState('testamentUnlockedTime', unlockedTime);
    }, [gameState.testamentUnlockedTime, updateGameState]);

    const resetTestamentTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        updateGameState('testamentUnlockedTime', null);
    }, [updateGameState]);


    const triggerFireworks = useCallback(() => {
        setParticleEffect({ type: 'fireworks' });
        setTimeout(() => setParticleEffect({ type: 'none' }), 5000);
    }, []);

    const handleUnlock = () => {
        setIsUnlocked(true);
    };

    const handleReady = () => {
        setIsReady(true);
    };

    if (!isUnlocked) {
        return <PinLock onUnlock={handleUnlock} />;
    }

    if (!isReady) {
        return <Preloader onReady={handleReady} />;
    }
    
    // derivar o almacenar
    const isWaitingOnTestament = gameState.testamentUnlockedTime !== null && testamentTimeLeft > 0;

    const renderModule = () => {
        switch (activeModule) {
            case ModuleId.GARDEN:
                return <GardenModule />;
            case ModuleId.WORKSHOP:
                return <WorkshopModule gameState={gameState} updateGameState={updateGameState} triggerFireworks={triggerFireworks} />;
            case ModuleId.MINIGAMES:
                return <MinigamesModule gameState={gameState} updateGameState={updateGameState} />;
            case ModuleId.SUDOKU:
                return <SudokuModule gameState={gameState} updateGameState={updateGameState} triggerFireworks={triggerFireworks} />;
            case ModuleId.TESTAMENT:
                return <TestamentModule 
                            gameState={gameState} 
                            startTimer={startTestamentTimer} 
                            isWaiting={isWaitingOnTestament}
                            timeLeft={testamentTimeLeft}
                            resetTimer={resetTestamentTimer}
                        />;
            case ModuleId.CONSTELLATION:
                return <ConstellationModule gameState={gameState} updateGameState={updateGameState} triggerFireworks={triggerFireworks} />;
            case ModuleId.MY_LIFE:
                return <MyLifeModule />;
            default:
                return <GardenModule />;
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FFF8E7] text-[#3D3D3D] font-cormorant">
            <ParticleCanvas effect={particleEffect} />
            <div className="relative z-10">
                <header className="text-center pt-12 pb-8">
                    <h1 className="text-6xl md:text-8xl font-great-vibes text-[#800020]">Mariví</h1>
                    <p className="text-lg md:text-xl text-[#B8860B] mt-2 font-cormorant italic">Para ti, que haces que el tiempo se detenga</p>
                </header>
                
                <Navigation activeModule={activeModule} setActiveModule={setActiveModule} />
                
                <main className="w-full max-w-7xl mx-auto px-4 py-8">
                    {renderModule()}
                </main>

                <footer className="text-center py-8 text-[#B8860B] text-sm">
                    <p>Hecho con todo el amor del universo, solo para ti.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
