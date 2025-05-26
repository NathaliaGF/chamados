import React, { useState } from 'react';
import { Note } from '../types';
import { PlusIcon, TrashIcon, XMarkIcon, CalendarDaysIcon } from './icons';
import ConfirmationModal from './ConfirmationModal'; // Import ConfirmationModal

interface NotepadProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (note: Note) => void;
}

const NoteFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<Note, 'id' | 'createdAt'>) => void;
  existingNote?: Note | null;
}> = ({ isOpen, onClose, onSave, existingNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setTitle(existingNote?.title || '');
      setContent(existingNote?.content || '');
      setError('');
    }
  }, [isOpen, existingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError('O título ou o conteúdo da nota não pode estar vazio.');
      return;
    }
    onSave({ title, content });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-sky-400">{existingNote ? 'Editar Nota' : 'Nova Nota'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><XMarkIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="note-title" className="block text-sm font-medium text-slate-300 mb-1">Título</label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Título da nota"
            />
          </div>
          <div>
            <label htmlFor="note-content" className="block text-sm font-medium text-slate-300 mb-1">Conteúdo *</label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-sky-500 focus:border-sky-500 custom-scrollbar"
              placeholder="Escreva sua nota aqui..."
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-md flex items-center">
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Salvar Nota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Notepad: React.FC<NotepadProps> = ({ notes, onAddNote, onDeleteNote, onUpdateNote }) => {
  const [isNoteFormModalOpen, setIsNoteFormModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    if (editingNote) {
      onUpdateNote({ ...editingNote, ...noteData });
    } else {
      onAddNote(noteData);
    }
    setEditingNote(null);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsNoteFormModalOpen(true);
  };
  
  const openNewModal = () => {
    setEditingNote(null);
    setIsNoteFormModalOpen(true);
  };

  const handleDeleteRequest = (note: Note) => {
    setNoteToDelete(note);
    setIsDeleteNoteModalOpen(true);
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      onDeleteNote(noteToDelete.id);
      setNoteToDelete(null); // Reset after deletion
    }
    // setIsDeleteNoteModalOpen(false); // Modal will close itself
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-200">Bloco de Notas</h2>
        <button
          onClick={openNewModal}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition-colors duration-150"
          aria-label="Adicionar nova nota"
        >
          <PlusIcon className="mr-2" />
          Nova Nota
        </button>
      </div>

      {notes.length === 0 && (
        <div className="text-center py-10 bg-slate-800/50 rounded-lg">
          <p className="text-slate-400 text-lg">Nenhuma nota encontrada.</p>
          <p className="text-slate-500 text-sm mt-2">Clique em "Nova Nota" para criar sua primeira anotação.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note.id} className="bg-slate-800 p-4 rounded-lg shadow-md flex flex-col hover:shadow-lg transition-shadow">
            <h3 className="text-md font-semibold text-sky-300 mb-1 break-words">{note.title || "Sem Título"}</h3>
            <p className="text-xs text-slate-400 mb-2 flex items-center">
                <CalendarDaysIcon className="w-3 h-3 mr-1.5 text-slate-500" />
                {formatDate(note.createdAt)}
            </p>
            <p className="text-sm text-slate-300 flex-grow mb-3 min-h-[40px] whitespace-pre-wrap break-words max-h-32 overflow-y-auto custom-scrollbar">
                {note.content}
            </p>
            <div className="mt-auto flex justify-end space-x-2 pt-2 border-t border-slate-700/50">
               <button 
                onClick={() => openEditModal(note)}
                className="text-xs text-sky-400 hover:text-sky-300 p-1"
                aria-label={`Editar nota ${note.title || 'Sem Título'}`}
              >
                Editar
              </button>
              <button 
                onClick={() => handleDeleteRequest(note)}
                className="text-xs text-red-400 hover:text-red-300 p-1"
                aria-label={`Excluir nota ${note.title || 'Sem Título'}`}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <NoteFormModal 
        isOpen={isNoteFormModalOpen}
        onClose={() => setIsNoteFormModalOpen(false)}
        onSave={handleSaveNote}
        existingNote={editingNote}
      />

      {isDeleteNoteModalOpen && noteToDelete && (
        <ConfirmationModal
            isOpen={isDeleteNoteModalOpen}
            onClose={() => {
                setIsDeleteNoteModalOpen(false);
                setNoteToDelete(null);
            }}
            onConfirm={confirmDeleteNote}
            title="Confirmar Exclusão de Nota"
            message={
              <>
                Tem certeza que deseja excluir a nota "<strong className="text-sky-400">{noteToDelete.title || 'Sem Título'}</strong>"?
                <br/>
                Esta ação não pode ser desfeita.
              </>
            }
            confirmButtonText="Excluir Nota"
        />
      )}
    </div>
  );
};

export default Notepad;
