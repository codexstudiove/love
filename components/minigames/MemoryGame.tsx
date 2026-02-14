
import React, { useState, useEffect, useCallback } from 'react';
import { DRIVER_IMAGES } from './driverImages';

interface MemoryGameProps {
    onGameComplete: () => void;
}

const DRIVERS = ["Verstappen", "Piastri", "Hamilton", "Leclerc", "Sainz", "Perez", "Bottas", "Hulkenberg", "Russell", "Colapinto"];

type Card = { id: number; name: string; isFlipped: boolean; isMatched: boolean };

const MemoryGame: React.FC<MemoryGameProps> = ({ onGameComplete }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [isGameWon, setIsGameWon] = useState(false);

    const shuffleCards = useCallback(() => {
        const duplicatedDrivers = [...DRIVERS, ...DRIVERS];
        const shuffled = duplicatedDrivers
            .map((name, index) => ({ id: index, name, isFlipped: false, isMatched: false }))
            .sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setMoves(0);
        setFlippedIndices([]);
        setIsGameWon(false);
    }, []);

    useEffect(() => {
        shuffleCards();
    }, [shuffleCards]);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            setIsChecking(true);
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.name === secondCard.name) {
                // Match
                setCards(prev => prev.map(card => 
                    card.name === firstCard.name ? { ...card, isMatched: true, isFlipped: true } : card
                ));
                setFlippedIndices([]);
                setIsChecking(false);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => prev.map((card, index) =>
                        (index === firstIndex || index === secondIndex) ? { ...card, isFlipped: false } : card
                    ));
                    setFlippedIndices([]);
                    setIsChecking(false);
                }, 1200);
            }
        }
    }, [flippedIndices, cards]);
    
    useEffect(() => {
        const allMatched = cards.length > 0 && cards.every(c => c.isMatched);
        if (allMatched) {
            setIsGameWon(true);
            setTimeout(() => {
                onGameComplete();
            }, 2000);
        }
    }, [cards, onGameComplete]);

    const handleCardClick = (index: number) => {
        if (isChecking || cards[index].isFlipped || flippedIndices.length >= 2) {
            return;
        }

        if (flippedIndices.length === 0) {
           setMoves(m => m + 1);
        }

        setFlippedIndices(prev => [...prev, index]);
        setCards(prev => prev.map((card, i) => 
            i === index ? { ...card, isFlipped: true } : card
        ));
    };

    return (
        <div className="flex flex-col items-center">
            <p className="mb-4 text-lg">Movimientos: {moves}</p>
            <div className={`grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 p-4 bg-[#FADADD]/40 backdrop-blur-sm rounded-3xl shadow-lg ${isGameWon ? 'animate-tada' : ''}`}>
                {cards.map((card, index) => (
                    <div 
                        key={card.id} 
                        className="w-16 h-24 sm:w-20 sm:h-28 perspective-1000"
                        onClick={() => handleCardClick(index)}
                    >
                        <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${card.isFlipped ? 'rotate-y-180' : ''}`}>
                            {/* Card Back */}
                            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#800020] to-[#a00028] rounded-xl flex items-center justify-center cursor-pointer shadow-md">
                                <span className="fa-solid fa-flag-checkered text-3xl sm:text-4xl text-white/50"></span>
                            </div>
                            {/* Card Front */}
                            <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-md border-4 ${card.isMatched ? 'border-yellow-400' : 'border-transparent'}`}>
                                <img src={DRIVER_IMAGES[card.name]} alt={card.name} className="w-full h-full object-cover"/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isGameWon && <p className="mt-4 text-xl font-great-vibes text-[#800020]">¡Excelente memoria!</p>}
        </div>
    );
};

export default MemoryGame;
