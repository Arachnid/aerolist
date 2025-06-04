import React from 'react';
import ChecklistManager from './components/ChecklistManager';
import './App.css';
import './styles/checklist.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ChecklistManager />
    </div>
  );
};

export default App;