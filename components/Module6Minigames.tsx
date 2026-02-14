
import React, { useState, useCallback } from 'react';
import { GameState } from '../types';
import MemoryGame from './minigames/MemoryGame';
import SudokuGame from './minigames/SudokuGame';
import MinesweeperGame from './minigames/MinesweeperGame';
import ReflexRaceGame from './minigames/ReflexRaceGame';
import CryptogramGame from './minigames/CryptogramGame';
import Rewards from './minigames/Rewards';

interface MinigamesModuleProps {
    gameState: GameState;
    updateGameState: <K extends keyof GameState>(key: K, value: GameState[K]) => void;
}

type GameId = 'memory' | 'sudoku' | 'minesweeper' | 'reflex' | 'crypto';

const GAMES: { id: GameId; name: string; icon: string; description: string }[] = [
    { id: 'memory', name: "Memoria de Campeones", icon: "fa-brain", description: "Encuentra los pares de pilotos de F1." },
    { id: 'sudoku', name: "Sudoku Clásico", icon: "fa-border-all", description: "Un puzzle numérico para relajar la mente." },
    { id: 'minesweeper', name: "Buscaminas del Destino", icon: "fa-bomb", description: "Revela las casillas sin encontrar una sorpresa." },
    { id: 'reflex', name: "Carrera de Reflejos", icon: "fa-flag-checkered", description: "¡Reacciona a las luces de salida!" },
    { id: 'crypto', name: "Criptograma del Corazón", icon: "fa-key", description: "Descifra el mensaje secreto de amor." },
];

const GameWrapper: React.FC<{ title: string; onBack: () => void; children: React.ReactNode }> = ({ title, onBack, children }) => (
    <div className="w-full flex flex-col items-center animate-fade-in-up">
        <div className="w-full flex justify-start mb-4">
            <button onClick={onBack} className="px-4 py-2 bg-transparent border border-[#B8860B] text-[#B8860B] rounded-full hover:bg-[#B8860B]/10 transition-colors">
                <span className="fa-solid fa-arrow-left mr-2"></span>
                Volver al menú
            </button>
        </div>
        <h3 className="text-3xl font-great-vibes text-[#800020] mb-6">{title}</h3>
        {children}
    </div>
);

const MinigamesModule: React.FC<MinigamesModuleProps> = ({ gameState, updateGameState }) => {
    const [activeGame, setActiveGame] = useState<GameId | null>(null);

    const handleGameComplete = useCallback(() => {
        updateGameState('minigamePoints', gameState.minigamePoints + 20);
        setActiveGame(null); // Return to menu
    }, [gameState.minigamePoints, updateGameState]);

    const renderGame = () => {
        const game = GAMES.find(g => g.id === activeGame);
        if (!game) return null;

        let gameComponent;
        switch (activeGame) {
            case 'memory': gameComponent = <MemoryGame onGameComplete={handleGameComplete} />; break;
            case 'sudoku': gameComponent = <SudokuGame onGameComplete={handleGameComplete} />; break;
            case 'minesweeper': gameComponent = <MinesweeperGame onGameComplete={handleGameComplete} />; break;
            case 'reflex': gameComponent = <ReflexRaceGame onGameComplete={handleGameComplete} />; break;
            case 'crypto': gameComponent = <CryptogramGame onGameComplete={handleGameComplete} />; break;
            default: return null;
        }

        return (
            <GameWrapper title={game.name} onBack={() => setActiveGame(null)}>
                {gameComponent}
            </GameWrapper>
        );
    };
    
    const renderMenu = () => (
        <div className="flex flex-col items-center space-y-8 animate-fade-in-up">
            <div className="text-center">
                <h2 className="text-4xl font-great-vibes text-[#800020]">Salón de Minijuegos</h2>
                <p className="mt-2 text-[#3D3D3D]">Un pequeño universo de juegos, creado solo para ti.</p>
                <p className="mt-4 text-xl font-bold text-[#B8860B]">
                    <span className="fa-solid fa-coins mr-2"></span>
                    {gameState.minigamePoints} Puntos
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                {GAMES.map(game => (
                    <button 
                        key={game.id} 
                        onClick={() => setActiveGame(game.id)}
                        className="p-6 bg-[#FFF8E7] rounded-2xl shadow-lg border border-[#B8860B]/20 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                           <span className={`fa-solid ${game.icon} text-3xl text-[#B8860B]`}></span>
                           <div>
                                <h3 className="font-bold text-lg text-[#800020]">{game.name}</h3>
                                <p className="text-sm text-[#3D3D3D]">{game.description}</p>
                           </div>
                        </div>
                    </button>
                ))}
            </div>
            
            <Rewards gameState={gameState} updateGameState={updateGameState} />

        </div>
    );

    return activeGame ? renderGame() : renderMenu();
};

export default MinigamesModule;