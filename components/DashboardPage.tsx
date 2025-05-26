import React, { useState, useMemo, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { STATUS_STYLES, PRIORITY_STYLES } from '../constants';
import { ChartPieIcon, UsersIcon, ClockIcon, CheckCircleIcon, ListBulletIcon, TicketIcon, PriorityIcon as PriorityLevelIcon } from './icons';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DashboardPageProps {
  tickets: Ticket[];
}

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  colorClass?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon, description, colorClass = "bg-slate-800" }) => (
  <div className={`p-5 rounded-xl shadow-lg ${colorClass} flex flex-col h-full`}>
    <div className="flex items-center text-slate-400 mb-2">
      {icon}
      <h3 className="ml-2 text-sm font-medium uppercase tracking-wider">{title}</h3>
    </div>
    <p className="text-3xl font-semibold text-sky-400 mb-1">{value}</p>
    {description && <p className="text-xs text-slate-500 mt-auto pt-1">{description}</p>}
  </div>
);

// Componente Wrapper para itens arrastáveis
const DraggableDashboardCard: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.7 : 1, // Slightly more opacity change
    boxShadow: isDragging ? '0 10px 25px -5px rgba(56, 189, 248, 0.4), 0 8px 10px -6px rgba(56, 189, 248, 0.4)' : undefined,
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
    height: '100%', 
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      {children}
    </div>
  );
};


