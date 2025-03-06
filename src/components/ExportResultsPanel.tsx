import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, X, Printer } from 'lucide-react';
import { ExclusionResult } from '../types';
import { exportToCSV, exportToPDF, generateDetailedReport } from '../utils/export';

interface ExportResultsPanelProps {
  results: ExclusionResult[];
  visible: boolean;
}

const ExportResultsPanel: React.FC<ExportResultsPanelProps> = ({ results, visible }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  
  if (!visible) return null;
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleExportCSV = async () => {
    setIsExporting('csv');
    try {
      await exportToCSV(results);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
    } finally {
      setIsExporting(null);
    }
  };
  
  const handleExportPDF = async () => {
    setIsExporting('pdf');
    try {
      await exportToPDF(results);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setIsExporting(null);
    }
  };
  
  const handlePrintDetailedReport = () => {
    if (results.length === 0) return;
    
    setIsExporting('print');
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setIsExporting(null);
      return;
    }
    
    // Generate a detailed report for each result
    const reportContent = results.map(result => generateDetailedReport(result)).join('<hr class="page-break" />');
    
    // Check if we're in dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Create the HTML content with styles (now with dark mode support)
    printWindow.document.write(`
      <!DOCTYPE html>
      <html class="${isDarkMode ? 'dark' : ''}">
        <head>
          <title>Detailed Verification Report</title>
          <style>
            :root {
              color-scheme: ${isDarkMode ? 'dark' : 'light'};
            }
            
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.5; 
              margin: 2rem;
              color: ${isDarkMode ? '#e5e7eb' : '#333'};
              background-color: ${isDarkMode ? '#111827' : '#fff'};
            }
            h1 { 
              color: ${isDarkMode ? '#a5b4fc' : '#4338ca'}; 
              margin-bottom: 0.5rem; 
              text-align: center;
              font-size: 24px;
            }
            h2 { 
              color: ${isDarkMode ? '#818cf8' : '#4f46e5'}; 
              margin-top: 1.5rem; 
              margin-bottom: 0.8rem;
              border-bottom: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
              padding-bottom: 0.5rem;
              font-size: 18px;
            }
            h3 { 
              color: ${isDarkMode ? '#a5b4fc' : '#6366f1'}; 
              margin-top: 1rem; 
              margin-bottom: 0.5rem;
              font-size: 16px;
            }
            hr { 
              margin: 2rem 0; 
              border: 0; 
              border-top: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 2rem; 
              padding-bottom: 1rem;
              border-bottom: 2px solid ${isDarkMode ? '#6366f1' : '#4338ca'};
            }
            .date { 
              color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; 
              font-size: 14px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1.5rem;
            }
            .info-table td {
              padding: 8px;
              border-bottom: 1px solid ${isDarkMode ? '#1f2937' : '#f3f4f6'};
            }
            .label {
              font-weight: bold;
              width: 35%;
              color: ${isDarkMode ? '#9ca3af' : '#4b5563'};
            }
            .database-result {
              margin-bottom: 1.5rem;
              padding: 1rem;
              background-color: ${isDarkMode ? '#1f2937' : '#f9fafb'};
              border-radius: 0.5rem;
            }
            .report-section {
              margin-bottom: 2rem;
            }
            .summary-message {
              padding: 1rem;
              background-color: ${isDarkMode ? '#1f2937' : '#f3f4f6'};
              border-radius: 0.5rem;
              border-left: 4px solid ${isDarkMode ? '#6366f1' : '#4338ca'};
            }
            .report-footer {
              margin-top: 3rem;
              padding-top: 1rem;
              border-top: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
              font-size: 12px;
              color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
            }
            .status-clear {
              color: ${isDarkMode ? '#34d399' : '#059669'};
              font-weight: bold;
            }
            .status-excluded {
              color: ${isDarkMode ? '#f87171' : '#dc2626'};
              font-weight: bold;
            }
            .status-warning {
              color: ${isDarkMode ? '#fbbf24' : '#d97706'};
              font-weight: bold;
            }
            .page-break {
              page-break-after: always;
            }
            @media print {
              .page-break {
                page-break-after: always;
              }
              body {
                margin: 1cm;
                color: #333 !important;
                background-color: white !important;
              }
              /* Force light theme for printing */
              h1 { color: #4338ca !important; }
              h2 { color: #4f46e5 !important; border-bottom-color: #e5e7eb !important; }
              h3 { color: #6366f1 !important; }
              hr { border-top-color: #e5e7eb !important; }
              .header { border-bottom-color: #4338ca !important; }
              .date { color: #6b7280 !important; }
              .info-table td { border-bottom-color: #f3f4f6 !important; }
              .label { color: #4b5563 !important; }
              .database-result { background-color: #f9fafb !important; }
              .summary-message { background-color: #f3f4f6 !important; border-left-color: #4338ca !important; }
              .report-footer { border-top-color: #e5e7eb !important; color: #6b7280 !important; }
              .status-clear { color: #059669 !important; }
              .status-excluded { color: #dc2626 !important; }
              .status-warning { color: #d97706 !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Background Verification Report</h1>
            <p class="date">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          ${reportContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        setIsExporting(null);
      }, 250);
    };
  };

  return (
    <AnimatePresence>
      <motion.div
        className="card mb-6 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="bg-indigo-600 dark:bg-indigo-700 p-4 flex justify-between items-center cursor-pointer"
          onClick={toggleExpanded}
        >
          <div className="flex items-center">
            <Download className="h-5 w-5 text-white mr-2" />
            <h3 className="text-white font-medium">Export Verification Results</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-white bg-opacity-20 text-white text-sm py-1 px-2 rounded-md">
              {results.length} {results.length === 1 ? 'Result' : 'Results'}
            </span>
            <button 
              className="text-white hover:bg-white hover:bg-opacity-10 p-1 rounded-full"
              aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
            >
              <svg 
                className={`h-5 w-5 transform transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    className={`flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${
                      isExporting === 'csv' 
                        ? 'bg-green-50 dark:bg-green-900/20 cursor-wait' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                    } transition-colors`}
                    onClick={isExporting ? undefined : handleExportCSV}
                  >
                    <div className="mr-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      {isExporting === 'csv' ? (
                        <div className="h-6 w-6 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">Export to CSV</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Download as spreadsheet format</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${
                      isExporting === 'pdf' 
                        ? 'bg-red-50 dark:bg-red-900/20 cursor-wait' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                    } transition-colors`}
                    onClick={isExporting ? undefined : handleExportPDF}
                  >
                    <div className="mr-4 bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                      {isExporting === 'pdf' ? (
                        <div className="h-6 w-6 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">Export to PDF</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Download as document format</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${
                      isExporting === 'print' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 cursor-wait' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                    } transition-colors`}
                    onClick={isExporting ? undefined : handlePrintDetailedReport}
                  >
                    <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      {isExporting === 'print' ? (
                        <div className="h-6 w-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Printer className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">Print Report</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Detailed report with all citations</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
                  <p>
                    <strong>Complete Documentation:</strong> Exports include verification across all databases with detailed citations, search parameters, and timestamps for each database search.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportResultsPanel;
