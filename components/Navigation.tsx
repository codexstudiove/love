
import React from 'react';
import { ModuleId } from '../types';

interface NavigationProps {
    activeModule: ModuleId;
    setActiveModule: (module: ModuleId) => void;
}

const NavButton: React.FC<{
    moduleId: ModuleId;
    activeModule: ModuleId;
    setActiveModule: (module: ModuleId) => void;
    icon: string;
    label: string;
}> = ({ moduleId, activeModule, setActiveModule, icon, label }) => {
    const isActive = activeModule === moduleId;
    return (
        <button
            onClick={() => setActiveModule(moduleId)}
            className={`flex flex-col items-center justify-center space-y-2 p-3 rounded-2xl transition-all duration-300 w-24 h-24 md:w-28 md:h-28 ${
                isActive 
                ? 'bg-[#FADADD]/80 backdrop-blur-md shadow-lg scale-110' 
                : 'bg-[#FFF8E7]/50 hover:bg-[#FADADD]/70'
            }`}
            aria-label={`Ir a ${label}`}
        >
            <span className={`fa-solid ${icon} text-2xl md:text-3xl ${isActive ? 'text-[#800020]' : 'text-[#B8860B]'}`}></span>
            <span className={`text-xs md:text-sm font-semibold ${isActive ? 'text-[#800020]' : 'text-[#B8860B]'}`}>{label}</span>
        </button>
    );
};


const Navigation: React.FC<NavigationProps> = ({ activeModule, setActiveModule }) => {
    return (
        <nav className="flex items-center justify-center flex-wrap gap-2 md:space-x-2 py-4">
            <NavButton moduleId={ModuleId.GARDEN} activeModule={activeModule} setActiveModule={setActiveModule} icon="fa-book-open" label="Recuerdos" />
            <NavButton moduleId={ModuleId.WORKSHOP} activeModule={activeModule} setActiveModule={setActiveModule} icon="fa-gem" label="Taller" />
            <NavButton moduleId={ModuleId.MINIGAMES} activeModule={activeModule} setActiveModule={setActiveModule} icon="fa-gamepad" label="Minijuegos" />
            <NavButton moduleId={ModuleId.SUDOKU} activeModule={activeModule} setActiveModule={setActiveModule} icon="fa-puzzle-piece" label="Acertijo" />
            <NavButton moduleId={ModuleId.CONSTELLATION} activeModule={activeModule} setActiveModule={setActiveModule} icon="fa-star" label="Observatorio" />
            <NavButton moduleId={ModuleId.MY_LIFE} activeModule={activeModule} setActiveModule={setActiveModule} icon="fa-heart-pulse" label="Mi Vida" />
            <NavButton moduleId={ModuleId.TESTAMENT} activeModule={activeModule} setActiveModule={setActiveModule} icon="fa-scroll" label="Legado" />
        </nav>
    );
};

export default Navigation;
