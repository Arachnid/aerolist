import { Checklist } from '../types';

export const DEFAULT_CHECKLISTS: Checklist[] = [
  {
    id: 1,
    title: "Pre-flight Checklist",
    items: [
      { id: 1, target: "Master Switch", state: "ON" },
      { id: 2, target: "Fuel Quantity", state: "CHECK" },
      { id: 3, target: "Oil Level", state: "CHECK" },
      { id: 4, target: "Flight Controls", state: "FREE & CORRECT" },
      { id: 5, target: "Instruments", state: "SET" }
    ]
  }
]; 