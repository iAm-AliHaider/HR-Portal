import { NextApiRequest, NextApiResponse } from 'next';

export interface WorkflowMiddleware {
  processWorkflow: (req: NextApiRequest, res: NextApiResponse, next: () => void) => void;
}

export const workflowMiddleware = {
  processWorkflow: (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Basic workflow processing logic
    console.log('[Workflow] Processing request:', req.url);
    next();
  }
}; 