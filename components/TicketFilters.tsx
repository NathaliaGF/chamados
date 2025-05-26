import React from 'react';
import { TicketStatus } from '../types';
import { ALL_STATUSES_FILTER, STATUS_STYLES } from '../constants';

interface TicketFiltersProps {
  currentFilter: string;
  onFilterChange: (status: string) => void;
  statusCounts: Record<string, number>; // These counts should be for open tickets
}

const TicketFilters: React.FC<TicketFiltersProps> = ({ currentFilter, onFilterChange, statusCounts }) => {
  // Filter options should only include open statuses and "Todos"
  const openTicketStatuses = Object.values(TicketStatus).filter(status => status !== TicketStatus.ENCERRADO);
  const filterOptions = [ALL_STATUSES_FILTER, ...openTicketStatuses];

  return (
    <div className="mb-6 p-4 bg-slate-800/70 backdrop-blur-sm rounded-lg shadow">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-slate-300 mr-2">Filtrar por status (abertos):</span>
        {filterOptions.map((status) => {
          const isActive = currentFilter === status;
          // 'total' in statusCounts should refer to total open tickets
          const count = status === ALL_STATUSES_FILTER ? statusCounts.total : statusCounts[status] || 0;
          const style = status !== ALL_STATUSES_FILTER ? STATUS_STYLES[status as TicketStatus] : null;
          
          return (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              aria-pressed={isActive}
              className={`
                px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150
                flex items-center space-x-2
                ${isActive 
                  ? `${style ? style.base : 'bg-sky-600'} text-white shadow-md` 
                  : `bg-slate-700 hover:bg-slate-600 text-slate-300 ${style ? style.hover : ''}`
                }
                ${(count === 0 && status !== ALL_STATUSES_FILTER && !isActive) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={count === 0 && status !== ALL_STATUSES_FILTER && !isActive}
              title={status === ALL_STATUSES_FILTER ? 'Todos os chamados abertos' : status}
            >
              {style && status !== ALL_STATUSES_FILTER && (
                <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></span>
              )}
              <span className="truncate max-w-[100px] sm:max-w-none">
                {status === ALL_STATUSES_FILTER ? 'Todos Abertos' : status}
              </span>
              <span 
                className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${isActive ? 'bg-white/20 text-white' : 'bg-slate-600 text-slate-400'}
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TicketFilters;
