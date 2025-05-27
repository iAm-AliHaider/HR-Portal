import { OnboardingPlan } from '../../../packages/types/hr'

export const DEFAULT_ONBOARDING_TEMPLATES: Partial<OnboardingPlan>[] = [
  {
    title: "Engineering Team Onboarding",
    description: "Comprehensive onboarding plan for software engineers and technical roles",
    department_id: "engineering",
    job_role: "engineer",
    is_default: true,
    duration_days: 14,
    task_templates: [
      {
        title: "Complete I-9 Employment Verification",
        description: "Provide required documentation for I-9 verification process",
        category: "legal",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 0,
        approval_required: true,
        time_estimate: 0.5,
        instructions: "Employee must provide valid I-9 documentation. HR will verify and complete form.",
        resources: ["https://www.uscis.gov/i-9"]
      },
      {
        title: "Setup Payroll and Benefits",
        description: "Enroll in payroll system and select benefit options",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 1,
        time_estimate: 1,
        instructions: "Complete payroll setup, health insurance enrollment, and 401k registration",
        documents_required: ["Bank account info", "Insurance beneficiary forms"]
      },
      {
        title: "IT Equipment Provisioning",
        description: "Provision laptop, monitor, phone, and necessary software licenses",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 0,
        time_estimate: 2,
        instructions: "Setup MacBook Pro, external monitor, headset, and install development tools",
        auto_assign: true
      },
      {
        title: "Create Development Environment",
        description: "Setup development environment, IDE, and development tools",
        category: "technical",
        priority: "high",
        assigned_to_role: "it",
        due_day_offset: 1,
        dependencies: [2], // Depends on equipment provisioning
        time_estimate: 3,
        instructions: "Install VS Code, Docker, Git, and connect to company repositories",
        resources: ["Company dev setup guide", "Git workflows documentation"]
      },
      {
        title: "Security Training and Access Setup",
        description: "Complete security awareness training and setup VPN, 2FA",
        category: "security",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 2,
        approval_required: true,
        time_estimate: 2,
        instructions: "Complete mandatory security training, setup VPN client, enable 2FA on all accounts"
      },
      {
        title: "Workspace Assignment and Office Tour",
        description: "Assign desk/workspace and provide office tour",
        category: "facilities",
        priority: "medium",
        assigned_to_role: "manager",
        due_day_offset: 0,
        time_estimate: 0.5,
        instructions: "Show new hire their workspace, introduce to immediate team members"
      },
      {
        title: "Team Introduction Meeting",
        description: "Introduce new hire to team members and key stakeholders",
        category: "social",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 1,
        time_estimate: 1,
        instructions: "Schedule team meeting for introductions, explain team dynamics and current projects"
      },
      {
        title: "Assign Onboarding Buddy",
        description: "Pair new hire with experienced team member as buddy",
        category: "social",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 0,
        time_estimate: 0.5,
        instructions: "Select and brief buddy on their responsibilities during onboarding period"
      },
      {
        title: "Company Orientation Presentation",
        description: "Attend company overview presentation covering culture, values, and policies",
        category: "orientation",
        priority: "high",
        assigned_to_role: "hr",
        due_day_offset: 1,
        time_estimate: 2,
        instructions: "Present company history, mission, values, organizational structure, and key policies"
      },
      {
        title: "Review Employee Handbook",
        description: "Read and acknowledge receipt of employee handbook",
        category: "policy",
        priority: "medium",
        assigned_to_role: "employee",
        due_day_offset: 3,
        approval_required: true,
        time_estimate: 2,
        documents_required: ["Employee handbook acknowledgment form"]
      },
      {
        title: "Code of Conduct Training",
        description: "Complete code of conduct and ethics training",
        category: "compliance",
        priority: "critical",
        assigned_to_role: "employee",
        due_day_offset: 5,
        approval_required: true,
        time_estimate: 1,
        instructions: "Complete online ethics training module and pass quiz"
      },
      {
        title: "Project Assignment and Briefing",
        description: "Assign initial project and provide detailed briefing",
        category: "work",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 3,
        time_estimate: 2,
        instructions: "Explain project scope, timeline, team members, and expected deliverables"
      },
      {
        title: "Development Tools Training",
        description: "Training on company-specific development tools and processes",
        category: "training",
        priority: "high",
        assigned_to_role: "buddy",
        due_day_offset: 5,
        dependencies: [3], // Depends on dev environment setup
        time_estimate: 4,
        instructions: "Hands-on training with deployment tools, testing frameworks, and code review process"
      },
      {
        title: "First Code Review",
        description: "Submit first code for review to understand process",
        category: "work",
        priority: "medium",
        assigned_to_role: "employee",
        due_day_offset: 7,
        dependencies: [12], // Depends on tools training
        time_estimate: 3,
        instructions: "Complete small feature or bug fix and submit for code review"
      },
      {
        title: "One-Week Check-in Meeting",
        description: "Feedback session with manager after first week",
        category: "feedback",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 7,
        time_estimate: 1,
        instructions: "Discuss progress, address concerns, gather feedback on onboarding experience"
      },
      {
        title: "Complete Benefits Enrollment",
        description: "Finalize all benefits selections and enrollment",
        category: "benefits",
        priority: "critical",
        assigned_to_role: "employee",
        due_day_offset: 10,
        approval_required: true,
        time_estimate: 1,
        documents_required: ["Benefits enrollment forms", "Dependent information"]
      },
      {
        title: "Two-Week Onboarding Review",
        description: "Comprehensive review of onboarding progress and next steps",
        category: "feedback",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 14,
        time_estimate: 1.5,
        instructions: "Review completed tasks, assess integration, plan for remainder of probationary period"
      }
    ],
    checklist_items: [
      {
        title: "Received company laptop and equipment",
        category: "equipment",
        required: true
      },
      {
        title: "Access to all necessary systems and applications",
        category: "access",
        required: true
      },
      {
        title: "Completed mandatory training modules",
        category: "training",
        required: true
      },
      {
        title: "Met with all key team members",
        category: "social",
        required: true
      },
      {
        title: "Familiar with company policies and procedures",
        category: "policy",
        required: true
      }
    ]
  },
  {
    title: "Sales Team Onboarding",
    description: "Comprehensive onboarding plan for sales representatives and account managers",
    department_id: "sales",
    job_role: "sales",
    is_default: true,
    duration_days: 21,
    task_templates: [
      {
        title: "Complete Employment Documentation",
        description: "Complete I-9, tax forms, and other required employment paperwork",
        category: "legal",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 0,
        approval_required: true,
        time_estimate: 1
      },
      {
        title: "CRM System Setup and Training",
        description: "Setup CRM access and complete comprehensive training",
        category: "training",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 1,
        time_estimate: 4,
        instructions: "Create Salesforce account, configure user permissions, and complete CRM training"
      },
      {
        title: "Product Knowledge Training",
        description: "Comprehensive training on all company products and services",
        category: "training",
        priority: "critical",
        assigned_to_role: "manager",
        due_day_offset: 3,
        time_estimate: 8,
        instructions: "Multi-day product training covering features, benefits, pricing, and competitive positioning"
      },
      {
        title: "Sales Process and Methodology Training",
        description: "Learn company sales process, methodologies, and best practices",
        category: "training",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 5,
        dependencies: [2], // After product training
        time_estimate: 6,
        instructions: "Training on sales stages, qualification criteria, and closing techniques"
      },
      {
        title: "Territory Assignment and Planning",
        description: "Assign sales territory and develop territory plan",
        category: "planning",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 7,
        time_estimate: 3,
        instructions: "Review assigned accounts, develop territory strategy, set initial targets"
      },
      {
        title: "Customer Database Review",
        description: "Review existing customer database and account histories",
        category: "research",
        priority: "medium",
        assigned_to_role: "employee",
        due_day_offset: 10,
        dependencies: [1, 4], // After CRM training and territory assignment
        time_estimate: 8,
        instructions: "Research key accounts, review interaction history, identify opportunities"
      },
      {
        title: "Shadow Experienced Sales Rep",
        description: "Observe experienced sales representative on customer calls",
        category: "training",
        priority: "high",
        assigned_to_role: "buddy",
        due_day_offset: 10,
        time_estimate: 16,
        instructions: "Attend customer meetings, observe sales techniques, learn customer interaction skills"
      },
      {
        title: "First Customer Presentation",
        description: "Deliver first customer presentation with manager support",
        category: "work",
        priority: "high",
        assigned_to_role: "employee",
        due_day_offset: 14,
        dependencies: [6], // After shadowing
        time_estimate: 2,
        instructions: "Prepare and deliver presentation to existing customer with manager present"
      },
      {
        title: "Sales Goal Setting",
        description: "Set initial sales targets and KPIs for first quarter",
        category: "planning",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 14,
        time_estimate: 1,
        instructions: "Establish realistic but challenging goals for first 90 days"
      },
      {
        title: "Three-Week Performance Review",
        description: "Comprehensive review of onboarding progress and performance",
        category: "feedback",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 21,
        time_estimate: 1.5,
        instructions: "Assess progress, provide feedback, plan for ongoing development"
      }
    ],
    checklist_items: [
      {
        title: "CRM system access and proficiency",
        category: "systems",
        required: true
      },
      {
        title: "Product knowledge certification",
        category: "training",
        required: true
      },
      {
        title: "Completed customer shadowing hours",
        category: "training",
        required: true
      },
      {
        title: "First customer presentation delivered",
        category: "milestone",
        required: true
      }
    ]
  },
  {
    title: "General Employee Onboarding",
    description: "Standard onboarding plan for all new employees",
    department_id: null,
    job_role: null,
    is_default: true,
    duration_days: 7,
    task_templates: [
      {
        title: "Complete Employment Verification",
        description: "Complete I-9 form and provide required documentation",
        category: "legal",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 0,
        approval_required: true,
        time_estimate: 0.5
      },
      {
        title: "Payroll and Tax Setup",
        description: "Complete payroll enrollment and tax withholding forms",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 0,
        approval_required: true,
        time_estimate: 0.5
      },
      {
        title: "IT Account Setup",
        description: "Create email account and provide access to necessary systems",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 0,
        time_estimate: 1
      },
      {
        title: "Workspace Assignment",
        description: "Assign desk/workspace and provide necessary supplies",
        category: "facilities",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 0,
        time_estimate: 0.5
      },
      {
        title: "Company Orientation",
        description: "Attend new employee orientation session",
        category: "orientation",
        priority: "high",
        assigned_to_role: "hr",
        due_day_offset: 1,
        time_estimate: 2
      },
      {
        title: "Department Introduction",
        description: "Meet department team and key colleagues",
        category: "social",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 1,
        time_estimate: 1
      },
      {
        title: "Safety Training",
        description: "Complete workplace safety training and emergency procedures",
        category: "safety",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 2,
        approval_required: true,
        time_estimate: 1
      },
      {
        title: "Employee Handbook Review",
        description: "Read and acknowledge employee handbook",
        category: "policy",
        priority: "medium",
        assigned_to_role: "employee",
        due_day_offset: 3,
        approval_required: true,
        time_estimate: 2
      },
      {
        title: "Benefits Enrollment",
        description: "Complete benefits enrollment process",
        category: "benefits",
        priority: "high",
        assigned_to_role: "hr",
        due_day_offset: 5,
        time_estimate: 1
      },
      {
        title: "First Week Check-in",
        description: "One-on-one meeting with manager to review first week",
        category: "feedback",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: 7,
        time_estimate: 0.5
      }
    ],
    checklist_items: [
      {
        title: "All employment paperwork completed",
        category: "documentation",
        required: true
      },
      {
        title: "System access verified",
        category: "access",
        required: true
      },
      {
        title: "Workspace setup complete",
        category: "facilities",
        required: true
      },
      {
        title: "Safety training completed",
        category: "safety",
        required: true
      }
    ]
  }
] 