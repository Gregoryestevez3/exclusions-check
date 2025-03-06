import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-12"
      >
        <Shield className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Our Service</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          One Time Home Care Exclusions Check provides a simple, efficient way to verify if individuals 
          are excluded from participating in federal healthcare programs.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 sm:space-y-12"
      >
        <motion.section variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Purpose</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Healthcare providers are required to ensure that they do not employ or contract with individuals 
            or entities that have been excluded from participation in federal healthcare programs. Failure to 
            do so can result in significant penalties and liability.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Our tool simplifies this compliance requirement by allowing you to quickly check individuals 
            against multiple exclusion databases, helping you maintain compliance and reduce risk.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-4">
                <HelpCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Submit Information</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Enter individual details or upload a spreadsheet with multiple records.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-4">
                <AlertTriangle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Verification Process</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our system checks the information against multiple exclusion databases.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Receive Results</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get instant results and export them in various formats for your records.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Data Sources</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our exclusion checks include the following databases:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
            <li>
              <strong>OIG LEIE:</strong> The Office of Inspector General's List of Excluded Individuals and Entities
            </li>
            <li>
              <strong>SAM Exclusions:</strong> System for Award Management exclusion records
            </li>
            <li>
              <strong>State Medicaid Exclusion Lists:</strong> Various state-level exclusion databases
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            Our database is updated monthly to ensure you have access to the most current information available.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Privacy & Security</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We take data privacy and security seriously. All information submitted through our service is:
          </p>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
            <li>Encrypted during transmission using industry-standard protocols</li>
            <li>Not stored on our servers after processing</li>
            <li>Handled in compliance with relevant data protection regulations</li>
            <li>Never shared with third parties</li>
          </ul>
        </motion.section>

        <motion.section variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you have any questions about our service or need assistance, please don't hesitate to reach out.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Email: support@othcec.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Business Inquiries</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Email: info@othcec.com<br />
                Phone: (555) 765-4321
              </p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;
