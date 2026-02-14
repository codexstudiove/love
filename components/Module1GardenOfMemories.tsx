
import React, { useState } from 'react';
import { generateCompliment } from '../services/geminiService';

const Diamond: React.FC<{ onReveal: () => Promise<string> }> = ({ onReveal }) => {
    const [compliment, setCompliment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleClick = async () => {
        if (isRevealed) return;
        setIsLoading(true);
        const newCompliment = await onReveal();
        setCompliment(newCompliment);
        setIsLoading(false);
        setIsRevealed(true);
    };

    return (
        <div className="relative group flex items-center justify-center">
            <button
                onClick={handleClick}
                disabled={isLoading || isRevealed}
                className={`transition-all duration-300 ${isRevealed ? 'opacity-50' : 'hover:scale-125'}`}
            >
                <span className={`fa-solid fa-gem text-4xl text-[#B8860B]/70 ${isLoading ? 'animate-spin' : ''}`}></span>
            </button>
            {isRevealed && compliment && (
                <div className="absolute -top-12 z-20 p-2 bg-[#FADADD] text-[#800020] rounded-lg shadow-lg text-center text-sm w-48 animate-fade-in-up font-semibold font-la-belle text-base">
                    {compliment}
                </div>
            )}
        </div>
    );
};

const MessageInABottle: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const messages = [
        "Dicen que cada persona es un universo. Si es así, perderme en el tuyo es el único viaje que mi alma necesita. Eres mi cosmos entero.",
        "Antes de ti, mis días eran en prosa. Contigo, mi vida se convirtió en el más hermoso de los poemas, con versos que solo nosotros entendemos.",
        "Hay amores que son un huracán y otros que son un puerto seguro. Lo nuestro es un océano entero: a veces calma, a veces tempestad, pero siempre inmenso y profundo."
    ];
    const [currentMessage] = useState(messages[Math.floor(Math.random() * messages.length)]);

    return (
        <div className="fixed bottom-4 right-4 z-20 group">
            <button onClick={() => setIsOpen(!isOpen)} className="text-5xl animate-bounce">
                <span className="fa-solid fa-bottle-water text-[#B8860B]/50 group-hover:text-[#B8860B]/80 transition-colors"></span>
            </button>
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-64 bg-[#FFF8E7] p-4 rounded-xl shadow-2xl border border-[#B8860B] animate-fade-in-up" onClick={() => setIsOpen(false)}>
                    <p className="font-la-belle text-lg text-[#3D3D3D]">{currentMessage}</p>
                    <span className="text-xs text-right block mt-2 text-[#B8860B]">- Un mensaje para ti</span>
                </div>
            )}
        </div>
    );
};


const GardenModule: React.FC = () => {
    const [isBookOpen, setIsBookOpen] = useState(false);

    return (
        <div className="flex flex-col items-center space-y-12">
            <MessageInABottle />
            <div className="text-center">
                <h2 className="text-4xl font-great-vibes text-[#800020]">El Jardín de los Recuerdos</h2>
                <p className="mt-2 text-[#3D3D3D]">Un lugar donde nuestros momentos florecen eternamente.</p>
            </div>

            {/* 3D Book */}
            <div style={{ perspective: '1000px' }} className="w-full max-w-xs h-72 sm:max-w-lg sm:h-80">
                <div 
                    className={`relative w-full h-full transition-transform duration-1000 cursor-pointer`} 
                    style={{ transformStyle: 'preserve-3d', transform: isBookOpen ? 'translateX(50%)' : 'translateX(0) rotateY(-30deg)' }}
                    onClick={() => setIsBookOpen(!isBookOpen)}
                >
                    {/* Back cover */}
                    <div className="absolute w-full h-full bg-[#800020] rounded-r-lg shadow-2xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg) translateZ(-2px)'}}>
                    </div>
                    {/* Pages */}
                    <div className="absolute w-full h-full bg-[#FFF8E7] shadow-inner" style={{ transform: 'rotateY(0deg) translateZ(-1px)'}}></div>
                    
                    {/* Front cover */}
                    <div 
                        className={`absolute w-full h-full bg-[#800020] rounded-lg shadow-2xl origin-left transition-transform duration-1000 flex flex-col items-center justify-center p-4`}
                        style={{ backfaceVisibility: 'hidden', transform: isBookOpen ? 'rotateY(-160deg)' : 'rotateY(0deg)'}}
                    >
                         <h3 className="font-great-vibes text-4xl text-[#B8860B]">Nuestro Libro</h3>
                         <p className="text-[#FADADD] text-center mt-4">Toca para abrir y recordar...</p>
                    </div>

                    {/* Inside Page */}
                    <div className={`absolute w-full h-full bg-[#FFF8E7] p-6 overflow-y-auto ${isBookOpen ? '' : 'hidden'}`}>
                        <h3 className="font-great-vibes text-2xl text-[#800020]">Tesoros Guardados</h3>
                        <ul className="mt-4 space-y-4 text-sm leading-relaxed">
                            <li>
                                <strong className="text-[#800020]">La primera vez que te vi...</strong><br />
                                Fue como si el universo hubiera estado conspirando para ese preciso instante. Todo lo demás se desvaneció, y solo existías tú.
                            </li>
                            <li>
                                <strong className="text-[#800020]">Nuestra canción...</strong><br />
                                <div className="relative mt-2" style={{ paddingBottom: '56.25%', height: 0 }}>
                                  <iframe className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/7IfmlWrC4co?si=5cP6uzhAZMo7nwFq&amp;autoplay=1&mute=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                                </div>
                            </li>
                            <li>
                                <strong className="text-[#800020]">Tu sonrisa es...</strong><br />
                                ...la única prueba que necesito de que la magia existe. Un destello que ilumina hasta el rincón más oscuro de mi alma.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-3xl text-center pt-12">
                <h3 className="text-3xl font-great-vibes text-[#800020]">Un Jardín de Diamantes para Ti</h3>
                <p className="mt-2 text-[#3D3D3D]">Cada uno guarda un secreto. Toca para descubrirlo.</p>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-8 mt-8 p-4 bg-[#FADADD]/30 rounded-3xl">
                    {Array.from({ length: 20 }).map((_, loopIndex) => (
                        <Diamond key={loopIndex} onReveal={() => generateCompliment('Mariví')} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GardenModule;