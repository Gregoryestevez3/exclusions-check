import { env, logger } from './env';
import { ExclusionFormData } from './validation';
import { ExclusionResult, DatabaseResult } from '../types';

/**
 * API service for making authenticated requests to external databases
 */

// API request options type
type ApiRequestOptions = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, string>;
  data?: any;
  apiKey?: string;
};

/**
 * Make an authenticated API request to an external service
 */
export const apiRequest = async <T>({
  endpoint,
  method = 'GET',
  params = {},
  data,
  apiKey
}: ApiRequestOptions): Promise<T> => {
  try {
    // Build URL with query parameters
    const url = new URL(endpoint, env.apiBaseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Prepare fetch options
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
      }
    };
    
    // Add request body for POST/PUT requests
    if (['POST', 'PUT'].includes(method) && data) {
      options.body = JSON.stringify(data);
    }
    
    // Log request in development
    if (env.isDevelopment()) {
      logger.debug(`API Request: ${method} ${url.toString()}`);
    }
    
    // Make the request
    const response = await fetch(url.toString(), options);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    // Parse and return response data
    return await response.json() as T;
  } catch (error) {
    logger.error('API request failed:', error);
    throw error;
  }
};

/**
 * Database-specific API functions
 */

// FSMB Medical License Verification API
export const fsmb = {
  verifyLicense: async (licenseNumber: string, state: string) => {
    return apiRequest({
      endpoint: '/api/fsmb/verify',
      method: 'POST',
      apiKey: env.apiKeys.fsmb,
      data: { licenseNumber, state }
    });
  }
};

// OIG Exclusion List API
export const oig = {
  checkExclusion: async (firstName: string, lastName: string, dob?: string) => {
    return apiRequest({
      endpoint: '/api/oig/search',
      method: 'GET',
      apiKey: env.apiKeys.oig,
      params: { 
        firstName, 
        lastName,
        ...(dob ? { dob } : {})
      }
    });
  }
};

// SAM Exclusions API
export const sam = {
  searchExclusions: async (params: { firstName?: string, lastName?: string, ein?: string, duns?: string }) => {
    return apiRequest({
      endpoint: '/api/sam/exclusions',
      method: 'GET',
      apiKey: env.apiKeys.sam,
      params: Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>
    });
  }
};

// NSOPW Registry API
export const nsopw = {
  checkRegistry: async (firstName: string, lastName: string, state?: string) => {
    return apiRequest({
      endpoint: '/api/nsopw/search',
      method: 'GET',
      apiKey: env.apiKeys.nsopw,
      params: { 
        firstName, 
        lastName,
        ...(state ? { state } : {})
      }
    });
  }
};

