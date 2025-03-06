/**
 * Environment utilities for securely accessing environment variables
 * with proper typing and fallbacks
 */

// Environment type
export type Environment = 'development' | 'staging' | 'production';

// Log level type
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Get environment variable with type safety and default value
 */
export const getEnv = <T>(key: string, defaultValue: T): T => {
  const value = import.meta.env[key];
  return value !== undefined ? value as T : defaultValue;
};

/**
 * Get environment variable as boolean with type safety and default value
 */
export const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

/**
 * Get environment variable as number with type safety and default value
 */
export const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Environment configuration object with all app-specific env vars
 */
export const env = {
  // Current environment
  appEnv: getEnv<Environment>('VITE_APP_ENV', 'development'),
  
  // Base URL for API calls
  apiBaseUrl: getEnv<string>('VITE_API_BASE_URL', 'http://localhost:3000'),
  
  // Feature flags
  enableMockData: getEnvBoolean('VITE_ENABLE_MOCK_DATA', true),
  
  // App settings
  maxBatchSize: getEnvNumber('VITE_MAX_BATCH_SIZE', 250),
  logLevel: getEnv<LogLevel>('VITE_LOG_LEVEL', 'info'),
  
  // API Keys (with fallbacks for development)
  apiKeys: {
    fsmb: getEnv<string>('VITE_FSMB_API_KEY', 'dev_fsmb_key'),
    oig: getEnv<string>('VITE_OIG_API_KEY', 'dev_oig_key'),
    sam: getEnv<string>('VITE_SAM_API_KEY', 'dev_sam_key'),
    nsopw: getEnv<string>('VITE_NSOPW_API_KEY', 'dev_nsopw_key'),
  },
  
  // Helper methods for environment checking
  isDevelopment: (): boolean => env.appEnv === 'development',
  isStaging: (): boolean => env.appEnv === 'staging',
  isProduction: (): boolean => env.appEnv === 'production',
};

/**
 * Logger that respects the current environment log level
 */
export const logger = {
  debug: (message: string, ...args: any[]): void => {
    if (['debug'].includes(env.logLevel)) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]): void => {
    if (['debug', 'info'].includes(env.logLevel)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]): void => {
    if (['debug', 'info', 'warn'].includes(env.logLevel)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]): void => {
    console.error(`[ERROR] ${message}`, ...args);
  }
};
