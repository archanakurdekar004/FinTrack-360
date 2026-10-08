import HealthService from '../services/healthService.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Health Controller
 * Handles HTTP request/response parsing for system health endpoint.
 */
export const checkHealth = async (_req, res, next) => {
  try {
    const healthData = HealthService.getHealthStatus();
    const statusCode = healthData.status === 'healthy' ? 200 : 503;

    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, healthData, 'FinTrack 360 backend is operational'));
  } catch (error) {
    next(error);
  }
};
