
import React, { useState, useEffect, useCallback } from 'react';

interface MinesweeperGameProps {
    onGameComplete: () => void;
}

const GRID_SIZE = 10;
const MINE_COUNT = 15;

type CellState = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
};

const MinesweeperGame: React.FC<MinesweeperGameProps> = ({ onGameComplete }) => {
    const [board, setBoard] = useState<CellState[][]>([]);
    const [gameState, setGameState] = useState<'new' | 'playing' | 'won' | 'lost'>('new');
    const [isFlaggingMode, setIsFlaggingMode] = useState(false);

    const createEmptyBoard = useCallback((): CellState[][] => {
        return Array(GRID_SIZE).fill(null).map(() => 
            Array(GRID_SIZE).fill(null).map(() => ({
                isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0
            }))
        );
    }, []);

    const generateBoard = useCallback((startRow: number, startCol: number): CellState[][] => {
        const newBoard = createEmptyBoard();
        
        const allCoords = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                allCoords.push({r, c});
            }
        }

        const safeZone = new Set();
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                safeZone.add(`${startRow + dr}-${startCol + dc}`);
            }
        }

        const mineableCoords = allCoords.filter(coord => !safeZone.has(`${coord.r}-${coord.c}`));
        
        mineableCoords.sort(() => Math.random() - 0.5);
        const mineCoords = mineableCoords.slice(0, MINE_COUNT);
        
        mineCoords.forEach(({r, c}) => {
            newBoard[r][c].isMine = true;
        });

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (newBoard[r][c].isMine) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newBoard[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
                newBoard[r][c].adjacentMines = count;
            }
        }
        return newBoard;
    }, [createEmptyBoard]);

    const resetGame = useCallback(() => {
        setBoard(createEmptyBoard());
        setGameState('new');
        setIsFlaggingMode(false);
    }, [createEmptyBoard]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    const revealCell = (r: number, c: number, currentBoard: CellState[][]): CellState[][] => {
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE || currentBoard[r][c].isRevealed || currentBoard[r][c].isFlagged) {
            return currentBoard;
        }
        let newBoard = currentBoard.map(row => row.map(cell => ({...cell})));
        newBoard[r][c].isRevealed = true;
        if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                     newBoard = revealCell(r + dr, c + dc, newBoard);
                }
            }
        }
        return newBoard;
    };

    const checkWinCondition = (currentBoard: CellState[][]) => {
        const nonMineCells = currentBoard.flat().filter(cell => !cell.isMine);
        if (nonMineCells.length > 0 && nonMineCells.every(cell => cell.isRevealed)) {
            setGameState('won');
            setTimeout(() => onGameComplete(), 2000);
        }
    };

    const handleCellClick = (r: number, c: number) => {
        if (gameState === 'won' || gameState === 'lost') return;
        
        let currentBoard = board;

        if (gameState === 'new' && !isFlaggingMode) {
            currentBoard = generateBoard(r, c);
            setGameState('playing');
        }

        if (isFlaggingMode) {
            if (currentBoard[r][c].isRevealed) return;
            const newBoard = currentBoard.map((row, rowIndex) => rowIndex === r ? row.map((cell, colIndex) => colIndex === c ? { ...cell, isFlagged: !cell.isFlagged } : cell) : row);
            setBoard(newBoard);
            return;
        }

        if (currentBoard[r][c].isRevealed || currentBoard[r][c].isFlagged) return;

        if (currentBoard[r][c].isMine) {
            setGameState('lost');
            const finalBoard = currentBoard.map(row => row.map(cell => ({ ...cell, isRevealed: true })));
            setBoard(finalBoard);
            return;
        }

        const newBoard = revealCell(r, c, currentBoard);
        setBoard(newBoard);
        checkWinCondition(newBoard);
    };

    const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (gameState === 'won' || gameState === 'lost' || (board.length > 0 && board[r][c].isRevealed)) return;
        const newBoard = board.map((row, rowIndex) => rowIndex === r ? row.map((cell, colIndex) => colIndex === c ? { ...cell, isFlagged: !cell.isFlagged } : cell) : row);
        setBoard(newBoard);
    };
    
    const getCellContent = (cell: CellState) => {
        if (cell.isFlagged) return <span className="fa-solid fa-flag text-[#800020]"></span>;
        if (!cell.isRevealed) return null;
        if (cell.isMine) return <span className="fa-solid fa-bomb text-black"></span>;
        if (cell.adjacentMines > 0) return <span style={{color: `hsl(${240 - cell.adjacentMines*30}, 100%, 35%)`}}>{cell.adjacentMines}</span>;
        return null;
    };

    return (
        <div className="flex flex-col items-center relative">
             <div className="flex items-center gap-4 mb-4">
                <button 
                    onClick={() => setIsFlaggingMode(prev => !prev)}
                    className={`px-4 py-2 rounded-full text-xl transition-colors border-2 ${isFlaggingMode ? 'bg-[#FADADD] border-[#800020]' : 'bg-transparent border-gray-300'}`}
                    aria-label="Activar modo bandera"
                >
                    🚩
                </button>
                {(gameState === 'won' || gameState === 'lost') && (
                     <button onClick={resetGame} className="px-4 py-2 text-sm bg-transparent border border-[#B8860B] text-[#B8860B] rounded-full">
                        Jugar otra vez
                    </button>
                )}
             </div>
             <div className={`grid grid-cols-10 gap-0 p-2 bg-[#FADADD]/40 backdrop-blur-sm rounded-lg shadow-lg ${gameState === 'won' ? 'animate-tada' : ''}`}>
                {board.length > 0 && board.map((row, rowIndex) => row.map((cell, colIndex) => (
                    <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                        disabled={gameState === 'won' || (gameState === 'lost' && !cell.isMine)}
                        className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center font-bold text-base sm:text-lg rounded-sm border border-[#B8860B]/20 transition-colors
                            ${(cell.isRevealed) ? 'bg-[#FFF8E7]' : 'bg-[#FADADD] hover:bg-opacity-70'}
                            ${(cell.isMine && cell.isRevealed) ? '!bg-red-400' : ''}
                            `}
                    >
                        {getCellContent(cell)}
                    </button>
                )))}
            </div>
             {(gameState === 'won' || gameState === 'lost') && (
                <div className="mt-4 text-center p-4 bg-[#FFF8E7] rounded-xl shadow-lg animate-fade-in">
                    <p className="text-2xl font-great-vibes text-[#800020]">
                        {gameState === 'won' ? '¡Has despejado el campo!' : '¡Ups! Inténtalo de nuevo :)'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MinesweeperGame;
