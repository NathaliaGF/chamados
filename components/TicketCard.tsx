import React, { useState, useEffect, useRef } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { STATUS_STYLES, PRIORITY_STYLES } from '../constants';
import { CalendarDaysIcon, UserCircleIcon, PriorityIcon, TrashIcon, PencilIcon, ChevronUpDownIcon } from './icons';

interface TicketCardProps {
  ticket: Ticket;
  onDeleteRequest: (ticketId: string) => void;
  onEditRequest: (ticket: Ticket) => void;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onDeleteRequest, onEditRequest, onStatusChange }) => {
  const statusStyle = STATUS_STYLES[ticket.status];
  const priorityStyle = PRIORITY_STYLES[ticket.priority];
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const formatDate = (date?: Date): string => {
    if (!date) return 'N/A';
    const d = new Date(date);
    // Ensure date is treated as local by formatting from parts or ensuring UTC is handled if source is UTC
    // For display, it's generally better to use the date as it was input or convert explicitly
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  const priorityLevel = (): number => {
    switch (ticket.priority) {
      case TicketPriority.BAIXA: return 0;
      case TicketPriority.MEDIA: return 1;
      case TicketPriority.ALTA: return 2;
      case TicketPriority.URGENTE: return 3;
      default: return 0;
    }
  }

  const handleStatusClick = (newStatus: TicketStatus) => {
    onStatusChange(ticket.id, newStatus);
    setIsStatusDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const MAX_DESC_LENGTH = 100;

  return (
    <div 
      className={`
        bg-slate-800 border rounded-lg shadow-md transition-all duration-300 ease-in-out 
        p-4 flex flex-col space-y-3 
        ${statusStyle.base} ${statusStyle.hover}
      `}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-md font-semibold text-slate-100 leading-tight mr-2 break-all">Chamado: {ticket.id}</h3>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsStatusDropdownOpen(prev => !prev)}
            className={`
              px-2.5 py-1 text-xs font-medium rounded-full flex items-center flex-shrink-0
              cursor-pointer transition-colors
              ${statusStyle.base} ${statusStyle.text} hover:brightness-125
            `}
            aria-haspopup="true"
            aria-expanded={isStatusDropdownOpen}
            aria-label={`Status atual: ${ticket.status}. Clique para mudar.`}
          >
            <span className={`w-2 h-2 rounded-full mr-1.5 ${statusStyle.dot}`}></span>
            {ticket.status}
            <ChevronUpDownIcon className="w-3 h-3 ml-1 opacity-70" />
          </button>
          {isStatusDropdownOpen && (
            <div 
              className="absolute right-0 mt-1 w-40 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10 py-1"
              role="menu"
            >
              {Object.values(TicketStatus).map(sVal => (
                <button
                  key={sVal}
                  onClick={() => handleStatusClick(sVal)}
                  className={`
                    w-full text-left px-3 py-1.5 text-xs flex items-center
                    ${sVal === ticket.status ? `${STATUS_STYLES[sVal].text} font-semibold bg-slate-600/50` : 'text-slate-200 hover:bg-slate-600'}
                  `}
                  role="menuitem"
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${STATUS_STYLES[sVal].dot}`}></span>
                  {sVal}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {ticket.client && (
        <div className="flex items-center text-xs text-slate-400">
          <UserCircleIcon className="mr-1.5 text-slate-500 h-4 w-4" />
          Cliente: {ticket.client}
        </div>
      )}
      
      <div className="text-xs text-slate-300 flex-grow min-h-[30px]">
        <p className={`whitespace-pre-wrap break-words overflow-hidden ${isDescriptionExpanded ? '' : 'max-h-[60px]'}`}>
            {ticket.description}
        </p>
        {ticket.description.length > MAX_DESC_LENGTH && (
            <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-sky-400 hover:text-sky-300 text-xs mt-1 focus:outline-none"
            >
                {isDescriptionExpanded ? 'Ver Menos' : 'Ver Mais'}
            </button>
        )}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <div className="flex items-center text-slate-400">
          <PriorityIcon level={priorityLevel()} className={`mr-1.5 ${priorityStyle.icon}`} />
          <span className={priorityStyle.text}>{ticket.priority}</span>
        </div>
        
        <div className="flex flex-col sm:items-end"> {/* This div groups dates and aligns them to the right on sm+ */}
          <div className="flex items-center text-slate-400">
            <CalendarDaysIcon className="mr-1.5 text-slate-500 h-4 w-4" />
            Abertura: {formatDate(ticket.openingDate)}
          </div>
          {ticket.status === TicketStatus.ENCERRADO && ticket.closingDate && (
            <div className="flex items-center text-slate-400 mt-0.5"> {/* mt-0.5 for small gap */}
              <CalendarDaysIcon className="mr-1.5 text-slate-500 h-4 w-4" />
              Encerramento: {formatDate(ticket.closingDate)}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex justify-end items-center pt-2 border-t border-slate-700/50 space-x-2">
          <button
            onClick={() => onEditRequest(ticket)}
            className="text-xs text-sky-400 hover:text-sky-300 p-1 flex items-center"
            aria-label={`Editar chamado ${ticket.id}`}
            title="Editar Chamado"
          >
            <PencilIcon className="w-3.5 h-3.5 mr-1" />
            Editar
          </button>
          <button
            onClick={() => onDeleteRequest(ticket.id)}
            className="text-xs text-red-400 hover:text-red-300 p-1 flex items-center"
            aria-label={`Excluir chamado ${ticket.id}`}
            title="Excluir Chamado"
          >
            <TrashIcon className="w-3.5 h-3.5 mr-1" />
            Excluir
          </button>
        </div>
    </div>
  );
};

export default TicketCard;