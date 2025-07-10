import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Edit2, Check, X, GripVertical, Plus, Minus } from 'lucide-react';
import { ChecklistCardProps, ChecklistItemOrDivider } from '../types';

const ChecklistCard: React.FC<ChecklistCardProps> = ({ 
  checklist, 
  onDelete, 
  onUpdateTitle, 
  onAddItem, 
  onAddDivider,
  onUpdateItem, 
  onDeleteItem,
  onReorderItems,
  editingChecklist,
  setEditingChecklist 
}) => {
  const [tempTitle, setTempTitle] = useState(checklist.title);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [previousItemsLength, setPreviousItemsLength] = useState(checklist.items.length);
  const targetInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus target input when entering edit mode
  useEffect(() => {
    if (editingItemId && targetInputRef.current) {
      targetInputRef.current.focus();
      targetInputRef.current.select();
    }
  }, [editingItemId]);

  // Detect when new items are added and enter edit mode for the new item
  useEffect(() => {
    if (checklist.items.length > previousItemsLength) {
      const newItem = checklist.items[checklist.items.length - 1];
      setEditingItemId(newItem.id);
    }
    setPreviousItemsLength(checklist.items.length);
  }, [checklist.items.length, previousItemsLength, checklist.items]);

  const handleSaveItem = () => {
    setEditingItemId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveItem();
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    // ... existing code ...
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderItems(checklist.id, draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="border-2 border-gray-800 bg-white">
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        {editingChecklist === checklist.id ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="flex-1 px-2 py-1 text-black rounded"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onUpdateTitle(checklist.id, tempTitle);
                }
              }}
            />
            <button
              onClick={() => onUpdateTitle(checklist.id, tempTitle)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setEditingChecklist(null);
                setTempTitle(checklist.title);
              }}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold">{checklist.title}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingChecklist(checklist.id);
                  setTempTitle(checklist.title);
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(checklist.id)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className="p-4">
        {checklist.items.map((item, index) => {
          // Check if item is a divider
          if ('type' in item && item.type === 'divider') {
            return (
              <div 
                key={item.id} 
                className={`checklist-item ${draggedIndex === index ? 'bg-blue-50' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <GripVertical size={16} className="text-gray-400 cursor-move mr-1" />
                <div className="flex-1 border-t-2 border-gray-300 my-2"></div>
                <div className="checklist-item-actions flex ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(checklist.id, item.id);
                    }}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          }

          // At this point, item is guaranteed to be a regular ChecklistItem
          const regularItem = item as any;
          
          // Regular item rendering
          return (
            <div 
              key={item.id} 
              className={`checklist-item ${draggedIndex === index ? 'bg-blue-50' : ''}`}
              draggable={editingItemId !== item.id}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              {editingItemId !== item.id && (
                <GripVertical size={16} className="text-gray-400 cursor-move mr-1" />
              )}
              
              {editingItemId === regularItem.id ? (
                <>
                  <input
                    ref={targetInputRef}
                    type="text"
                    value={regularItem.target}
                    onChange={(e) => onUpdateItem(checklist.id, regularItem.id, 'target', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={regularItem.state}
                    onChange={(e) => onUpdateItem(checklist.id, regularItem.id, 'state', e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    className="w-32 px-2 py-1 border border-gray-300 rounded text-right font-mono uppercase"
                  />
                  <button
                    onClick={handleSaveItem}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <Check size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="checklist-item-content flex-1">
                    <div className="checklist-item-dots"></div>
                    <span className="checklist-item-target">{regularItem.target}</span>
                    <span className="checklist-item-state text-gray-700">{regularItem.state}</span>
                  </div>
                  <div className="checklist-item-actions flex ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItemId(regularItem.id);
                      }}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(checklist.id, regularItem.id);
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onAddItem(checklist.id)}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Add Item
          </button>
          <button
            onClick={() => onAddDivider(checklist.id)}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded flex items-center gap-2"
          >
            <Minus size={16} />
            Add Divider
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistCard; 