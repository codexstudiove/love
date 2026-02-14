import React, { useState } from 'react';
import { GameState } from '../../types';
import { DRIVER_IMAGES } from './driverImages';

interface RewardsProps {
    gameState: GameState;
    updateGameState: <K extends keyof GameState>(key: K, value: GameState[K]) => void;
}

// FIX: The REWARDS_LIST was incomplete and contained a corrupted message.
// It has been completed with more reward options.
const REWARDS_LIST = [
    { id: 'R1', cost: 20, title: "Mensaje de Verstappen", driver: "Verstappen", message: "Como Max en la última vuelta, así llegaste a mi vida: rápido, inesperado y para ganarlo todo." },
    { id: 'R2', cost: 20, title: "Reflexión de Hamilton", driver: "Hamilton", message: "Dicen que la paciencia es una virtud, pero esperarte a ti ha sido mi mejor estrategia de carrera." },
    { id: 'R3', cost: 20, title: "Declaración de Leclerc", driver: "Leclerc", message: "Mi corazón era Mónaco: estrecho, complicado y difícil de adelantar. Hasta que llegaste tú y conseguiste la pole, la vuelta rápida y la victoria." },
    { id: 'R4', cost: 20, title: "Promesa de Sainz", driver: "Sainz", message: "Smooth operator en la pista, pero contigo se me calan hasta los pensamientos. Eres mi victoria más dulce." },
    { id: 'R5', cost: 40, title: "Fondo de Pantalla: Piastri", driver: "Piastri", message: "Un fondo de pantalla exclusivo de Oscar Piastri para tu móvil. ¡El futuro es ahora!" },
    { id: 'R6', cost: 40, title: "Fondo de Pantalla: Russell", driver: "Russell", message: "Un fondo de pantalla elegante de George Russell. Para que siempre tengas un gentleman en tu bolsillo." },
    { id: 'R7', cost: 200, title: "Un Regalo del Corazón", driver: "SpecialGift", message: "Quiero que sepas algo importante: cada esfuerzo que haces, cada pequeño paso que das, incluso cuando sientes que nadie lo ve, tiene un valor inmenso. Este regalo es un pequeño recordatorio de que tu perseverancia ilumina el mundo. Eres más fuerte y capaz de lo que imaginas. Nunca dejes de creer en ti, porque yo nunca dejaré de hacerlo." },
];

// FIX: The Rewards component was missing. It has been implemented here.
const Rewards: React.FC<RewardsProps> = ({ gameState, updateGameState }) => {
    const [selectedReward, setSelectedReward] = useState<(typeof REWARDS_LIST)[0] | null>(null);

    const handleUnlock = (reward: (typeof REWARDS_LIST)[0]) => {
        if (gameState.minigamePoints >= reward.cost && !gameState.unlockedRewards.includes(reward.id)) {
            updateGameState('minigamePoints', gameState.minigamePoints - reward.cost);
            updateGameState('unlockedRewards', [...gameState.unlockedRewards, reward.id]);
            setSelectedReward(reward);
        }
    };
    
    if (selectedReward) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in" onClick={() => setSelectedReward(null)}>
                <div className="bg-[#FFF8E7] p-8 rounded-2xl shadow-2xl max-w-md text-center" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-2xl font-great-vibes text-[#800020]">{selectedReward.title}</h3>
                    <img src={DRIVER_IMAGES[selectedReward.driver]} alt={selectedReward.driver} className="w-32 h-32 rounded-full mx-auto my-4 border-4 border-[#B8860B]" />
                    <p className="text-lg font-la-belle text-[#3D3D3D]">"{selectedReward.message}"</p>
                    <button onClick={() => setSelectedReward(null)} className="mt-6 px-4 py-2 bg-[#B8860B] text-white rounded-full">Cerrar</button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mt-12">
            <h3 className="text-3xl font-great-vibes text-center text-[#800020] mb-6">Recompensas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REWARDS_LIST.map(reward => {
                    const isUnlocked = gameState.unlockedRewards.includes(reward.id);
                    const canAfford = gameState.minigamePoints >= reward.cost;

                    return (
                        <div key={reward.id} className={`p-4 bg-[#FFF8E7] rounded-xl shadow-lg border ${isUnlocked ? 'border-yellow-400' : 'border-[#B8860B]/20'}`}>
                            <img src={DRIVER_IMAGES[reward.driver]} alt={reward.driver} className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-[#B8860B]" />
                            <h4 className="font-bold text-center text-[#800020]">{reward.title}</h4>
                            <p className="text-center text-sm text-[#3D3D3D] mt-1 mb-3">Costo: {reward.cost} Puntos</p>
                            <button
                                onClick={() => isUnlocked ? setSelectedReward(reward) : handleUnlock(reward)}
                                disabled={!isUnlocked && !canAfford}
                                className="w-full px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed
                                    ${isUnlocked
                                        ? 'bg-transparent border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B]/10'
                                        : 'bg-[#B8860B] text-white hover:bg-opacity-80'
                                    }"
                            >
                                {isUnlocked ? 'Ver Recompensa' : 'Desbloquear'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// FIX: Add default export to resolve the module import error.
export default Rewards;