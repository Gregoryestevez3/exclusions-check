import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { DatabaseResult } from '../types';
import { formatDate, formatTime } from '../utils/export';
import DataCitation from './DataCitation';

interface DatabaseResultSectionProps {
  result: DatabaseResult;
}

const DatabaseResultSection: React.FC<DatabaseResultSectionProps> = ({ result }) => {
  const [expanded, setExpanded] = useState(false);
  
  const statusColor = {
    clear: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
    excluded: 'text-red-600 dark:text-red-400'
  };
  
  const statusBackground = {
    clear: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    excluded: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
  };
  
  return (
    <div className={`rounded-lg border ${statusBackground[result.status as keyof typeof statusBackground]}`}>
      <div 
        className="p-3 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
            {result.databaseName}
            {result.status !== 'clear' && (
              <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                result.status === 'warning' 
                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' 
                  : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
              }`}>
                {result.status.toUpperCase()}
              </span>
            )}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Searched on {formatDate(result.searchDate)} at {formatTime(result.searchDate)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${statusColor[result.status as keyof typeof statusColor]}`}>
            {result.status.toUpperCase()}
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-3 bg-white dark:bg-gray-800">
              <div className="mb-3">
                <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Details
                </h6>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {result.details}
                </p>
              </div>
              
              {result.referenceId && (
                <div className="mb-3">
                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reference ID
                  </h6>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {result.referenceId}
                  </p>
                </div>
              )}
              
              <div className="mb-3">
                <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source
                </h6>
                <div className="flex items-center">
                  <a 
                    href={result.searchUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm flex items-center"
                  >
                    {result.searchUrl}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
              
              <DataCitation database={result.databaseId} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatabaseResultSection;
