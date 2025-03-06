import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ExclusionResult } from '../types';
import { formatDate, formatTime } from '../utils/export';
import DatabaseResultSection from './DatabaseResultSection';

interface ResultCardProps {
  result: ExclusionResult;
  expanded: boolean;
  onToggleExpand: () => void;
  highlight?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  expanded, 
  onToggleExpand,
  highlight = false
}) => {
  const statusIcon = {
    clear: <Check className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    excluded: <XCircle className="h-5 w-5 text-red-500" />
  };
  
  const statusColor = {
    clear: 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20',
    warning: 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20',
    excluded: 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20'
  };
  
  return (
    <motion.div
      className={`card mb-5 transition-all duration-300 ${
        highlight ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
          statusColor[result.status as keyof typeof statusColor]
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {statusIcon[result.status as keyof typeof statusIcon]}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {result.firstName} {result.lastName}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(result.dateOfBirth)} • {result.documentType.toUpperCase()}: {result.identificationNumber}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(result.checkDate)}
            </div>
            <div className={`text-sm font-medium uppercase ${
              result.status === 'clear' 
                ? 'text-green-600 dark:text-green-400' 
                : result.status === 'warning' 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-red-600 dark:text-red-400'
            }`}>
              {result.status}
            </div>
          </div>
          
          <div className="ml-2">
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 bg-white dark:bg-gray-800">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Verification Message
            </h4>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
              {result.message}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Subject Information
              </h4>
              <div className="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Full Name:</div>
                  <div className="text-gray-800 dark:text-gray-200 font-medium">{result.firstName} {result.lastName}</div>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Date of Birth:</div>
                  <div className="text-gray-800 dark:text-gray-200">{formatDate(result.dateOfBirth)}</div>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">ID Type:</div>
                  <div className="text-gray-800 dark:text-gray-200">{result.documentType.toUpperCase()}</div>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">ID Number:</div>
                  <div className="text-gray-800 dark:text-gray-200">{result.identificationNumber}</div>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">State:</div>
                  <div className="text-gray-800 dark:text-gray-200">{result.state}</div>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">Check Date:</div>
                  <div className="text-gray-800 dark:text-gray-200">{formatDate(result.checkDate)} at {formatTime(result.checkDate)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Verification Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.databaseResults.map((db) => (
                  <div 
                    key={db.databaseId}
                    className={`p-3 rounded-md border ${
                      db.status === 'clear' 
                        ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20' 
                        : db.status === 'warning' 
                          ? 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20' 
                          : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{db.databaseName}</h5>
                      <span className={`text-xs font-medium px-2 py-1 rounded uppercase ${
                        db.status === 'clear' 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                          : db.status === 'warning' 
                            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' 
                            : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                      }`}>
                        {db.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Searched on {formatDate(db.searchDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Details by Database
            </h4>
            <div className="space-y-4">
              {result.databaseResults.map((db) => (
                <DatabaseResultSection key={db.databaseId} result={db} />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResultCard;
