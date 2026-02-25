import { logger } from '../logging/logger';
import { ApiError } from './errors';

// I standardize external service failures so controllers return consistent errors
export function handleExternalError(serviceName: string, error: unknown) {
  logger.error({ err: error, service: serviceName }, 'External service error');
  return new ApiError(502, `${serviceName.toUpperCase()}_ERROR`, `${serviceName} service failed`);
}
