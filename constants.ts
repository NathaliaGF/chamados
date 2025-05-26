import { Ticket, TicketStatus, TicketPriority } from './types';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'CHM-001',
    client: 'Empresa Alpha',
    description: 'Usuários não conseguem logar com credenciais válidas. Investigar urgentemente.',
    status: TicketStatus.ANALISE,
    priority: TicketPriority.URGENTE,
    openingDate: new Date('2024-07-28T09:00:00Z'),
  },
  {
    id: 'CHM-002',
    client: 'Soluções Beta',
    description: 'Adicionar botão para exportar dados da tabela de usuários para CSV.',
    status: TicketStatus.MONITORACAO,
    priority: TicketPriority.ALTA,
    openingDate: new Date('2024-07-27T14:00:00Z'),
  },
  {
    id: 'CHM-003',
    client: 'Consultoria Gamma',
    description: 'Revisar e atualizar a documentação dos endpoints da API v2.',
    status: TicketStatus.PENDENTE,
    priority: TicketPriority.MEDIA,
    openingDate: new Date('2024-07-25T10:30:00Z'),
  },
  {
    id: 'CHM-005',
    client: 'Serviços Delta',
    description: 'Configurar novo ambiente de staging para testes da próxima release.',
    status: TicketStatus.ENCERRADO,
    priority: TicketPriority.MEDIA,
    openingDate: new Date('2024-07-15T11:00:00Z'),
    closingDate: new Date('2024-07-20T17:00:00Z'),
  },
];

export const STATUS_STYLES: Record<TicketStatus, { base: string; hover: string; text: string; dot: string }> = {
  [TicketStatus.ANALISE]: { base: 'bg-green-500/20 border-green-500/30', hover: 'hover:bg-green-500/30', text: 'text-green-400', dot: 'bg-green-500' },
  [TicketStatus.MONITORACAO]: { base: 'bg-yellow-500/20 border-yellow-500/30', hover: 'hover:bg-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-500' },
  [TicketStatus.PENDENTE]: { base: 'bg-orange-500/20 border-orange-500/30', hover: 'hover:bg-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' },
  [TicketStatus.ENCERRADO]: { base: 'bg-red-500/20 border-red-500/30', hover: 'hover:bg-red-500/30', text: 'text-red-400', dot: 'bg-red-500' },
};

export const PRIORITY_STYLES: Record<TicketPriority, { icon: string; text: string }> = {
  [TicketPriority.BAIXA]: { icon: 'text-emerald-500', text: 'text-emerald-400' },
  [TicketPriority.MEDIA]: { icon: 'text-yellow-500', text: 'text-yellow-400' }, // Note: Monitoracao status also uses yellow, consider distinct shades if needed
  [TicketPriority.ALTA]: { icon: 'text-orange-500', text: 'text-orange-400' }, // Note: Pendente status also uses orange
  [TicketPriority.URGENTE]: { icon: 'text-red-500', text: 'text-red-400' }, // Note: Encerrado status also uses red
};

export const ALL_STATUSES_FILTER = 'Todos';
