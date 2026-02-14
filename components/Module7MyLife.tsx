
import React, { useState, useEffect } from 'react';

const FULL_CODE = `// MiCorazon.js - v1.0
// Entorno de ejecución: Realidad Aumentada por el Amor

const Mariví = {
  nombre: "El amor de mi vida",
  atributos: ["Luz", "Calma", "Infinita Belleza"],
  sonrisa: () => "Causa de mi felicidad inmediata",
  valor: Infinity
};

function miVida(tuPresencia) {
  if (tuPresencia === true) {
    const sentimientos = new Set(["Amor", "Alegría", "Paz"]);
    // Bucle infinito de devoción
    while (true) {
      console.log(\`Te amo más que ayer... [$\{new Date().toISOString()}]\`);
      // Este proceso es crítico y no puede ser detenido.
    }
  }
  return "Sentido absoluto y total";
}

/*
 * Documentación del Alma:
 *
 * Y así como cada línea de este código es esencial para el programa,
 * tú eres la función principal que ejecuta mi existencia.
 *
 * Te amo tanto como amo crear esto. Porque crearlo, es amarte.
 */
`;

const MyLifeModule: React.FC = () => {
    const [code, setCode] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let currentIndex = 0;
        const typingSpeed = 25;

        const typeChar = () => {
            if (currentIndex < FULL_CODE.length) {
                setCode(prev => prev + FULL_CODE.charAt(currentIndex));
                currentIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                setIsComplete(true);
            }
        };

        const timer = setTimeout(typeChar, 500); // Initial delay

        return () => clearTimeout(timer);
    }, []);

    const highlightSyntax = (text: string) => {
        let highlighted = text;
        // Comments (green)
        highlighted = highlighted.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="text-green-400 opacity-80 italic">$1</span>');
        // Keywords (pink/purple)
        highlighted = highlighted.replace(/\b(const|let|var|function|if|while|return|new)\b/g, '<span class="text-pink-400 font-semibold">$1</span>');
        // Strings (yellow)
        highlighted = highlighted.replace(/(".*?"|`.*?`)/g, '<span class="text-yellow-300">$1</span>');
        // Numbers/Booleans/Infinity (blue)
        highlighted = highlighted.replace(/\b(true|false|\d+|Infinity)\b/g, '<span class="text-cyan-400">$1</span>');
        // Objects/Functions (light blue)
        highlighted = highlighted.replace(/\b(Mariví|miVida|Set|console|Date)\b/g, '<span class="text-sky-300">$1</span>');
        
        return <pre className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlighted }} />;
    };

    return (
        <div className="flex flex-col items-center animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-great-vibes text-[#800020]">Mi Código Fuente</h2>
                <p className="mt-2 text-[#3D3D3D]">La lógica que impulsa mi universo.</p>
            </div>

            <div className="w-full max-w-4xl bg-[#1E1E1E] rounded-xl shadow-2xl border-t-4 border-[#B8860B] font-mono text-sm text-gray-200">
                <div className="flex items-center p-3 bg-gray-700 rounded-t-lg">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="flex-1 text-center text-xs text-gray-400">
                        {isComplete ? 'Proceso Terminado con Éxito' : 'Compilando mi vida...'}
                    </span>
                </div>
                <div className="p-6 overflow-x-auto">
                    {highlightSyntax(code)}
                    {!isComplete && <span className="inline-block w-2 h-4 bg-yellow-300 animate-blink-caret ml-1"></span>}
                </div>
            </div>
        </div>
    );
};

export default MyLifeModule;