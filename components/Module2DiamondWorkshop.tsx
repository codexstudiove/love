
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState } from '../types';

interface WorkshopModuleProps {
    gameState: GameState;
    updateGameState: <K extends keyof GameState>(key: K, value: GameState[K]) => void;
    triggerFireworks: () => void;
}

// Una función pura como esta no tiene por qué estar dentro del componente.
// Sacarla fuera limpia el código y evita recalcularla en cada render.
const getCellSize = () => window.innerWidth < 640 ? 30 : 40;

// Data
const HEART_GRID = [
    [0,1,1,0,1,1,0], [1,2,2,1,2,2,1], [1,2,2,2,2,2,1],
    [1,2,2,2,2,2,1], [0,1,2,2,2,1,0], [0,0,1,2,1,0,0], [0,0,0,1,0,0,0],
];
const COLORS = ["#FFF8E7", "#FADADD", "#800020", "#B8860B"]; // 0: BG, 1: Pink, 2: Red, 3: Gold (outline)

interface Diamond { id: number; x: number; y: number; speed: number; colorIndex: number; }

const WorkshopModule: React.FC<WorkshopModuleProps> = ({ gameState, updateGameState, triggerFireworks }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [placedDiamonds, setPlacedDiamonds] = useState(() => HEART_GRID.map(row => row.map(() => 0)));
    const [totalCells, setTotalCells] = useState(0);
    const [filledCells, setFilledCells] = useState(0);
    const [fallingDiamonds, setFallingDiamonds] = useState<Diamond[]>([]);
    const [heldDiamond, setHeldDiamond] = useState<number | null>(null);
    const animationFrameId = useRef<number>();
    
    const [cellSize, setCellSize] = useState(getCellSize());

    useEffect(() => {
        const handleResize = () => setCellSize(getCellSize());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gridWidth = HEART_GRID[0].length * cellSize;
    const gridHeight = HEART_GRID.length * cellSize;


    const draw = useCallback(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, gridWidth, gridHeight);

        HEART_GRID.forEach((row, y) => row.forEach((cell, x) => {
            if (cell > 0) {
                ctx.strokeStyle = COLORS[3];
                ctx.lineWidth = 0.5;
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                if (placedDiamonds[y][x] > 0) {
                    ctx.fillStyle = COLORS[placedDiamonds[y][x]];
                    ctx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);
                } else {
                    // Draw the number if the diamond is not placed yet
                    ctx.fillStyle = 'rgba(61, 61, 61, 0.4)'; // A subtle dark color for the text
                    ctx.font = `bold ${cellSize / 2.5}px Cormorant Garamond`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(cell.toString(), x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
                }
            }
        }));
        
        fallingDiamonds.forEach(d => {
            ctx.fillStyle = COLORS[d.colorIndex];
            ctx.fillRect(d.x, d.y, cellSize / 4, cellSize / 4); // Simple square for diamonds
        });
    }, [placedDiamonds, fallingDiamonds, cellSize, gridWidth, gridHeight]);

    const gameLoop = useCallback(() => {
        setFallingDiamonds(prev => {
            const newDiamonds = prev.map(d => ({ ...d, y: d.y + d.speed })).filter(d => d.y < gridHeight);
            if (Math.random() < 0.1 && newDiamonds.length < 20 && heldDiamond !== null) {
                newDiamonds.push({
                    id: Date.now(), x: Math.random() * gridWidth, y: -10,
                    speed: Math.random() * 1 + 0.5, colorIndex: heldDiamond
                });
            }
            return newDiamonds;
        });
        draw();
        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [draw, heldDiamond, gridHeight, gridWidth]);
    
    useEffect(() => {
        const cellsToFill = HEART_GRID.flat().filter(c => c > 0).length;
        setTotalCells(cellsToFill);
        if (gameState.diamondPaintingComplete) {
            setPlacedDiamonds(HEART_GRID);
            setFilledCells(cellsToFill);
            setHeldDiamond(null);
        } else {
             animationFrameId.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameState.diamondPaintingComplete, gameLoop]);

    // Redraw canvas when its dimensions change
    useEffect(() => {
        draw();
    }, [draw]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (gameState.diamondPaintingComplete || heldDiamond === null) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
    
        const gridX = Math.floor(clickX / cellSize);
        const gridY = Math.floor(clickY / cellSize);
    
        if (
            gridY >= 0 && gridY < HEART_GRID.length &&
            gridX >= 0 && gridX < HEART_GRID[0].length &&
            HEART_GRID[gridY][gridX] === heldDiamond &&
            placedDiamonds[gridY][gridX] === 0
        ) {
            const newPlaced = placedDiamonds.map((r, rIndex) => 
                rIndex === gridY ? r.map((c, cIndex) => (cIndex === gridX ? heldDiamond : c)) : r
            );
            setPlacedDiamonds(newPlaced);
    
            const newFilledCount = filledCells + 1;
            setFilledCells(newFilledCount);
    
            if (newFilledCount >= totalCells) {
                updateGameState('diamondPaintingComplete', true);
                triggerFireworks();
            }
        }
    };

    const handleReset = () => {
        setPlacedDiamonds(HEART_GRID.map(row => row.map(() => 0)));
        setFilledCells(0);
        setHeldDiamond(null);
        updateGameState('diamondPaintingComplete', false);
    };

    const progress = totalCells > 0 ? (filledCells / totalCells) * 100 : 0;

    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-great-vibes text-[#800020]">El Taller de Diamantes</h2>
                <p className="mt-2 text-[#3D3D3D]">1. Elige un color. 2. Haz clic en la celda con el número correspondiente para colocar el diamante.</p>
            </div>
             <div className="flex justify-center items-center gap-4">
                <p>Color seleccionado:</p>
                <button onClick={() => setHeldDiamond(1)} className={`w-10 h-10 flex items-center justify-center text-xl font-bold text-[#800020] rounded-full border-2 transition-transform ${heldDiamond === 1 ? 'border-yellow-400 scale-125' : 'border-transparent'}`} style={{backgroundColor: COLORS[1]}}>
                    1
                </button>
                <button onClick={() => setHeldDiamond(2)} className={`w-10 h-10 flex items-center justify-center text-xl font-bold text-white rounded-full border-2 transition-transform ${heldDiamond === 2 ? 'border-yellow-400 scale-125' : 'border-transparent'}`} style={{backgroundColor: COLORS[2]}}>
                    2
                </button>
            </div>
            <div className="p-4 bg-[#FADADD]/40 backdrop-blur-sm rounded-3xl shadow-lg">
                <canvas ref={canvasRef} width={gridWidth} height={gridHeight} onClick={handleCanvasClick} className="rounded-2xl cursor-pointer"/>
            </div>
            <div className="w-full max-w-md text-center">
                <p className="font-semibold text-[#800020]">Progreso: {Math.round(progress)}%</p>
                <div className="w-full bg-[#FFF8E7] rounded-full h-4 mt-2 border border-[#B8860B]">
                    <div className="bg-gradient-to-r from-[#FADADD] to-[#800020] h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <button
                    onClick={handleReset}
                    className="mt-4 px-4 py-2 bg-transparent border border-[#B8860B] text-[#B8860B] rounded-full hover:bg-[#B8860B]/10 transition-colors text-sm"
                >
                    Reiniciar Taller
                </button>
            </div>
            {gameState.diamondPaintingComplete && (
                <div className="text-center p-6 bg-[#FFF8E7] rounded-3xl shadow-inner animate-fade-in-up">
                    <p className="font-la-belle text-3xl text-[#B8860B]">"Contigo, cada pieza encaja perfectamente."</p>
                </div>
            )}
        </div>
    );
};

export default WorkshopModule;
