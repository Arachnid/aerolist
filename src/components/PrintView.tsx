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
              {checklist.items.map((item, itemIndex) => {
                // Check if item is a divider
                if ('type' in item && item.type === 'divider') {
                  return (
                    <div key={item.id} className="checklist-item">
                      <div className="flex-1 border-t-2 border-gray-300 my-2"></div>
                    </div>
                  );
                }

                // Regular item rendering
                const regularItem = item as any;
                return (
                  <div key={item.id} className="checklist-item">
                    <div className="checklist-item-content flex-1">
                      <div className="checklist-item-dots"></div>
                      <span className="checklist-item-target">{regularItem.target}</span>
                      <span className="checklist-item-state">{regularItem.state}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintView; 