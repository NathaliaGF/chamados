import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TicketList from './components/TicketList';
import TicketFilters from './components/TicketFilters';
import TicketFormModal from './components/TicketFormModal';
import Notepad from './components/Notepad';
import ConfirmationModal from './components/ConfirmationModal';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { Ticket, TicketStatus, Note, User } from './types';
import { ALL_STATUSES_FILTER } from './constants';
import { PlusIcon, TicketIcon, ClipboardIcon, ChartPieIcon } from './components/icons';
import { sha256 } from 'js-sha256';

type ActiveTab = 'tickets' | 'notepad' | 'dashboards';
type ActiveTicketView = 'open' | 'closed'; // For sub-tabs in Tickets

const APP_USERS_STORAGE_KEY = 'app_users';
const CURRENT_USER_STORAGE_KEY = 'currentUser';
const SALT_SEPARATOR = '::'; 

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('tickets');
  const [activeTicketView, setActiveTicketView] = useState<ActiveTicketView>('open');
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES_FILTER); // Filter for open tickets
  
  const [isTicketFormModalOpen, setIsTicketFormModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isDeleteTicketModalOpen, setIsDeleteTicketModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const getUserSpecificKey = useCallback((baseKey: string) => {
    if (!currentUser) return `${baseKey}_anonymous`;
    return `${baseKey}_${currentUser.email}`;
  }, [currentUser]);

  const createPasswordHash = (password: string, email: string): string => {
    return sha256(password + SALT_SEPARATOR + email.toLowerCase());
  };

  useEffect(() => {
    try {
      const storedAllUsers = localStorage.getItem(APP_USERS_STORAGE_KEY);
      if (storedAllUsers) {
        setAllUsers(JSON.parse(storedAllUsers));
      }

      const storedCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (storedCurrentUser) {
        const user: User = JSON.parse(storedCurrentUser);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage", error);
      localStorage.removeItem(APP_USERS_STORAGE_KEY);
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
    setIsLoading(false); 
  }, []);

  useEffect(() => {
    if (isLoading && !currentUser) return; 
    if (!currentUser && !isLoading) { 
        setTickets([]);
        setNotes([]);
        return;
    }
    if (currentUser && !isLoading) { 
        const initialDataLoad = async () => {
            setIsLoading(true); 
            try {
                const userTicketsKey = getUserSpecificKey('tickets');
                const storedTickets = localStorage.getItem(userTicketsKey);
                setTickets(storedTickets ? JSON.parse(storedTickets).map((t: Ticket) => ({
                    ...t,
                    openingDate: new Date(t.openingDate),
                    closingDate: t.closingDate ? new Date(t.closingDate) : undefined,
                })) : []);

                const userNotesKey = getUserSpecificKey('notes');
                const storedNotes = localStorage.getItem(userNotesKey);
                setNotes(storedNotes ? JSON.parse(storedNotes).map((n: Note) => ({
                    ...n,
                    createdAt: new Date(n.createdAt),
                })) : []);
            } catch (error) {
                console.error("Failed to load user-specific data from localStorage", error);
                localStorage.removeItem(getUserSpecificKey('tickets'));
                localStorage.removeItem(getUserSpecificKey('notes'));
                setTickets([]);
                setNotes([]);
            } finally {
                setIsLoading(false); 
            }
        };
        initialDataLoad();
    }
  }, [currentUser, getUserSpecificKey, isLoading]); // Re-added isLoading to ensure data loads after user check

  useEffect(() => {
    if (!isLoading && currentUser && tickets.length >= 0) { 
      localStorage.setItem(getUserSpecificKey('tickets'), JSON.stringify(tickets));
    }
  }, [tickets, isLoading, currentUser, getUserSpecificKey]);

  useEffect(() => {
    if (!isLoading && currentUser && notes.length >= 0) {
      localStorage.setItem(getUserSpecificKey('notes'), JSON.stringify(notes));
    }
  }, [notes, isLoading, currentUser, getUserSpecificKey]);

  useEffect(() => {
    if(!isLoading) { 
        localStorage.setItem(APP_USERS_STORAGE_KEY, JSON.stringify(allUsers));
    }
  }, [allUsers, isLoading]);


  const handleRegister = async (name: string, email: string, password: string): Promise<boolean> => {
    if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false; 
    }
    const hashedPassword = createPasswordHash(password, email);
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword, 
    };
    setAllUsers(prevUsers => [...prevUsers, newUser]);
    return true;
  };

  const handleLogin = async (email: string, passwordInput: string): Promise<boolean> => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || !user.password) return false;

    const isLikelyHashed = user.password.length === 64 && /^[a-f0-9]+$/.test(user.password);
    let passwordMatch = false;
    const inputPasswordHash = createPasswordHash(passwordInput, email);

    if (isLikelyHashed) {
      passwordMatch = user.password === inputPasswordHash;
    } else {
      passwordMatch = user.password === passwordInput;
      if (passwordMatch) {
        const updatedUser = { ...user, password: inputPasswordHash };
        setAllUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      }
    }
    
    if (passwordMatch) {
      const userToLogin = { ...user };
      delete userToLogin.password; 
      setCurrentUser(userToLogin); 
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToLogin));
      setIsLoading(false); // To trigger data load for the new user
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setTickets([]); 
    setNotes([]);
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleOpenAddTicketModal = () => {
    setEditingTicket(null);
    setIsTicketFormModalOpen(true);
  };

  const handleEditTicketRequest = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsTicketFormModalOpen(true);
  };
  
  const handleSaveTicket = (ticketData: Ticket, isEditing: boolean) => {
    setTickets(prevTickets => {
      const newTickets = isEditing 
        ? prevTickets.map(t => t.id === ticketData.id ? ticketData : t)
        : [ticketData, ...prevTickets];
      return newTickets.sort((a,b) => new Date(b.openingDate).getTime() - new Date(a.openingDate).getTime());
    });
    setEditingTicket(null);
    setIsTicketFormModalOpen(false);
  };

  const handleDeleteTicketRequest = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setIsDeleteTicketModalOpen(true);
  };

  const confirmDeleteTicket = () => {
    if (ticketToDelete) {
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketToDelete));
      setTicketToDelete(null);
    }
  };
  
  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          let closingDate = ticket.closingDate;
          if (newStatus === TicketStatus.ENCERRADO && ticket.status !== TicketStatus.ENCERRADO) {
            closingDate = new Date(); 
          } else if (newStatus !== TicketStatus.ENCERRADO && ticket.status === TicketStatus.ENCERRADO) {
            closingDate = undefined; 
          }
          return { ...ticket, status: newStatus, closingDate };
        }
        return ticket;
      })
    );
  };

  const addNote = (newNote: Omit<Note, 'id' | 'createdAt'>) => {
    setNotes(prevNotes => [{ ...newNote, id: crypto.randomUUID(), createdAt: new Date() }, ...prevNotes].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const deleteNote = (noteId: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  };
  
  const updateNote = (updatedNote: Note) => {
    setNotes(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a,b) => new Date(b.openingDate).getTime() - new Date(a.openingDate).getTime());
  }, [tickets]);

  const openTickets = useMemo(() => sortedTickets.filter(t => t.status !== TicketStatus.ENCERRADO), [sortedTickets]);
  const closedTickets = useMemo(() => sortedTickets.filter(t => t.status === TicketStatus.ENCERRADO), [sortedTickets]);

  const displayedTickets = useMemo(() => {
    if (activeTicketView === 'closed') {
        return closedTickets;
    }
    // activeTicketView === 'open'
    if (statusFilter === ALL_STATUSES_FILTER) { 
        return openTickets;
    }
    return openTickets.filter(ticket => ticket.status === statusFilter);
  }, [activeTicketView, statusFilter, openTickets, closedTickets]);

  const openStatusCounts = useMemo(() => {
    const counts: Record<string, number> = { total: openTickets.length }; // total for filters means total open
    Object.values(TicketStatus).forEach(status => {
      if (status !== TicketStatus.ENCERRADO) {
        counts[status] = openTickets.filter(t => t.status === status).length;
      }
    });
    return counts;
  }, [openTickets]);

  const TabButton: React.FC<{tabName: ActiveTab; currentTab: ActiveTab; onClick: () => void; icon: React.ReactNode; label: string}> = 
    ({tabName, currentTab, onClick, icon, label}) => (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={currentTab === tabName}
      className={`
        flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-sky-500
        ${currentTab === tabName 
          ? 'bg-sky-600 text-white shadow-md' 
          : 'text-slate-300 hover:bg-slate-700'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const SubTabButton: React.FC<{isActive: boolean; onClick: () => void; children: React.ReactNode}> = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      className={`
        px-4 py-2 text-sm font-medium
        ${isActive 
          ? 'border-b-2 border-sky-500 text-sky-400' 
          : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent hover:border-slate-500'
        }
      `}
    >
      {children}
    </button>
  );
  
  const initialLoadingScreen = (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
      <p className="text-slate-300 text-xl mt-4">Carregando Aplicação...</p>
    </div>
  );

  if (isLoading && !currentUser && !localStorage.getItem(CURRENT_USER_STORAGE_KEY)) { 
      return initialLoadingScreen;
  }
  if (isLoading && currentUser === null && !!localStorage.getItem(CURRENT_USER_STORAGE_KEY)) { 
      return initialLoadingScreen;
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }
  
  if (isLoading && currentUser) { 
      return (
        <div className="min-h-screen flex flex-col bg-slate-900">
          <Header currentUser={currentUser} onLogout={handleLogout} />
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-sky-500"></div>
            <p className="text-slate-300 text-lg mt-4">Carregando dados do usuário...</p>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <nav className="bg-slate-800/50 backdrop-blur-md shadow p-3 sticky top-[60px] sm:top-[68px] z-40">
        <div className="container mx-auto flex space-x-2 sm:space-x-3 justify-center sm:justify-start">
          <TabButton tabName="tickets" currentTab={activeTab} onClick={() => setActiveTab('tickets')} icon={<TicketIcon className="w-4 h-4"/>} label="Chamados" />
          <TabButton tabName="notepad" currentTab={activeTab} onClick={() => setActiveTab('notepad')} icon={<ClipboardIcon className="w-4 h-4"/>} label="Bloco de Notas" />
          <TabButton tabName="dashboards" currentTab={activeTab} onClick={() => setActiveTab('dashboards')} icon={<ChartPieIcon className="w-4 h-4"/>} label="Dashboards" />
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'tickets' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-slate-200">Meus Chamados</h2>
              <button
                onClick={handleOpenAddTicketModal}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-150 w-full sm:w-auto justify-center"
                aria-label="Adicionar novo chamado"
              >
                <PlusIcon className="mr-2" />
                Adicionar Chamado
              </button>
            </div>

            <div className="mb-6 flex space-x-1 border-b border-slate-700">
              <SubTabButton isActive={activeTicketView === 'open'} onClick={() => setActiveTicketView('open')}>
                Abertos <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300">{openTickets.length}</span>
              </SubTabButton>
              <SubTabButton isActive={activeTicketView === 'closed'} onClick={() => setActiveTicketView('closed')}>
                Encerrados <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300">{closedTickets.length}</span>
              </SubTabButton>
            </div>

            {activeTicketView === 'open' && (
              <TicketFilters 
                currentFilter={statusFilter} 
                onFilterChange={handleFilterChange}
                statusCounts={openStatusCounts}
              />
            )}
            
            {displayedTickets.length > 0 ? (
                <TicketList 
                    tickets={displayedTickets} 
                    onDeleteRequest={handleDeleteTicketRequest}
                    onEditRequest={handleEditTicketRequest}
                    onStatusChange={handleStatusChange}
                />
            ) : (
                <div className="text-center py-10 bg-slate-800/30 rounded-lg">
                    {activeTicketView === 'open' && (
                        <>
                            <p className="text-slate-400 text-lg">Nenhum chamado aberto encontrado.</p>
                            <p className="text-slate-500 text-sm mt-2">
                                {statusFilter === ALL_STATUSES_FILTER ? 'Clique em "Adicionar Chamado" para começar.' : 'Tente um filtro diferente ou adicione um novo chamado.'}
                            </p>
                        </>
                    )}
                    {activeTicketView === 'closed' && (
                         <p className="text-slate-400 text-lg">Nenhum chamado encerrado ainda.</p>
                    )}
                </div>
            )}
          </>
        )}
        {activeTab === 'notepad' && (
          <Notepad 
            notes={notes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
            onUpdateNote={updateNote}
          />
        )}
        {activeTab === 'dashboards' && (
          <DashboardPage tickets={tickets} />
        )}
      </main>

      {isTicketFormModalOpen && (
        <TicketFormModal
          isOpen={isTicketFormModalOpen}
          onClose={() => {
            setIsTicketFormModalOpen(false);
            setEditingTicket(null);
          }}
          onSaveTicket={handleSaveTicket}
          ticketToEdit={editingTicket}
        />
      )}

      {isDeleteTicketModalOpen && ticketToDelete && (
        <ConfirmationModal
          isOpen={isDeleteTicketModalOpen}
          onClose={() => {
            setIsDeleteTicketModalOpen(false);
            setTicketToDelete(null);
          }}
          onConfirm={confirmDeleteTicket}
          title="Confirmar Exclusão de Chamado"
          message={
            <>
              Tem certeza que deseja excluir o chamado <strong className="text-sky-400">{tickets.find(t => t.id === ticketToDelete)?.id || ticketToDelete}</strong>?
              <br />
              Esta ação não pode ser desfeita.
            </>
          }
          confirmButtonText="Excluir Chamado"
        />
      )}

      <footer className="text-center p-4 text-sm text-slate-500 border-t border-slate-700/50 mt-auto">
        Visualizador de Chamados &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
