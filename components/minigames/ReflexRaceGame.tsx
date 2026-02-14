
import React, { useState, useRef, useCallback } from 'react';

interface ReflexRaceGameProps {
    onGameComplete: () => void;
}

type GamePhase = 'idle' | 'waiting' | 'ready' | 'clickedTooSoon' | 'result';

const Light: React.FC<{ on: boolean }> = ({ on }) => (
    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full transition-colors ${on ? 'bg-red-500 shadow-[0_0_15px_5px_rgba(239,68,68,0.7)]' : 'bg-gray-700'}`}></div>
);

const ReflexRaceGame: React.FC<ReflexRaceGameProps> = ({ onGameComplete }) => {
    const [phase, setPhase] = useState<GamePhase>('idle');
    const [lights, setLights] = useState([false, false, false, false, false]);
    const [result, setResult] = useState<number | null>(null);
    const timer = useRef<number | null>(null);
    const startTime = useRef<number>(0);

    const startSequence = () => {
        setPhase('waiting');
        setResult(null);

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                setLights(prev => {
                    const newLights = [...prev];
                    newLights[i] = true;
                    return newLights;
                });
            }, (i + 1) * 700);
        }
        
        const randomDelay = Math.random() * 3000 + 1000;
        timer.current = window.setTimeout(() => {
            setLights([false, false, false, false, false]);
            setPhase('ready');
            startTime.current = performance.now();
        }, 5 * 700 + randomDelay);
    };

    const handleClick = () => {
        if (phase === 'waiting') {
            if (timer.current) clearTimeout(timer.current);
            setPhase('clickedTooSoon');
        } else if (phase === 'ready') {
            const endTime = performance.now();
            setResult(endTime - startTime.current);
            setPhase('result');
        }
    };

    const resetGame = (isComplete: boolean) => {
        setPhase('idle');
        setLights([false, false, false, false, false]);
        setResult(null);
        if (timer.current) clearTimeout(timer.current);
        if(isComplete){
            onGameComplete();
        }
    };

    const renderContent = () => {
        switch (phase) {
            case 'idle':
                return <button onClick={startSequence} className="px-8 py-4 bg-[#800020] text-white rounded-full shadow-lg hover:bg-[#a00028] transition-colors font-semibold text-xl">Iniciar Carrera</button>;
            case 'waiting':
            case 'ready':
                return <p className="text-xl">¡Haz clic cuando las luces se apaguen!</p>;
            case 'clickedTooSoon':
                return (
                    <div className="text-center animate-fade-in">
                        <p className="text-xl text-yellow-300">¡Ups! Un poco pronto.</p>
                        <p className="text-sm">¡Inténtalo de nuevo!</p>
                        <button onClick={() => resetGame(true)} className="mt-4 px-4 py-2 bg-transparent border border-white text-white rounded-full">Reiniciar</button>
                    </div>
                );
            case 'result':
                return (
                     <div className="text-center animate-fade-in-up">
                        <p className="text-2xl">Tu tiempo de reacción:</p>
                        <p className="text-5xl font-bold text-white my-2 animate-tada">{result?.toFixed(2)} ms</p>
                        <button onClick={() => resetGame(true)} className="mt-4 px-4 py-2 bg-transparent border border-white text-white rounded-full">Jugar de nuevo</button>
                    </div>
                );
        }
    };

    return (
        <div 
            className="w-full max-w-lg h-96 flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-4 text-white shadow-2xl"
            onClick={handleClick}
        >
            <div className="flex gap-2 sm:gap-4 mb-8">
                {lights.map((isOn, index) => <Light key={index} on={isOn} />)}
            </div>
            <div className="h-24 flex items-center justify-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default ReflexRaceGame;