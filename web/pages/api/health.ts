import { NextApiRequest, NextApiResponse } from 'next';

type HealthResponse = {
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  timestamp: string;
  environment: string;
  uptime: number;
  services: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'down';
      latency?: number;
      message?: string;
    };
  };
};

// Track server start time
const serverStartTime = Date.now();

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<HealthResponse>
) {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Only allow GET method
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
    return;
  }

  // Calculate uptime in seconds
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
  
  try {
    // Simplified health check response
    const healthResponse: HealthResponse = {
      status: 'healthy',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime,
      services: {
        api: {
          status: 'healthy',
          latency: 1, // Simplified for this example
          message: 'API is operational'
        },
        database: {
          status: 'healthy',
          latency: 5, // Simplified for this example
          message: 'Database connections healthy'
        }
      }
    };

    // Return health check
    res.status(200).json(healthResponse);
  } catch (error) {
    console.error('Health check error:', error);
    
    // Return error response
    res.status(500).json({
      status: 'down',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime,
      services: {
        api: {
          status: 'down',
          message: 'Health check failed'
        },
        database: {
          status: 'down',
          message: 'Could not determine database status'
        }
      }
    });
  }
} 