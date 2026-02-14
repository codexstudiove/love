
import React, { useState } from 'react';

interface SudokuGameProps {
    onGameComplete: () => void;
}

const puzzle = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
];

const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

const SudokuGame: React.FC<SudokuGameProps> = ({ onGameComplete }) => {
    const [board, setBoard] = useState<(number | null)[][]>(JSON.parse(JSON.stringify(puzzle)));
    const [isWrong, setIsWrong] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [wrongCells, setWrongCells] = useState<[number, number][]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
        if (isWon) return;
        const value = e.target.value;
        if (wrongCells.length > 0) {
            setWrongCells([]);
        }

        if (/^[1-9]?$/.test(value)) {
            const newBoard = board.map(r => [...r]);
            newBoard[row][col] = value === '' ? null : parseInt(value, 10);
            setBoard(newBoard);
        }
    };
    
    const checkSolution = () => {
        if (isWon) return;
        setWrongCells([]);

        if (JSON.stringify(board) === JSON.stringify(solution)) {
            setIsWon(true);
            setTimeout(() => onGameComplete(), 2000);
        } else {
            const errors: [number, number][] = [];
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (puzzle[r][c] === null && board[r][c] !== solution[r][c]) {
                        errors.push([r, c]);
                    }
                }
            }
            setWrongCells(errors);
            setIsWrong(true);
            setTimeout(() => {
                setIsWrong(false);
                setWrongCells([]);
            }, 1500);
        }
    };

    const getCellClasses = (rowIndex: number, colIndex: number): string => {
        const classes = [
            'w-8 h-8 sm:w-10 sm:h-10', 'text-center', 'text-lg sm:text-xl', 'font-bold', 'transition-colors', 'duration-300',
            'focus:outline-none', 'focus:ring-2', 'focus:ring-[#800020]', 'z-10', 'relative', 'box-border', 'border', 'border-transparent'
        ];
        
        if (puzzle[rowIndex][colIndex] !== null) {
            classes.push('bg-[#FFF8E7]/60 text-[#800020]');
        } else {
            classes.push('bg-white text-[#3D3D3D]');
        }

        if ((colIndex + 1) % 3 === 0 && colIndex < 8) classes.push('border-r-[#B8860B]');
        if ((rowIndex + 1) % 3 === 0 && rowIndex < 8) classes.push('border-b-[#B8860B]');
        
        if (wrongCells.some(([r, c]) => r === rowIndex && c === colIndex)) {
            classes.push('!bg-rose-400 text-white');
        }

        return classes.join(' ');
    };

    return (
        <div className={`flex flex-col items-center ${isWrong ? 'animate-shake' : ''}`}>
             <div className={`grid grid-cols-9 bg-[#B8860B] border-2 border-[#B8860B] gap-px rounded-lg shadow-lg overflow-hidden p-px ${isWon ? 'animate-tada' : ''}`}>
                {board.map((row, rowIndex) => row.map((cell, colIndex) => (
                    <input
                        key={`${rowIndex}-${colIndex}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[1-9]*"
                        maxLength={1}
                        value={cell || ''}
                        onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                        readOnly={puzzle[rowIndex][colIndex] !== null}
                        disabled={isWon}
                        className={getCellClasses(rowIndex, colIndex)}
                    />
                )))}
            </div>
             <button
                onClick={checkSolution}
                disabled={isWon}
                className="mt-6 px-6 py-2 bg-[#B8860B] text-white rounded-full hover:bg-opacity-80 transition-colors disabled:bg-gray-400"
            >
                {isWon ? '¡Resuelto!' : 'Comprobar Solución'}
            </button>
            {isWon && <p className="mt-4 text-xl font-great-vibes text-[#800020]">¡Tu mente es tan brillante como tú!</p>}
        </div>
    );
};

export default SudokuGame;
