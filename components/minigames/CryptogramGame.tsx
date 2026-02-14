
import React, { useState } from 'react';

interface CryptogramGameProps {
    onGameComplete: () => void;
}

const ENCRYPTED_PHRASE = "T3 4M0 MUCH1S1M0, GR4C14S P0R T0D0";
const SOLUTION_PHRASE = "TE AMO MUCHISIMO, GRACIAS POR TODO";

const CryptogramGame: React.FC<CryptogramGameProps> = ({ onGameComplete }) => {
    const [userInput, setUserInput] = useState<string>('');
    const [isWrong, setIsWrong] = useState(false);
    const [isWon, setIsWon] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
    };

    const checkSolution = () => {
        if (isWon) return;

        if (userInput.trim().toUpperCase() === SOLUTION_PHRASE) {
            setIsWon(true);
            setTimeout(() => onGameComplete(), 2000);
        } else {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 820);
        }
    };

    if (isWon) {
        return (
            <div className="flex flex-col items-center text-center p-8 animate-fade-in-up">
                <h3 className="text-3xl font-great-vibes text-[#800020]">¡Mensaje descifrado!</h3>
                <p className="text-2xl font-la-belle text-[#B8860B] my-4">"{SOLUTION_PHRASE}"</p>
                <p>Tu inteligencia es tan brillante como tu corazón.</p>
            </div>
        )
    }

    return (
        <div className={`flex flex-col items-center max-w-3xl w-full ${isWrong ? 'animate-shake' : ''}`}>
            <div className="p-6 bg-[#FADADD]/40 backdrop-blur-sm rounded-lg shadow-lg text-center w-full">
                <p className="text-xl font-la-belle text-[#800020]">Frase Cifrada:</p>
                <p className="text-2xl font-mono tracking-widest my-4">{ENCRYPTED_PHRASE}</p>
            </div>

            <div className="my-6 w-full text-center">
                 <p className="text-lg font-cormorant text-[#3D3D3D] mb-2">Escribe lo que dice:</p>
                 <textarea
                    value={userInput}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full max-w-md p-3 border-2 border-[#B8860B] bg-[#FFF8E7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] text-lg font-mono"
                    placeholder="Tu respuesta aquí..."
                    disabled={isWon}
                 />
            </div>
            
            <button
                onClick={checkSolution}
                disabled={isWon}
                className="mt-4 px-6 py-2 bg-[#B8860B] text-white rounded-full hover:bg-opacity-80 transition-colors disabled:bg-gray-400"
            >
                Comprobar Solución
            </button>
        </div>
    );
};

export default CryptogramGame;
