import { Checklist } from '../types';

export const exportChecklists = (checklists: Checklist[], filename?: string) => {
  try {
    const dataStr = JSON.stringify(checklists, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = filename || 'aviation-checklists.json';
    
    const linkElement = document.createElement('a');
    linkElement.style.display = 'none';
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  } catch (error) {
    // Fallback: copy to clipboard
    const dataStr = JSON.stringify(checklists, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert('Checklists copied to clipboard as JSON. You can paste this into a text file and save it as .json');
    }).catch(() => {
      alert('Unable to export. Please try using a different browser.');
    });
  }
};

export const importChecklists = (
  event: React.ChangeEvent<HTMLInputElement>,
  onImport: (checklists: Checklist[], filename: string) => void
) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const imported = JSON.parse(result);
          onImport(imported, file.name);
        }
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }
};

export const printChecklists = () => {
  // Create a delay to ensure styles are loaded
  setTimeout(() => {
    window.print();
  }, 100);
}; 