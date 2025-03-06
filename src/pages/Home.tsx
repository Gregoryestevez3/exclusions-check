import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ExclusionForm from '../components/ExclusionForm';
import ResultCard from '../components/ResultCard';
import ExportResultsPanel from '../components/ExportResultsPanel';
import { ExclusionFormData } from '../utils/validation';
import DataCitation from '../components/DataCitation';
import { checkExclusions } from '../utils/api';
import { ExclusionResult } from '../types';

const Home: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ExclusionResult[] | null>(null);
  const [searchData, setSearchData] = useState<ExclusionFormData | null>(null);
  
  const handleSubmit = async (data: ExclusionFormData) => {
    setIsSubmitting(true);
    setSearchData(data);
    
    try {
      // Call the API to check exclusions
      const response = await checkExclusions(data);
      
      // Set results as an array (required by ExportResultsPanel)
      setResults(response ? [response] : []);
    } catch (error) {
      console.error("Error checking exclusions:", error);
      // Handle error state here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Header Section */}
        <div className="lg:col-span-12 mb-4 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              One Time Home Care Exclusions Check
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
              Verify individuals against healthcare exclusion databases with proper citations. Search across OIG, SAM, NSOPW, and more.
            </p>
          </motion.div>
        </div>
        
        {/* Left Column - Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ExclusionForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          
          {/* Data Citation Info Card */}
          <div className="mt-6">
            <DataCitation />
          </div>
        </div>
        
        {/* Right Column - Results & Export */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {results && results.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ResultCard 
                  results={results[0]}
                  searchData={searchData}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <ExportResultsPanel 
                  results={results}
                  visible={true}
                />
              </motion.div>
            </>
          )}
          
          {(!results || results.length === 0) && !isSubmitting && (
            <div className="card p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Results</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Complete the form to perform an exclusion verification check.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
