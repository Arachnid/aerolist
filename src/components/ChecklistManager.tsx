import React, { useState, useRef } from 'react';
import { Plus, Download, Upload, Printer } from 'lucide-react';
import { Checklist, ChecklistItem, ChecklistDivider } from '../types';
import { DEFAULT_CHECKLISTS } from '../constants/defaultData';
import { exportChecklists, importChecklists, printChecklists } from '../utils/checklistUtils';
import ChecklistCard from './ChecklistCard';
import PrintView from './PrintView';

const ChecklistManager: React.FC = () => {
  const [checklists, setChecklists] = useState<Checklist[]>(DEFAULT_CHECKLISTS);
  const [editingChecklist, setEditingChecklist] = useState<number | null>(null);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [importedFilename, setImportedFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addChecklist = () => {
    if (newChecklistTitle.trim()) {
      const newChecklist = {
        id: Date.now(),
        title: newChecklistTitle,
        items: []
      };
      setChecklists([...checklists, newChecklist]);
      setNewChecklistTitle('');
    }
  };

  const deleteChecklist = (id: number) => {
    setChecklists(checklists.filter(c => c.id !== id));
  };

  const updateChecklistTitle = (id: number, newTitle: string) => {
    setChecklists(checklists.map(c => 
      c.id === id ? { ...c, title: newTitle } : c
    ));
    setEditingChecklist(null);
  };

  const addItem = (checklistId: number) => {
    setChecklists(checklists.map(c => {
      if (c.id === checklistId) {
        const newItem = {
          id: Date.now(),
          target: "New Item",
          state: "CHECK"
        };
        return { ...c, items: [...c.items, newItem] };
      }
      return c;
    }));
  };

  const addDivider = (checklistId: number) => {
    setChecklists(checklists.map(c => {
      if (c.id === checklistId) {
        const newDivider: ChecklistDivider = {
          id: Date.now(),
          type: 'divider'
        };
        return { ...c, items: [...c.items, newDivider] };
      }
      return c;
    }));
  };

  const updateItem = (checklistId: number, itemId: number, field: keyof ChecklistItem, value: string) => {
    setChecklists(checklists.map(c => {
      if (c.id === checklistId) {
        return {
          ...c,
          items: c.items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      }
      return c;
    }));
  };

  const deleteItem = (checklistId: number, itemId: number) => {
    setChecklists(checklists.map(c => {
      if (c.id === checklistId) {
        return {
          ...c,
          items: c.items.filter(item => item.id !== itemId)
        };
      }
      return c;
    }));
  };

  const reorderItems = (checklistId: number, startIndex: number, endIndex: number) => {
    setChecklists(checklists.map(c => {
      if (c.id === checklistId) {
        const newItems = Array.from(c.items);
        const [removed] = newItems.splice(startIndex, 1);
        newItems.splice(endIndex, 0, removed);
        return { ...c, items: newItems };
      }
      return c;
    }));
  };

  const handleExport = () => {
    exportChecklists(checklists, importedFilename || undefined);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    importChecklists(event, (checklists, filename) => {
      setChecklists(checklists);
      setImportedFilename(filename);
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="max-w-6xl mx-auto no-print">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Aerolist</h1>
        
        <div className="mb-6 flex gap-2 flex-wrap">
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              value={newChecklistTitle}
              onChange={(e) => setNewChecklistTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChecklist()}
              placeholder="New checklist title"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addChecklist}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Checklist
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
            >
              <Download size={20} />
              Export
            </button>
            
            <button
              onClick={handleImportClick}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center gap-2"
            >
              <Upload size={20} />
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            
            <button
              onClick={printChecklists}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
            >
              <Printer size={20} />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {checklists.map((checklist) => (
            <ChecklistCard
              key={checklist.id}
              checklist={checklist}
              onDelete={deleteChecklist}
              onUpdateTitle={updateChecklistTitle}
              onAddItem={addItem}
              onAddDivider={addDivider}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
              editingChecklist={editingChecklist}
              setEditingChecklist={setEditingChecklist}
            />
          ))}
        </div>
      </div>

      <PrintView checklists={checklists} />
    </>
  );
};

export default ChecklistManager; 