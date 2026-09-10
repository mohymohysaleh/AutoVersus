/**
 * Production-Safe Client Logger Utility
 * Wraps console logging so debug and warning logs are stripped or disabled in Release builds (__DEV__ === false).
 */
class ClientLoggerService {
  private isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

  public log(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  public error(message: string, error?: any): void {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  }
}

export const logger = new ClientLoggerService();
