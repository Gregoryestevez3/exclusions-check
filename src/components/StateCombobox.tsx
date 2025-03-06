import React, { useState, useEffect, useRef } from 'react';
import { US_STATES } from '../utils/constants';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface StateComboboxProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const StateCombobox: React.FC<StateComboboxProps> = ({ id, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState(() => {
    if (value) {
      const state = US_STATES.find(s => s.abbreviation === value);
      return state ? { ...state } : null;
    }
    return null;
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  
  // Calculate filtered states based on search text
  const filteredStates = searchText.trim() === '' 
    ? US_STATES 
    : US_STATES.filter(state => 
        state.name.toLowerCase().includes(searchText.toLowerCase()) || 
        state.abbreviation.toLowerCase().includes(searchText.toLowerCase())
      );
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listboxRef.current && 
        !listboxRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        
        // Reset search text to selected state or empty
        if (selectedState) {
          setSearchText(selectedState.name);
        } else {
          setSearchText('');
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedState]);
  
  // Handle state selection
  const handleSelectState = (state: { name: string; abbreviation: string }) => {
    setSelectedState(state);
    setSearchText(state.name);
    onChange(state.abbreviation);
    setIsOpen(false);
    inputRef.current?.blur();
  };
  
  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    if (selectedState) {
      setSearchText('');
    }
  };
  
  return (
    <div className="relative">
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          type="text"
          autoComplete="off"
          placeholder="Select state"
          value={searchText || (selectedState ? selectedState.name : '')}
          onChange={(e) => {
            setSearchText(e.target.value);
            if (e.target.value === '' && selectedState) {
              setSelectedState(null);
              onChange('');
            }
          }}
          onFocus={handleFocus}
          className={`form-control pr-10 ${error ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button
            type="button"
            className="h-full px-2 text-gray-400 hover:text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close state selection" : "Open state selection"}
            tabIndex={-1}
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <p className="form-error">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      
      {isOpen && (
        <div 
          ref={listboxRef}
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
          role="listbox"
        >
          {filteredStates.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No states found</div>
          ) : (
            filteredStates.map(state => (
              <div
                key={state.abbreviation}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
                  selectedState?.abbreviation === state.abbreviation ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                }`}
                onClick={() => handleSelectState(state)}
                role="option"
                aria-selected={selectedState?.abbreviation === state.abbreviation}
              >
                <div className="flex justify-between items-center">
                  <span>{state.name}</span>
                  <span className="text-gray-500 text-xs">{state.abbreviation}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StateCombobox;
