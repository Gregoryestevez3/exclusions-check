import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DataCitationProps {
  database: string;
}

const DataCitation: React.FC<DataCitationProps> = ({ database }) => {
  // Citations for each database
  const citations: Record<string, { text: string; url: string }> = {
    medical: {
      text: "Medical Compliance Database maintained by the Department of Health",
      url: "https://www.health.gov/medical-compliance-database"
    },
    oig: {
      text: "Office of Inspector General (OIG) List of Excluded Individuals/Entities (LEIE)",
      url: "https://oig.hhs.gov/exclusions/index.asp"
    },
    sam: {
      text: "System for Award Management (SAM) Exclusion List",
      url: "https://sam.gov/content/exclusions"
    },
    nsopw: {
      text: "National Sex Offender Public Website (NSOPW)",
      url: "https://www.nsopw.gov/"
    }
  };

  const citation = citations[database] || {
    text: "Verification database",
    url: "#"
  };

  return (
    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span>Data Source: </span>
          <a 
            href={citation.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {citation.text}
          </a>
          <p className="mt-1">
            This data is provided for informational purposes only and should be verified with the official source for the most current information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataCitation;
