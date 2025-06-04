export interface ChecklistItem {
  id: number;
  target: string;
  state: string;
}

export interface Checklist {
  id: number;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistCardProps {
  checklist: Checklist;
  onDelete: (id: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
  onAddItem: (checklistId: number) => void;
  onUpdateItem: (checklistId: number, itemId: number, field: keyof ChecklistItem, value: string) => void;
  onDeleteItem: (checklistId: number, itemId: number) => void;
  onReorderItems: (checklistId: number, startIndex: number, endIndex: number) => void;
  editingChecklist: number | null;
  setEditingChecklist: (id: number | null) => void;
} 