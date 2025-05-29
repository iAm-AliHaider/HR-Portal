export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'action';
  config: Record<string, any>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
  triggers: string[];
}

export class WorkflowEngine {
  private workflows: Map<string, WorkflowDefinition> = new Map();

  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
    console.log(`[WorkflowEngine] Registered workflow: ${workflow.name}`);
  }

  executeWorkflow(workflowId: string, context: Record<string, any>): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    console.log(`[WorkflowEngine] Executing workflow: ${workflow.name}`);
    
    // Basic workflow execution logic
    return Promise.resolve();
  }

  getWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }
}

export const workflowEngine = new WorkflowEngine(); 