const DashboardPage: React.FC<DashboardPageProps> = ({ tickets }) => {
  
  const initialInfoCardOrder = useMemo(() => [
    'closedToday', 'avgClosingTime', 'totalOpen', 
    'clientMonth', 'clientWeek', 'totalTickets'
  ], []);

  const initialDistributionCardOrder = useMemo(() => [
    'statusDistribution', 'priorityDistribution'
  ], []);
  
  const [infoCardIds, setInfoCardIds] = useState<string[]>(initialInfoCardOrder);
  const [distributionCardIds, setDistributionCardIds] = useState<string[]>(initialDistributionCardOrder);
   
  // Persist card order
  const currentUserEmail = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).email : 'default';
  const INFO_CARD_ORDER_KEY = `dashboard_infoCardOrder_${currentUserEmail}`;
  const DIST_CARD_ORDER_KEY = `dashboard_distCardOrder_${currentUserEmail}`;

  useEffect(() => {
    const savedInfoOrder = localStorage.getItem(INFO_CARD_ORDER_KEY);
    if (savedInfoOrder) {
        try {
            const parsedOrder = JSON.parse(savedInfoOrder);
            // Validate that all initial IDs are present to prevent errors if items change
            if (initialInfoCardOrder.every(id => parsedOrder.includes(id)) && parsedOrder.every((id: string) => initialInfoCardOrder.includes(id))) {
                 setInfoCardIds(parsedOrder);
            } else {
                 localStorage.setItem(INFO_CARD_ORDER_KEY, JSON.stringify(initialInfoCardOrder)); // Reset if invalid
            }
        } catch (e) {
            console.error("Failed to parse saved info card order", e);
            localStorage.setItem(INFO_CARD_ORDER_KEY, JSON.stringify(initialInfoCardOrder));
        }
    }

    const savedDistOrder = localStorage.getItem(DIST_CARD_ORDER_KEY);
    if (savedDistOrder) {
        try {
            const parsedOrder = JSON.parse(savedDistOrder);
             if (initialDistributionCardOrder.every(id => parsedOrder.includes(id)) && parsedOrder.every((id: string) => initialDistributionCardOrder.includes(id))) {
                setDistributionCardIds(parsedOrder);
            } else {
                localStorage.setItem(DIST_CARD_ORDER_KEY, JSON.stringify(initialDistributionCardOrder)); // Reset if invalid
            }
        } catch (e) {
            console.error("Failed to parse saved distribution card order", e);
            localStorage.setItem(DIST_CARD_ORDER_KEY, JSON.stringify(initialDistributionCardOrder));
        }
    }
  }, [initialInfoCardOrder, initialDistributionCardOrder, INFO_CARD_ORDER_KEY, DIST_CARD_ORDER_KEY]);

  useEffect(() => {
    localStorage.setItem(INFO_CARD_ORDER_KEY, JSON.stringify(infoCardIds));
  }, [infoCardIds, INFO_CARD_ORDER_KEY]);

  useEffect(() => {
    localStorage.setItem(DIST_CARD_ORDER_KEY, JSON.stringify(distributionCardIds));
  }, [distributionCardIds, DIST_CARD_ORDER_KEY]);


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Increased distance slightly
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const stats = useMemo(() => {
    if (!tickets) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
    const getStartOfWeek = (date: Date) => {
      const dt = new Date(date);
      const day = dt.getDay();
      const diff = dt.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday being 0
      const startOfWeekDate = new Date(dt.setDate(diff));
      startOfWeekDate.setHours(0,0,0,0);
      return startOfWeekDate;
    };

    const ticketsClosedToday = tickets.filter(ticket => 
      ticket.status === TicketStatus.ENCERRADO &&
      ticket.closingDate &&
      new Date(ticket.closingDate).setHours(0,0,0,0) === today.getTime()
    ).length;

    const statusCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<TicketStatus, number>);

    const priorityCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<TicketPriority, number>);

    const calculateMostFrequent = (items: string[]) => {
      if (items.length === 0) return 'N/A';
      const frequency = items.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
    };

    const startOfMonth = getStartOfMonth(today);
    const clientsThisMonth = tickets.filter(t => new Date(t.openingDate) >= startOfMonth).map(t => t.client);
    const mostFrequentClientMonth = calculateMostFrequent(clientsThisMonth);

    const startOfWeekDate = getStartOfWeek(today);
    const clientsThisWeek = tickets.filter(t => {
        const openingDate = new Date(t.openingDate);
        openingDate.setHours(0,0,0,0);
        return openingDate >= startOfWeekDate;
    }).map(t => t.client);
    const mostFrequentClientWeek = calculateMostFrequent(clientsThisWeek);
    
    const closedTicketsWithDates = tickets.filter(t => t.status === TicketStatus.ENCERRADO && t.openingDate && t.closingDate);
    const averageClosingTime = closedTicketsWithDates.length > 0
      ? closedTicketsWithDates.reduce((sum, ticket) => {
          const open = new Date(ticket.openingDate!).getTime();
          const close = new Date(ticket.closingDate!).getTime();
          return sum + (close - open);
        }, 0) / closedTicketsWithDates.length / (1000 * 60 * 60 * 24)
      : 0;

    const totalOpenTickets = tickets.filter(t => t.status !== TicketStatus.ENCERRADO).length;

    return {
      ticketsClosedToday, statusCounts, priorityCounts, mostFrequentClientMonth,
      mostFrequentClientWeek, averageClosingTime, totalOpenTickets,
      closedTicketsCount: closedTicketsWithDates.length,
      clientsThisMonthCount: clientsThisMonth.length,
      clientsThisWeekCount: clientsThisWeek.length,
    };
  }, [tickets]);


  if (!tickets || !stats) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-400">Carregando dados dos chamados...</p>
      </div>
    );
  }
  
  const { 
    ticketsClosedToday, statusCounts, priorityCounts, mostFrequentClientMonth,
    mostFrequentClientWeek, averageClosingTime, totalOpenTickets,
    closedTicketsCount, clientsThisMonthCount, clientsThisWeekCount
  } = stats;


  const infoCardDefinitions: Record<string, () => React.ReactElement> = {
    closedToday: () => <InfoCard 
        title="Chamados Encerrados Hoje" 
        value={ticketsClosedToday} 
        icon={<CheckCircleIcon className="w-5 h-5 text-green-500"/>}
        description={`Atualizado em ${new Date().toLocaleTimeString('pt-BR')}`}
      />,
    avgClosingTime: () => <InfoCard 
        title="Tempo Médio de Encerramento" 
        value={`${averageClosingTime.toFixed(1)} dias`}
        icon={<ClockIcon className="w-5 h-5 text-yellow-500"/>}
        description={closedTicketsCount > 0 ? `Baseado em ${closedTicketsCount} chamados encerrados` : "Sem dados suficientes"}
      />,
    totalOpen: () => <InfoCard 
        title="Total de Chamados Abertos" 
        value={totalOpenTickets} 
        icon={<ListBulletIcon className="w-5 h-5 text-orange-500"/>}
        description={`${tickets.length - totalOpenTickets} encerrados no total`}
      />,
    clientMonth: () => <InfoCard 
        title="Cliente Mais Atendido (Mês)" 
        value={mostFrequentClientMonth} 
        icon={<UsersIcon className="w-5 h-5 text-blue-500"/>}
        description={clientsThisMonthCount > 0 ? `Baseado em ${clientsThisMonthCount} chamados este mês` : "Sem chamados este mês"}
      />,
    clientWeek: () => <InfoCard 
        title="Cliente Mais Atendido (Semana)" 
        value={mostFrequentClientWeek} 
        icon={<UsersIcon className="w-5 h-5 text-indigo-500"/>}
        description={clientsThisWeekCount > 0 ? `Baseado em ${clientsThisWeekCount} chamados esta semana` : "Sem chamados esta semana"}
      />,
    totalTickets: () => <InfoCard 
        title="Total de Chamados" 
        value={tickets.length} 
        icon={<TicketIcon className="w-5 h-5 text-purple-500"/>}
        description="Todos os chamados registrados"
      />,
  };

  const distributionCardDefinitions: Record<string, () => React.ReactElement> = {
    statusDistribution: () => (
      <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-full flex flex-col">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <ChartPieIcon className="w-5 h-5 mr-2 text-sky-400" />
          Distribuição por Status
        </h3>
        <div className="space-y-3 flex-grow">
          {Object.values(TicketStatus).map(status => (
            <div key={status} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${STATUS_STYLES[status].dot}`}></span>
                <span className="text-slate-300">{status}</span>
              </div>
              <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[status].base} ${STATUS_STYLES[status].text}`}>
                {statusCounts[status] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    priorityDistribution: () => (
      <div className="bg-slate-800 p-5 rounded-xl shadow-lg h-full flex flex-col">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
          <PriorityLevelIcon level={3} className="w-5 h-5 mr-2 text-sky-400" />
          Distribuição por Prioridade
        </h3>
        <div className="space-y-3 flex-grow">
          {Object.values(TicketPriority).map(priority => (
            <div key={priority} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <PriorityLevelIcon level={
                    priority === TicketPriority.URGENTE ? 3 :
                    priority === TicketPriority.ALTA ? 2 :
                    priority === TicketPriority.MEDIA ? 1 : 0
                } className={`mr-2 ${PRIORITY_STYLES[priority].icon}`} />
                <span className={`${PRIORITY_STYLES[priority].text}`}>{priority}</span>
              </div>
              <span className={`font-medium px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300`}>
                {priorityCounts[priority] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  function handleDragEnd(event: DragEndEvent, type: 'info' | 'distribution') {
    console.log("Drag ended. Event:", event, "Type:", type); // DEBUG LOG
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updateFn = type === 'info' ? setInfoCardIds : setDistributionCardIds;
      
      updateFn((items: string[]) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        
        if (oldIndex === -1 || newIndex === -1) {
          console.warn("DragEnd: Item ID not found in current order. Active:", active.id, "Over:", over.id, "Items:", items);
          return items; // One of the IDs wasn't found, abort reorder
        }
        return arrayMove(items, oldIndex, newIndex);
      });
    } else {
      console.log("DragEnd: No reorder. Over is null or active.id === over.id. Active:", active, "Over:", over);
    }
  }
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-2xl font-semibold text-slate-100">Dashboard de Chamados</h2>
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'info')}>
        <SortableContext items={infoCardIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {infoCardIds.map(id => (
              <DraggableDashboardCard key={id} id={id}>
                {infoCardDefinitions[id] ? infoCardDefinitions[id]() : <div>Card {id} not found</div>}
              </DraggableDashboardCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'distribution')}>
        <SortableContext items={distributionCardIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {distributionCardIds.map(id => (
               <DraggableDashboardCard key={id} id={id}>
                {distributionCardDefinitions[id] ? distributionCardDefinitions[id]() : <div>Card {id} not found</div>}
              </DraggableDashboardCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DashboardPage;
