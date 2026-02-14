
import React, { useEffect } from 'react';
import { GameState } from '../types';

interface TestamentModuleProps {
    gameState: GameState;
    startTimer: () => void;
    isWaiting: boolean;
    timeLeft: number;
    resetTimer: () => void;
}

export const TEN_MINUTES_MS = 10 * 60 * 1000;

const TestamentModule: React.FC<TestamentModuleProps> = ({ gameState, startTimer, isWaiting, timeLeft, resetTimer }) => {

    useEffect(() => {
         const handleVisibilityChange = () => {
            if (document.hidden && isWaiting) {
                alert("El tiempo es un tesoro. Por favor, no te vayas, este momento es solo nuestro.");
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
             document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
    }, [isWaiting]);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const isUnlocked = gameState.testamentUnlockedTime !== null && Date.now() >= gameState.testamentUnlockedTime;

    if (isUnlocked || (isWaiting && timeLeft <= 0)) {
        return (
             <div className="flex flex-col items-center space-y-8 animate-fade-in-up">
                 <div className="w-full max-w-4xl bg-[#FFF8E7] p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-[#B8860B]/50">
                     <h2 className="text-4xl font-great-vibes text-center text-[#800020]">Lo que heredas de mí</h2>
                     <div className="font-la-belle text-xl md:text-2xl mt-8 space-y-6 text-[#3D3D3D] leading-loose text-justify">
                         <p>Mi queridísima Mariví,</p>
                         <p>
                             Si lees esto, es porque has decidido aceptar la herencia más valiosa que puedo ofrecerte, una que no se mide en bienes ni en oro, sino en latidos de un corazón que te pertenece. Te lego mi Tiempo. No el tiempo que marcan los relojes, ese tirano de manecillas implacables, sino mi tiempo, el que se detuvo y cobró sentido el día que llegaste.
                         </p>
                         <p>
                             Te lego todos los segundos que he pasado pensándote, que son incontables como las estrellas. Te lego los minutos en los que tu recuerdo me ha arrancado una sonrisa en medio del caos, convirtiendo un día gris en un lienzo de colores. Te lego las horas que anhelo a tu lado, horas que imagino llenas de risas, de silencios cómodos y de la paz que solo tu presencia sabe darme. Eres como ese retrato que nunca envejece, pero a diferencia de él, tu belleza no esconde un alma marchita, sino que la revela en todo su esplendor.
                         </p>
                         <p>
                            Mi promesa es sencilla: cada tic-tac de mi existencia será un eco de mi amor por ti. Seré el guardián de tus sueños, el refugio en tus tormentas y la calma en tu mar. Mi tiempo es tuyo para que hagas con él lo que desees: para construir, para soñar, para simplemente ser.
                         </p>
                         <p>
                             Esta web, estos juegos, estas palabras... son solo la antesala. Un prólogo diminuto de la historia épica que quiero escribir contigo. Porque mi amor por ti no es un capítulo, es el libro entero.
                         </p>
                         <p className="text-right">Con toda mi alma,<br/>Para ti.</p>
                     </div>
                 </div>
             </div>
        );
    }

    if (isWaiting) {
        return (
            <div className="text-center flex flex-col items-center space-y-6 animate-fade-in">
                <h2 className="text-3xl font-great-vibes text-[#800020]">El Tiempo es Nuestro Legado</h2>
                <p>Algunas cosas merecen una espera. Deja que el tiempo teja su magia...</p>
                <div className="text-6xl font-la-belle text-[#800020]">{formatTime(timeLeft)}</div>
                <p className="text-sm text-gray-500 max-w-md">Durante este tiempo, te invito a reflexionar sobre los fragmentos de historias que flotan en el aire, ecos de amores y destinos, como los nuestros.</p>
                <button
                    onClick={resetTimer}
                    className="px-6 py-2 bg-transparent border border-[#B8860B] text-[#B8860B] rounded-full hover:bg-[#B8860B]/10 transition-colors text-sm"
                >
                    Reiniciar contador
                </button>
            </div>
        );
    }

    return (
        <div className="text-center flex flex-col items-center space-y-6">
            <h2 className="text-4xl font-great-vibes text-[#800020]">El Testamento del Alma</h2>
            <p className="max-w-2xl text-lg">He escrito algo para ti. Algo que solo puede ser leído con el corazón en calma y el tiempo como testigo. Requiere un pequeño pacto: 10 minutos de tu tiempo, sin distracciones, para desbloquear un legado que te pertenece.</p>
            <button 
                onClick={startTimer}
                className="px-8 py-4 bg-[#800020] text-white rounded-full shadow-lg hover:bg-[#a00028] transition-colors font-semibold text-xl"
            >
                Leer el legado
            </button>
        </div>
    );
};

export default TestamentModule;