// Mock API responses for development
export const mockApi = {
  generateResponse: (status: 'clear' | 'excluded' | 'warning') => {
    if (!env.enableMockData) {
      throw new Error('Mock API is disabled in this environment');
    }
    
    const referenceId = `REF-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const searchDate = new Date().toISOString();
    
    return {
      status,
      referenceId,
      searchDate,
      details: status === 'clear' 
        ? 'No records found matching the search criteria.' 
        : status === 'excluded'
          ? 'Individual appears on exclusion list. Verification required.'
          : 'Potential match found. Additional verification recommended.'
    };
  }
};

/**
 * Main function to check exclusions across all databases
 * @param formData The form data containing individual information
 * @returns An exclusion result object with status and database-specific results
 */
export const checkExclusions = async (formData: ExclusionFormData): Promise<ExclusionResult> => {
  logger.debug('Checking exclusions for:', formData.firstName, formData.lastName);
  
  try {
    // Use mock data if enabled in environment
    if (env.enableMockData) {
      // Generate different statuses for testing
      const statuses: ('clear' | 'excluded' | 'warning')[] = ['clear', 'excluded', 'warning'];
      const randomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];
      
      // Create database results with mock data
      const databaseResults: DatabaseResult[] = [
        {
          databaseId: 'medical',
          databaseName: 'Medical License Verification',
          status: randomStatus(),
          searchDate: new Date().toISOString(),
          details: 'Medical license verification completed.',
          searchUrl: 'https://www.fsmb.org/physician-profile/',
          referenceId: `MED-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
        },
        {
          databaseId: 'oig',
          databaseName: 'OIG Exclusion List',
          status: randomStatus(),
          searchDate: new Date().toISOString(),
          details: 'OIG exclusion database check completed.',
          searchUrl: 'https://oig.hhs.gov/exclusions/index.asp',
          referenceId: `OIG-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
        },
        {
          databaseId: 'sam',
          databaseName: 'System for Award Management (SAM)',
          status: randomStatus(),
          searchDate: new Date().toISOString(),
          details: 'SAM exclusions database check completed.',
          searchUrl: 'https://sam.gov/search/',
          referenceId: `SAM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
        },
        {
          databaseId: 'nsopw',
          databaseName: 'National Sex Offender Registry',
          status: randomStatus(),
          searchDate: new Date().toISOString(),
          details: 'National sex offender registry check completed.',
          searchUrl: 'https://www.nsopw.gov/',
          referenceId: `NSOPW-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
        }
      ];
      
      // Determine overall status (worst case)
      let overallStatus: 'clear' | 'excluded' | 'warning' = 'clear';
      if (databaseResults.some(r => r.status === 'excluded')) {
        overallStatus = 'excluded';
      } else if (databaseResults.some(r => r.status === 'warning')) {
        overallStatus = 'warning';
      }
      
      // Create result
      return {
        resultId: `VER-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        checkDate: new Date().toISOString(),
        status: overallStatus,
        message: overallStatus === 'clear' 
          ? 'No exclusions found across all checked databases.' 
          : overallStatus === 'excluded'
            ? 'Individual appears on one or more exclusion lists. Further verification required.'
            : 'Potential matches found. Additional verification recommended.',
        databaseResults: databaseResults
      };
    }
    
    // Make real API calls if mock data is disabled
    const results: DatabaseResult[] = [];
    
    // Medical license verification if applicable
    if (formData.documentType === 'license' && formData.address?.state) {
      try {
        const licenseResult = await fsmb.verifyLicense(
          formData.identificationNumber,
          formData.address.state
        );
        
        results.push({
          databaseId: 'medical',
          databaseName: 'Medical License Verification',
          status: licenseResult.status || 'clear',
          searchDate: new Date().toISOString(),
          details: licenseResult.details || 'Medical license verification completed.',
          searchUrl: 'https://www.fsmb.org/physician-profile/',
          referenceId: licenseResult.referenceId
        });
      } catch (error) {
        logger.error('Error checking medical license:', error);
        results.push({
          databaseId: 'medical',
          databaseName: 'Medical License Verification',
          status: 'warning',
          searchDate: new Date().toISOString(),
          details: 'Unable to verify medical license. Please check manually.',
          searchUrl: 'https://www.fsmb.org/physician-profile/',
          referenceId: null
        });
      }
    }
    
    // OIG check
    try {
      const oigResult = await oig.checkExclusion(
        formData.firstName,
        formData.lastName,
        formData.dateOfBirth
      );
      
      results.push({
        databaseId: 'oig',
        databaseName: 'OIG Exclusion List',
        status: oigResult.status || 'clear',
        searchDate: new Date().toISOString(),
        details: oigResult.details || 'OIG exclusion database check completed.',
        searchUrl: 'https://oig.hhs.gov/exclusions/index.asp',
        referenceId: oigResult.referenceId
      });
    } catch (error) {
      logger.error('Error checking OIG exclusions:', error);
      results.push({
        databaseId: 'oig',
        databaseName: 'OIG Exclusion List',
        status: 'warning',
        searchDate: new Date().toISOString(),
        details: 'Unable to complete OIG exclusion check. Please verify manually.',
        searchUrl: 'https://oig.hhs.gov/exclusions/index.asp',
        referenceId: null
      });
    }
    
    // SAM check
    try {
      const samResult = await sam.searchExclusions({
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.documentType === 'ein' ? { ein: formData.identificationNumber } : {}),
        ...(formData.documentType === 'duns' ? { duns: formData.identificationNumber } : {})
      });
      
      results.push({
        databaseId: 'sam',
        databaseName: 'System for Award Management (SAM)',
        status: samResult.status || 'clear',
        searchDate: new Date().toISOString(),
        details: samResult.details || 'SAM exclusions database check completed.',
        searchUrl: 'https://sam.gov/search/',
        referenceId: samResult.referenceId
      });
    } catch (error) {
      logger.error('Error checking SAM exclusions:', error);
      results.push({
        databaseId: 'sam',
        databaseName: 'System for Award Management (SAM)',
        status: 'warning',
        searchDate: new Date().toISOString(),
        details: 'Unable to complete SAM exclusion check. Please verify manually.',
        searchUrl: 'https://sam.gov/search/',
        referenceId: null
      });
    }
    
    // NSOPW check
    try {
      const nsopwResult = await nsopw.checkRegistry(
        formData.firstName,
        formData.lastName,
        formData.address?.state
      );
      
      results.push({
        databaseId: 'nsopw',
        databaseName: 'National Sex Offender Registry',
        status: nsopwResult.status || 'clear',
        searchDate: new Date().toISOString(),
        details: nsopwResult.details || 'National sex offender registry check completed.',
        searchUrl: 'https://www.nsopw.gov/',
        referenceId: nsopwResult.referenceId
      });
    } catch (error) {
      logger.error('Error checking NSOPW registry:', error);
      results.push({
        databaseId: 'nsopw',
        databaseName: 'National Sex Offender Registry',
        status: 'warning',
        searchDate: new Date().toISOString(),
        details: 'Unable to complete sex offender registry check. Please verify manually.',
        searchUrl: 'https://www.nsopw.gov/',
        referenceId: null
      });
    }
    
    // Determine overall status (worst case)
    let overallStatus: 'clear' | 'excluded' | 'warning' = 'clear';
    if (results.some(r => r.status === 'excluded')) {
      overallStatus = 'excluded';
    } else if (results.some(r => r.status === 'warning')) {
      overallStatus = 'warning';
    }
    
    // Create final result
    return {
      resultId: `VER-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      checkDate: new Date().toISOString(),
      status: overallStatus,
      message: overallStatus === 'clear' 
        ? 'No exclusions found across all checked databases.' 
        : overallStatus === 'excluded'
          ? 'Individual appears on one or more exclusion lists. Further verification required.'
          : 'Potential matches found. Additional verification recommended.',
      databaseResults: results
    };
  } catch (error) {
    logger.error('Error checking exclusions:', error);
    throw new Error('Failed to complete exclusion checks. Please try again.');
  }
};
