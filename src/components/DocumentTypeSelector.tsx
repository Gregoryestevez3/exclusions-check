import React from 'react';
import { CreditCard, Hash, FileText } from 'lucide-react';

interface DocumentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ value, onChange }) => {
  const documentTypes = [
    { id: 'ssn', label: 'SSN', icon: <Hash className="h-4 w-4" /> },
    { id: 'driverLicense', label: 'Driver License', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'other', label: 'Other ID', icon: <FileText className="h-4 w-4" /> }
  ];

  return (
    <div>
      <label className="form-label">ID Type</label>
      <div className="flex flex-wrap bg-gray-100 p-1 rounded-lg">
        {documentTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors mr-1 mb-1 ${
              value === type.id
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-700 hover:text-indigo-600'
            }`}
            onClick={() => onChange(type.id)}
          >
            <span className="mr-1.5">{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocumentTypeSelector;
