
import React from 'react';
import { User } from '../types'; // Import User type
import { UserCircleIcon } from './icons'; // Assuming UserCircleIcon is appropriate

interface HeaderProps {
  currentUser?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-md shadow-lg p-3 sm:p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-sky-400">Visualizador de Chamados</h1>
        {currentUser && (
          <div className="flex items-center space-x-3">
            {currentUser.picture ? (
              <img src={currentUser.picture} alt={currentUser.name || 'User Avatar'} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-slate-400" />
            )}
            <span className="text-sm text-slate-300 hidden sm:inline">{currentUser.name || currentUser.email}</span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-sky-400 hover:text-sky-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;