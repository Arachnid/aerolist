import React from 'react';
import { Checklist } from '../types';

interface PrintViewProps {
  checklists: Checklist[];
}

const PrintView: React.FC<PrintViewProps> = ({ checklists }) => {
  return (
    <div className="print-only">
      {checklists.map((checklist) => (
        <div key={checklist.id} className="checklist-container">
          <div className="border-2 border-black">
            <div className="bg-black text-white p-2">
              <h2 className="text-lg font-bold">{checklist.title}</h2>
            </div>
            <div className="p-4">
              {checklist.items.map((item, itemIndex) => (
                <div key={item.id} className="checklist-item">
                  <div className="checklist-item-content flex-1">
                    <div className="checklist-item-dots"></div>
                    <span className="checklist-item-target">{item.target}</span>
                    <span className="checklist-item-state">{item.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintView; 