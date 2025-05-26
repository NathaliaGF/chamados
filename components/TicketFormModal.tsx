import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { XMarkIcon, PlusIcon, PencilIcon } from './icons';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTicket: (ticket: Ticket, isEditing: boolean) => void;
  ticketToEdit?: Ticket | null;
}

// Reusable InputField, SelectField, TextareaField components (unchanged from AddTicketModal)
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }> = ({ label, error, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <input 
      {...props}
      className={`w-full p-2.5 bg-slate-700 border ${error ? 'border-red-500' : 'border-slate-600'} rounded-md text-slate-100 focus:ring-sky-500 focus:border-sky-500 transition-colors`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; children: React.ReactNode }> = ({ label, error, children, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <select
      {...props}
      className={`w-full p-2.5 bg-slate-700 border ${error ? 'border-red-500' : 'border-slate-600'} rounded-md text-slate-100 focus:ring-sky-500 focus:border-sky-500 transition-colors appearance-none bg-no-repeat bg-right pr-8`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' class='w-5 h-5'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd' /%3E%3C/svg%3E")`, backgroundSize: '1.25em', backgroundPosition: 'right 0.75rem center' }}
    >
      {children}
    </select>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }> = ({ label, error, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <textarea
      {...props}
      rows={4}
      className={`w-full p-2.5 bg-slate-700 border ${error ? 'border-red-500' : 'border-slate-600'} rounded-md text-slate-100 focus:ring-sky-500 focus:border-sky-500 transition-colors custom-scrollbar`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);


const TicketFormModal: React.FC<TicketFormModalProps> = ({ isOpen, onClose, onSaveTicket, ticketToEdit }) => {
  const [id, setId] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus>(TicketStatus.ANALISE);
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIA);
  const [openingDate, setOpeningDate] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Ticket, 'openingDate' | 'closingDate'> | 'openingDateStr' | 'closingDateStr', string>>>({});
  
  const isEditing = !!ticketToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditing && ticketToEdit) {
        setId(ticketToEdit.id);
        setClient(ticketToEdit.client);
        setDescription(ticketToEdit.description);
        setStatus(ticketToEdit.status);
        setPriority(ticketToEdit.priority);
        setOpeningDate(new Date(ticketToEdit.openingDate).toISOString().split('T')[0]);
        setClosingDate(ticketToEdit.closingDate ? new Date(ticketToEdit.closingDate).toISOString().split('T')[0] : '');
      } else {
        // Reset form for adding new ticket
        setId(`CHM-${String(Date.now()).slice(-4)}`); // Simple unique ID suggestion
        setClient('');
        setDescription('');
        setStatus(TicketStatus.ANALISE);
        setPriority(TicketPriority.MEDIA);
        setOpeningDate(new Date().toISOString().split('T')[0]);
        setClosingDate('');
      }
      setErrors({});
    }
  }, [isOpen, ticketToEdit, isEditing]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!id.trim()) newErrors.id = "Número do chamado é obrigatório.";
    // Add more validation if ID can be edited, or make it read-only for edit mode
    if (isEditing && id.trim() !== ticketToEdit?.id) {
        // Potentially handle ID changes if allowed, or disallow them
        // For now, let's assume ID change isn't a primary feature for simplicity
    }
    if (!client.trim()) newErrors.client = "Cliente é obrigatório.";
    if (!description.trim()) newErrors.description = "Descrição é obrigatória.";
    if (!openingDate) newErrors.openingDateStr = "Data de abertura é obrigatória.";
    
    const parsedOpeningDate = new Date(openingDate);
    
    if (status === TicketStatus.ENCERRADO && !closingDate) {
      newErrors.closingDateStr = "Data de encerramento é obrigatória para chamados encerrados.";
    }
    if (closingDate) {
        const parsedClosingDate = new Date(closingDate);
        if (parsedClosingDate < parsedOpeningDate) {
            newErrors.closingDateStr = "Data de encerramento não pode ser anterior à data de abertura.";
        }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ticketData: Ticket = {
      id,
      client,
      description,
      status,
      priority,
      openingDate: new Date(new Date(openingDate).toDateString()), // Normalize to remove time part for consistency
      closingDate: status === TicketStatus.ENCERRADO && closingDate ? new Date(new Date(closingDate).toDateString()) : undefined,
    };
    onSaveTicket(ticketData, isEditing);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-form-modal-title"
    >
      <div 
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="ticket-form-modal-title" className="text-xl font-semibold text-sky-400">
            {isEditing ? 'Editar Chamado' : 'Adicionar Novo Chamado'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Fechar modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField 
            label="Número do Chamado *" 
            id="ticket-id" 
            type="text" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            error={errors.id} 
            required 
            readOnly={isEditing} // ID should not be editable for existing tickets
            className={isEditing ? 'bg-slate-700/50 cursor-not-allowed' : 'bg-slate-700'}
          />
          <InputField label="Cliente *" id="ticket-client" type="text" value={client} onChange={(e) => setClient(e.target.value)} error={errors.client} required />
          
          <SelectField label="Status *" id="ticket-status" value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)} error={errors.status} required>
            {Object.values(TicketStatus).map(sVal => (
              <option key={sVal} value={sVal}>{sVal}</option>
            ))}
          </SelectField>

          <SelectField label="Prioridade *" id="ticket-priority" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} error={errors.priority} required>
            {Object.values(TicketPriority).map(pVal => (
              <option key={pVal} value={pVal}>{pVal}</option>
            ))}
          </SelectField>
          
          <InputField label="Data de Abertura *" id="ticket-openingDate" type="date" value={openingDate} onChange={(e) => setOpeningDate(e.target.value)} error={errors.openingDateStr} required />
          
          {status === TicketStatus.ENCERRADO && (
            <InputField label="Data de Encerramento *" id="ticket-closingDate" type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} error={errors.closingDateStr} required={status === TicketStatus.ENCERRADO} />
          )}
          
          <TextareaField label="Descrição *" id="ticket-description" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} required />

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-md flex items-center transition-colors shadow-md"
            >
              {isEditing ? <PencilIcon className="w-4 h-4 mr-1.5" /> : <PlusIcon className="w-4 h-4 mr-1.5" />}
              {isEditing ? 'Salvar Alterações' : 'Adicionar Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketFormModal;