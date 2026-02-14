
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState } from '../types';

interface ConstellationModuleProps {
    gameState: GameState;
    updateGameState: <K extends keyof GameState>(key: K, value: GameState[K]) => void;
    triggerFireworks: () => void;
}

const BASE_WIDTH = 800;
const BASE_HEIGHT = 500;

const CONSTELLATIONS = [
    {
        name: "Corazón Eterno",
        message: "Nuestra primera constelación. Un corazón en el cielo para recordarnos que nuestro amor es tan infinito como el universo.",
        stars: [ {x: 400, y: 250}, {x: 300, y: 150}, {x: 200, y: 250}, {x: 400, y: 400}, {x: 600, y: 250}, {x: 500, y: 150} ],
        lines: [ [0,1], [1,2], [2,3], [3,4], [4,5], [5,0] ]
    },
    {
        name: "Nuestras Iniciales",
        message: "Las letras de nuestros nombres, unidas para siempre en el firmamento. Un símbolo de que somos dos almas destinadas a encontrarse.",
        stars: [ {x: 200, y: 150}, {x: 150, y: 250}, {x: 250, y: 250}, {x: 200, y: 350}, {x: 500, y: 150}, {x: 600, y: 250}, {x: 500, y: 350}], // "A" y "M" simplificadas
        lines: [ [0,1], [0,2], [1,3], [2,3], [4,5], [5,6], [4,6] ]
    },
];

const ConstellationModule: React.FC<ConstellationModuleProps> = ({ gameState, updateGameState, triggerFireworks }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeConstellation, setActiveConstellation] = useState(0);
    const [drawnLines, setDrawnLines] = useState<number[][]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{x: number, y: number, index: number} | null>(null);
    const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);
    const [scale, setScale] = useState({ x: 1, y: 1 });
    
    const currentConstellation = CONSTELLATIONS[activeConstellation];
    const isComplete = gameState.constellationsComplete[activeConstellation];

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1a001a'; // Dark sky
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        currentConstellation.stars.forEach((star) => {
            ctx.fillStyle = isComplete ? '#B8860B' : 'white';
            ctx.beginPath();
            ctx.arc(star.x * scale.x, star.y * scale.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw completed lines
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        drawnLines.forEach(([start, end]) => {
            ctx.beginPath();
            ctx.moveTo(currentConstellation.stars[start].x * scale.x, currentConstellation.stars[start].y * scale.y);
            ctx.lineTo(currentConstellation.stars[end].x * scale.x, currentConstellation.stars[end].y * scale.y);
            ctx.stroke();
        });
        
        // Draw line in progress
        if (isDrawing && startPoint && mousePos) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.moveTo(startPoint.x * scale.x, startPoint.y * scale.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }

    }, [currentConstellation, drawnLines, isDrawing, startPoint, mousePos, isComplete, scale]);
    
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && containerRef.current) {
                const canvas = canvasRef.current;
                const container = containerRef.current;
                const { width } = container.getBoundingClientRect();
                const height = width * (BASE_HEIGHT / BASE_WIDTH);
                canvas.width = width;
                canvas.height = height;
                setScale({
                    x: width / BASE_WIDTH,
                    y: height / BASE_HEIGHT,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        handleResize(); // Initial call

        return () => {
             if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);
    
    useEffect(() => {
        draw();
    }, [draw]);

    const getStarAtPos = (x: number, y: number) => {
        for (let loopIndex = 0; loopIndex < currentConstellation.stars.length; loopIndex++) {
            const star = currentConstellation.stars[loopIndex];
            const distance = Math.sqrt(((star.x * scale.x) - x) ** 2 + ((star.y * scale.y) - y) ** 2);
            if (distance < 15) return { ...star, index: loopIndex };
        }
        return null;
    };
    
    const handleMouseDown = (e: React.MouseEvent) => {
        if(isComplete) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const clickedStar = getStarAtPos(e.clientX - rect.left, e.clientY - rect.top);
        if (clickedStar) {
            setIsDrawing(true);
            setStartPoint(clickedStar);
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDrawing || !startPoint) return;
        setIsDrawing(false);
        const rect = canvasRef.current!.getBoundingClientRect();
        const endStar = getStarAtPos(e.clientX - rect.left, e.clientY - rect.top);
        
        if (endStar && endStar.index !== startPoint.index) {
            const requiredLine = currentConstellation.lines.find(line => 
                (line[0] === startPoint.index && line[1] === endStar.index) ||
                (line[1] === startPoint.index && line[0] === endStar.index)
            );
            const lineExists = drawnLines.some(line => 
                 (line[0] === startPoint.index && line[1] === endStar.index) ||
                 (line[1] === startPoint.index && line[0] === endStar.index)
            );
            if (requiredLine && !lineExists) {
                const newLines = [...drawnLines, [startPoint.index, endStar.index]];
                setDrawnLines(newLines);
                
                if (newLines.length === currentConstellation.lines.length) {
                    const newCompletion = [...gameState.constellationsComplete];
                    newCompletion[activeConstellation] = true;
                    updateGameState('constellationsComplete', newCompletion);
                    triggerFireworks();
                }
            }
        }
        setStartPoint(null);
        setMousePos(null);
    };

    const nextConstellation = () => {
         setActiveConstellation(prev => (prev + 1) % CONSTELLATIONS.length);
         setDrawnLines([]);
    }

    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-great-vibes text-[#800020]">El Observatorio de Promesas</h2>
                <p className="mt-2 text-[#3D3D3D]">Dibuja entre las estrellas para revelar los secretos de nuestro cielo.</p>
            </div>
            
            <div ref={containerRef} className="w-full max-w-4xl rounded-2xl cursor-crosshair bg-gray-800">
                <canvas 
                    ref={canvasRef} 
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="w-full h-auto block"
                />
            </div>

            <div className="text-center h-24">
            {isComplete ? (
                <div className="animate-fade-in-up">
                     <h3 className="text-2xl font-great-vibes text-[#B8860B]">{currentConstellation.name}</h3>
                     <p className="max-w-xl">{currentConstellation.message}</p>
                     <button onClick={nextConstellation} className="mt-2 px-4 py-2 bg-[#B8860B] text-white rounded-full">Siguiente Constelación</button>
                </div>
            ) : (
                 <p className="text-gray-500">Haz click en una estrella y arrastra hasta otra para unirlas.</p>
            )}
            </div>
        </div>
    );
};

export default ConstellationModule;