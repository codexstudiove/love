
import React, { useState, useEffect, useRef } from 'react';

const CORRECT_PIN = "140226";

interface PinLockProps {
    onUnlock: () => void;
}

const PinLock: React.FC<PinLockProps> = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [isError, setIsError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 6) {
            setPin(value);
        }
    };

    useEffect(() => {
        if (pin.length === 6) {
            if (pin === CORRECT_PIN) {
                // Success animation/delay before unlocking
                setTimeout(() => {
                    onUnlock();
                }, 500);
            } else {
                setIsError(true);
                setTimeout(() => {
                    setIsError(false);
                    setPin('');
                }, 820); // Match shake animation duration
            }
        }
    }, [pin, onUnlock]);

    // Focus the invisible input on mount and on clicks to the container
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const pinDigits = pin.split('');

    return (
        <div 
            className="min-h-screen bg-[#1E1E1E] text-white flex flex-col items-center justify-center p-4 font-cormorant"
            onClick={() => inputRef.current?.focus()} // Keep focus on the input
        >
            <div className="text-center animate-fade-in-up">
                <h1 className="text-5xl font-great-vibes text-[#FADADD]">Acceso Privado</h1>
                <p className="text-lg text-gray-300 mt-2">Introduce el código de nuestro universo.</p>
            </div>

            <div className="relative mt-12">
                {/* This input is functionally invisible but captures keyboard input */}
                <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    value={pin}
                    onChange={handlePinChange}
                    maxLength={6}
                    className="absolute inset-0 z-10 w-full h-full bg-transparent border-0 text-transparent focus:outline-none"
                    style={{ caretColor: 'transparent' }}
                    autoFocus
                />
                <div className={`flex items-center justify-center gap-2 ${isError ? 'animate-shake' : ''}`}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`w-12 h-16 md:w-14 md:h-20 flex items-center justify-center text-3xl font-mono border-2 rounded-lg transition-colors ${isError ? 'border-red-500' : 'border-gray-600'} ${pinDigits[index] ? 'border-[#FADADD]' : ''}`}
                            >
                                {pinDigits[index] || ''}
                            </div>
                            {(index === 1 || index === 3) && <span className="text-2xl text-gray-500">-</span>}
                        </React.Fragment>
                    ))}
                </div>
                 {isError && <p className="text-center text-red-500 mt-4 animate-fade-in">Código incorrecto. Inténtalo de nuevo.</p>}
            </div>
        </div>
    );
};

export default PinLock;
