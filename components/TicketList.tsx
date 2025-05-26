
import React from 'react';
import { Ticket, TicketStatus } from '../types'; // Added TicketStatus for onStatusChange
import TicketCard from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
  onDeleteRequest: (ticketId: string) => void;
  onEditRequest: (ticket: Ticket) => void; // New prop
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void; // New prop
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onDeleteRequest, onEditRequest, onStatusChange }) => {
  if (tickets.length === 0) {
    return <p className="text-center text-slate-400 py-8">Nenhum chamado encontrado para os filtros selecionados.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard 
          key={ticket.id} 
          ticket={ticket} 
          onDeleteRequest={onDeleteRequest}
          onEditRequest={onEditRequest} // Pass down
          onStatusChange={onStatusChange} // Pass down
        />
      ))}
    </div>
  );
};

export default TicketList;