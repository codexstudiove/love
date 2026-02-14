
export enum ModuleId {
    GARDEN = 'garden',
    WORKSHOP = 'workshop',
    SUDOKU = 'sudoku',
    TESTAMENT = 'testament',
    CONSTELLATION = 'constellation',
    MINIGAMES = 'minigames',
    MY_LIFE = 'mylife',
}

export interface GameState {
    diamondPaintingComplete: boolean;
    sudokuComplete: boolean;
    testamentUnlockedTime: number | null;
    constellationsComplete: boolean[];
    minigamePoints: number;
    unlockedRewards: string[];
}
