
import React, { useState, useEffect, useRef } from 'react';

const VIDEOS = {
    max: {
        id: 'RkpQvhg-IWw',
        title: "Max Verstappen - Campeón del Mundo 2024",
        duration: 61, // 1 minute 1 second
        thumbnail: 'https://img.youtube.com/vi/RkpQvhg-IWw/hqdefault.jpg',
    },
    mclaren: {
        id: 'E98CPHFuzBE',
        title: "El Choque de McLaren en Bakú 2025",
        duration: 19, // 19 seconds
        thumbnail: 'https://img.youtube.com/vi/E98CPHFuzBE/hqdefault.jpg',
    }
};

const PILOTS = ["Max Verstappen", "Lando Norris", "Oscar Piastri"];

type VideoKey = keyof typeof VIDEOS;

const VideoPlayerModal: React.FC<{ videoKey: VideoKey; onWatched: () => void; onClose: () => void; }> = ({ videoKey, onWatched, onClose }) => {
    const video = VIDEOS[videoKey];
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const totalDuration = video.duration * 1000;
        const updateInterval = 100; // update every 100ms
        const increment = (updateInterval / totalDuration) * 100;

        intervalRef.current = window.setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    onWatched();
                    return 100;
                }
                return prev + increment;
            });
        }, updateInterval);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [video.duration, onWatched]);

    return (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fade-in">
             <button onClick={onClose} className="absolute top-4 right-4 text-white text-4xl z-10 hover:text-rose-500 transition-colors" aria-label="Cerrar video">&times;</button>
            <div className="w-full max-w-4xl p-4">
                <div className="relative w-full" style={{paddingBottom: '56.25%'}}>
                    <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&controls=0&modestbranding=1&rel=0`}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen>
                    </iframe>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-4">
                    <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                 <p className="text-white text-center mt-2 text-sm">Viendo: {video.title}</p>
            </div>
        </div>
    );
};

const Preloader: React.FC<{ onReady: () => void }> = ({ onReady }) => {
    const [activeVideo, setActiveVideo] = useState<VideoKey | null>(null);
    const [maxWatched, setMaxWatched] = useState(false);
    const [mclarenWatched, setMclarenWatched] = useState(false);
    const [pollSelection, setPollSelection] = useState<string | null>(null);
    const [pollAnswered, setPollAnswered] = useState(false);

    const handleWatched = (key: VideoKey) => {
        if (key === 'max') setMaxWatched(true);
        if (key === 'mclaren') setMclarenWatched(true);
        setActiveVideo(null);
    };

    const handlePollClick = (pilot: string) => {
        if (pollSelection) return;
        setPollSelection(pilot);
        setTimeout(() => {
            setPollAnswered(true);
        }, 1500);
    };

    const allVideosWatched = maxWatched && mclarenWatched;

    const getButtonClass = (pilot: string) => {
        if (!pollSelection) return 'bg-rose-600 hover:bg-rose-700';

        if (pollAnswered) {
            return pilot === 'Max Verstappen' ? 'bg-green-600 animate-tada' : 'bg-gray-700 opacity-50';
        }
        
        return pilot === pollSelection ? 'bg-red-600' : 'bg-gray-700 opacity-50';
    };


    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col items-center justify-center p-4 font-cormorant">
            <div className="text-center animate-fade-in-up">
                <h1 className="text-5xl font-great-vibes text-[#FADADD]">Una parada en pits</h1>
                <p className="text-lg text-gray-300 mt-2">Antes de empezar, hay dos momentos que debemos recordar.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 my-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-2xl shadow-lg w-full max-w-xs sm:w-80">
                    <h3 className="text-xl font-semibold mb-3 h-12 flex items-center justify-center">{VIDEOS.max.title}</h3>
                    <img src={VIDEOS.max.thumbnail} alt={VIDEOS.max.title} className="rounded-lg mb-4" />
                    {maxWatched ? (
                        <div className="h-10 flex items-center gap-2 text-green-400">
                             <span className="fa-solid fa-check-circle"></span>
                             <span>Visto</span>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setActiveVideo('max')}
                            className="h-10 px-4 py-2 bg-rose-600 rounded-full hover:bg-rose-700 transition-colors"
                        >
                            Ver Video
                        </button>
                    )}
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-2xl shadow-lg w-full max-w-xs sm:w-80">
                     <h3 className="text-xl font-semibold mb-3 h-12 flex items-center justify-center">{VIDEOS.mclaren.title}</h3>
                    <img src={VIDEOS.mclaren.thumbnail} alt={VIDEOS.mclaren.title} className="rounded-lg mb-4" />
                    {mclarenWatched ? (
                        <div className="h-10 flex items-center gap-2 text-green-400">
                             <span className="fa-solid fa-check-circle"></span>
                             <span>Visto</span>
                        </div>
                    ) : (
                         <button 
                            onClick={() => setActiveVideo('mclaren')}
                            className="h-10 px-4 py-2 bg-rose-600 rounded-full hover:bg-rose-700 transition-colors"
                        >
                            Ver Video
                        </button>
                    )}
                </div>
            </div>
            
            <div className="h-40 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
                {!allVideosWatched && (
                     <div className="text-center">
                        <p className="text-gray-400 italic">Debes ver ambos videos para desbloquear la pregunta final.</p>
                    </div>
                )}
                {allVideosWatched && !pollAnswered && (
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4">Pregunta rápida: ¿Quién es el mejor piloto?</h3>
                        <div className="flex gap-4">
                            {PILOTS.map(pilot => (
                                <button
                                    key={pilot}
                                    onClick={() => handlePollClick(pilot)}
                                    disabled={!!pollSelection}
                                    className={`px-6 py-2 rounded-full transition-all duration-500 text-white font-semibold ${getButtonClass(pilot)}`}
                                >
                                    {pilot}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {pollAnswered && (
                     <div className="text-center">
                        <p className="text-lg text-green-400 mb-4 animate-fade-in">Correcto, es Max Verstappen. Solo hay un ganador y un buen piloto siempre.</p>
                        <button 
                            onClick={onReady}
                            className="px-8 py-4 bg-[#B8860B] text-white rounded-full shadow-lg hover:bg-opacity-80 transition-colors font-semibold text-xl animate-tada"
                        >
                            Continuar a nuestro mundo
                        </button>
                    </div>
                )}
            </div>

            {activeVideo && <VideoPlayerModal videoKey={activeVideo} onWatched={() => handleWatched(activeVideo)} onClose={() => setActiveVideo(null)} />}
        </div>
    );
};

export default Preloader;
