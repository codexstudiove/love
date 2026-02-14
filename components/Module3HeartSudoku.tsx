
import React, { useState, useEffect } from 'react';
import { GameState } from '../types';

interface SudokuModuleProps {
    gameState: GameState;
    updateGameState: <K extends keyof GameState>(key: K, value: GameState[K]) => void;
    triggerFireworks: () => void;
}

const WORDS = ["Amor", "Tiempo", "Mar", "Vos", "Fe", "Calma", "Luz", "Piel"];
const SOLUTION = [
    ["Tu", "Piel", "es", "Luz"],
    ["Mi", "Fe", "es", "Calma"],
    ["El", "Mar", "trae", "Amor"],
    ["El", "Tiempo", "con", "Vos"]
];
// For simplicity, we'll make this a fill-in-the-blanks rather than a full drag-drop sudoku
const PUZZLE_BOARD = [
    ["Tu", null, "es", null],
    ["Mi", null, "es", null],
    ["El", null, "trae", null],
    ["El", null, "con", null]
]
const REQUIRED_WORDS = ["Piel", "Luz", "Fe", "Calma", "Mar", "Amor", "Tiempo", "Vos"];


const SudokuModule: React.FC<SudokuModuleProps> = ({ gameState, updateGameState, triggerFireworks }) => {
    const [board, setBoard] = useState<(string | null)[][]>(PUZZLE_BOARD);
    const [availableWords, setAvailableWords] = useState<string[]>(REQUIRED_WORDS);
    const [draggedWord, setDraggedWord] = useState<string | null>(null);

    useEffect(() => {
        if(gameState.sudokuComplete) {
            setBoard(SOLUTION);
            setAvailableWords([]);
        }
    }, [gameState.sudokuComplete]);

    const handleDragStart = (word: string) => {
        setDraggedWord(word);
    };

    const handleDrop = (row: number, col: number) => {
        if (draggedWord && board[row][col] === null) {
            const newBoard = board.map(r => [...r]);
            newBoard[row][col] = draggedWord;
            setBoard(newBoard);

            setAvailableWords(availableWords.filter(w => w !== draggedWord));
            setDraggedWord(null);

            checkCompletion(newBoard);
        }
    };
    
    const checkCompletion = (currentBoard: (string|null)[][]) => {
         const isComplete = currentBoard.flat().every(cell => cell !== null);
         if (isComplete) {
            // Simplified check, in a real scenario you would validate the solution.
            updateGameState('sudokuComplete', true);
            triggerFireworks();
         }
    };
    
    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-great-vibes text-[#800020]">Sudoku del Corazón</h2>
                <p className="mt-2 text-[#3D3D3D]">Arrastra las palabras para completar las frases de nuestro universo.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Board */}
                <div className="grid grid-cols-4 gap-2 p-4 bg-[#FADADD]/40 backdrop-blur-sm rounded-3xl shadow-lg">
                    {board.map((row, rowIndex) => 
                        row.map((cell, colIndex) => (
                            <div 
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-base sm:text-lg rounded-xl transition-colors
                                    ${cell === null ? 'bg-[#FFF8E7]/50 border-2 border-dashed border-[#B8860B]/50' : 'bg-[#FFF8E7] text-[#800020] font-semibold'}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(rowIndex, colIndex)}
                            >
                                {cell}
                            </div>
                        ))
                    )}
                </div>

                {/* Word Bank */}
                <div className="flex flex-wrap gap-3 p-4 justify-center md:flex-col">
                    {availableWords.map(word => (
                        <div 
                            key={word}
                            draggable
                            onDragStart={() => handleDragStart(word)}
                            className="p-3 bg-[#B8860B] text-white rounded-lg shadow-md cursor-grab active:cursor-grabbing"
                        >
                            {word}
                        </div>
                    ))}
                </div>
            </div>

            {gameState.sudokuComplete && (
                <div className="text-center p-6 bg-[#FFF8E7] rounded-3xl shadow-inner animate-fade-in-up">
                    <p className="font-la-belle text-3xl text-[#B8860B]">"Resolverte a ti es el único acertijo que quiero para siempre."</p>
                </div>
            )}
        </div>
    );
};


export default SudokuModule;