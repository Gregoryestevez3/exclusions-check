import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface IdentificationFieldProps {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const IdentificationField: React.FC<IdentificationFieldProps> = ({ 
  id, 
  type, 
  value, 
  onChange, 
  error 
}) => {
  const [displayValue, setDisplayValue] = useState(value || '');
  
  useEffect(() => {
    // Format value based on document type
    let formattedValue = value || '';
    
    if (type === 'ssn') {
      // Remove non-digits
      formattedValue = formattedValue.replace(/\D/g, '');
      
      // Format as XXX-XX-XXXX
      if (formattedValue.length > 0) {
        const parts = [];
        if (formattedValue.length > 0) {
          parts.push(formattedValue.slice(0, Math.min(3, formattedValue.length)));
        }
        if (formattedValue.length > 3) {
          parts.push(formattedValue.slice(3, Math.min(5, formattedValue.length)));
        }
        if (formattedValue.length > 5) {
          parts.push(formattedValue.slice(5, Math.min(9, formattedValue.length)));
        }
        formattedValue = parts.join('-');
      }
    } else if (type === 'driverLicense') {
      // Driver's license format varies by state, so just trim whitespace
      formattedValue = formattedValue.trim();
    }
    
    setDisplayValue(formattedValue);
  }, [value, type]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    // Remove formatting for the actual stored value
    const cleanValue = newValue.replace(/[-\s]/g, '');
    onChange(cleanValue);
  };
  
  const getPlaceholder = () => {
    switch (type) {
      case 'ssn':
        return 'XXX-XX-XXXX';
      case 'driverLicense':
        return 'DXXXXXXXX';
      default:
        return 'Enter identification number';
    }
  };
  
  const getLabel = () => {
    switch (type) {
      case 'ssn':
        return 'Social Security Number';
      case 'driverLicense':
        return 'Driver License Number';
      default:
        return 'Identification Number';
    }
  };

  return (
    <div>
      <label htmlFor={id} className="form-label">
        {getLabel()}
      </label>
      <input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={getPlaceholder()}
        autoComplete="off"
        className={`form-control ${error ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
      />
      {error && (
        <p className="form-error">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default IdentificationField;
