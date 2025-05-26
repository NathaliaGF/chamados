export enum TicketStatus {
  ANALISE = 'Análise', // Verde
  MONITORACAO = 'Monitoração', // Amarelo
  PENDENTE = 'Pendente', // Laranja
  ENCERRADO = 'Encerrado', // Vermelho
}

export enum TicketPriority {
  BAIXA = 'Baixa',
  MEDIA = 'Média',
  ALTA = 'Alta',
  URGENTE = 'Urgente',
}

export interface Ticket {
  id: string; // Número do Chamado
  client: string; // Cliente
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  openingDate: Date; // Data de Abertura
  closingDate?: Date; // Data de Encerramento (only if status is ENCERRADO)
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string; // Name is now required
  email: string;
  password?: string; // Password for local auth (not secure for production)
  picture?: string | null; // Keep for potential future use, but not set by local auth
}