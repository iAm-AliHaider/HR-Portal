import { OffboardingTemplate } from '../../../packages/types/hr'

export const DEFAULT_OFFBOARDING_TEMPLATES: Partial<OffboardingTemplate>[] = [
  {
    name: "Standard Employee Resignation",
    description: "Comprehensive offboarding process for voluntary resignations",
    reason_for_leaving: "resignation",
    is_default: true,
    is_active: true,
    exit_interview_required: true,
    knowledge_transfer_required: true,
    reference_letter_provided: true,
    task_templates: [
      {
        title: "Acknowledge Resignation Letter",
        description: "Formally acknowledge receipt of resignation and confirm last working day",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 0, // Same day as resignation
        approval_required: false,
        instructions: "Send acknowledgment email confirming receipt, last day, and next steps",
        auto_assign: true
      },
      {
        title: "Schedule Exit Interview",
        description: "Schedule comprehensive exit interview with departing employee",
        category: "hr",
        priority: "high",
        assigned_to_role: "hr",
        due_day_offset: -5, // 5 days before last day
        instructions: "Schedule 60-90 minute exit interview during final week"
      },
      {
        title: "Notify Manager and Team",
        description: "Inform direct manager and immediate team of resignation",
        category: "hr",
        priority: "high",
        assigned_to_role: "hr",
        due_day_offset: 1,
        instructions: "Coordinate with manager on communication strategy and timing"
      },
      {
        title: "Create Knowledge Transfer Plan",
        description: "Develop comprehensive plan for knowledge transfer and documentation",
        category: "manager",
        priority: "critical",
        assigned_to_role: "manager",
        due_day_offset: 2,
        instructions: "Identify key knowledge areas, select transfer recipients, create timeline"
      },
      {
        title: "Document Current Projects and Responsibilities",
        description: "Create detailed documentation of all current projects and ongoing responsibilities",
        category: "employee",
        priority: "critical",
        assigned_to_role: "employee",
        due_day_offset: -10, // 10 days before last day
        dependencies: [3], // After knowledge transfer plan
        documents_required: ["Project status reports", "Process documentation", "Contact lists"],
        instructions: "Document all active projects, deadlines, contacts, and handover requirements"
      },
      {
        title: "Identify Project Successors",
        description: "Assign new owners for all projects and responsibilities",
        category: "manager",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: -8,
        dependencies: [4], // After documentation
        instructions: "Assign new project owners and communicate transitions"
      },
      {
        title: "Conduct Knowledge Transfer Sessions",
        description: "Hold detailed handover meetings with project successors",
        category: "employee",
        priority: "critical",
        assigned_to_role: "employee",
        due_day_offset: -7,
        dependencies: [5], // After successors identified
        instructions: "Conduct thorough handover sessions with each project successor"
      },
      {
        title: "Calculate Final Pay and Benefits",
        description: "Calculate final paycheck including unused vacation and benefits",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: -5,
        approval_required: true,
        instructions: "Calculate final pay, vacation payout, and provide benefits continuation info"
      },
      {
        title: "Prepare Equipment Return Checklist",
        description: "Create list of all company equipment to be returned",
        category: "it",
        priority: "high",
        assigned_to_role: "it",
        due_day_offset: -5,
        instructions: "List all assigned equipment: laptop, phone, access cards, keys, etc."
      },
      {
        title: "Remove System Access (Preparation)",
        description: "Prepare system access removal plan without executing",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: -3,
        instructions: "Prepare access removal checklist - DO NOT EXECUTE until last day"
      },
      {
        title: "Conduct Exit Interview",
        description: "Complete comprehensive exit interview",
        category: "hr",
        priority: "high",
        assigned_to_role: "hr",
        due_day_offset: -2,
        dependencies: [1], // After scheduling
        approval_required: false,
        instructions: "Conduct structured exit interview and document feedback"
      },
      {
        title: "Announce Departure to Broader Team",
        description: "Communicate departure to relevant departments and stakeholders",
        category: "manager",
        priority: "medium",
        assigned_to_role: "manager",
        due_day_offset: -3,
        instructions: "Send professional announcement to relevant teams and external contacts"
      },
      {
        title: "Client Transition Communications",
        description: "Notify clients and transition account management",
        category: "manager",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: -5,
        dependencies: [5], // After successors identified
        instructions: "Coordinate client communications and introduce new points of contact"
      },
      {
        title: "Update Organization Chart",
        description: "Update organizational charts and contact directories",
        category: "hr",
        priority: "medium",
        assigned_to_role: "hr",
        due_day_offset: -1,
        instructions: "Remove from org charts, update directories, reassign responsibilities"
      },
      {
        title: "Collect Company Equipment",
        description: "Collect all company equipment and property",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 0, // Last day
        dependencies: [8], // After checklist prepared
        instructions: "Collect and verify return of all company equipment"
      },
      {
        title: "Execute System Access Removal",
        description: "Remove all system access and deactivate accounts",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 0, // Last day
        dependencies: [9], // After preparation
        instructions: "Deactivate all accounts, remove access permissions, update security groups"
      },
      {
        title: "Final Payroll Processing",
        description: "Process final paycheck and benefits",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 1, // Day after last day
        dependencies: [7], // After calculation
        approval_required: true,
        instructions: "Process final pay and mail COBRA/benefits information"
      },
      {
        title: "Archive Employee Records",
        description: "Archive personnel file and update HRIS system",
        category: "hr",
        priority: "medium",
        assigned_to_role: "hr",
        due_day_offset: 3,
        instructions: "Archive personnel file, update HRIS status, retain records per policy"
      },
      {
        title: "Prepare Reference Letter",
        description: "Prepare standard reference letter for future employment verification",
        category: "hr",
        priority: "low",
        assigned_to_role: "hr",
        due_day_offset: 5,
        dependencies: [10], // After exit interview
        instructions: "Prepare neutral reference letter based on performance and exit interview"
      }
    ],
    checklist_items: [
      {
        title: "All company equipment returned",
        category: "equipment",
        required: true
      },
      {
        title: "System access completely removed",
        category: "security",
        required: true
      },
      {
        title: "Knowledge transfer completed",
        category: "transition",
        required: true
      },
      {
        title: "Exit interview conducted",
        category: "hr",
        required: true
      },
      {
        title: "Final pay processed",
        category: "payroll",
        required: true
      },
      {
        title: "COBRA information provided",
        category: "benefits",
        required: false
      }
    ]
  },
  {
    name: "Engineering Role Offboarding",
    description: "Specialized offboarding for software engineers and technical roles",
    department_id: "engineering",
    job_role: "engineer",
    reason_for_leaving: "resignation",
    is_default: false,
    is_active: true,
    exit_interview_required: true,
    knowledge_transfer_required: true,
    reference_letter_provided: true,
    task_templates: [
      {
        title: "Code Repository Access Review",
        description: "Review and document all code repositories and access permissions",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: -7,
        instructions: "Document all GitHub, GitLab, and internal repository access"
      },
      {
        title: "Technical Documentation Handover",
        description: "Complete technical documentation for all systems and projects",
        category: "employee",
        priority: "critical",
        assigned_to_role: "employee",
        due_day_offset: -10,
        documents_required: ["Architecture diagrams", "API documentation", "Deployment guides"],
        instructions: "Document system architecture, APIs, deployment processes, and known issues"
      },
      {
        title: "Code Review and Knowledge Transfer",
        description: "Conduct code reviews and technical knowledge transfer sessions",
        category: "employee",
        priority: "critical",
        assigned_to_role: "employee",
        due_day_offset: -5,
        dependencies: [1], // After technical documentation
        instructions: "Review critical code sections with team members, explain complex implementations"
      },
      {
        title: "Production Access Removal Planning",
        description: "Plan removal of production system access and privileges",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: -3,
        instructions: "Plan removal of production database, server, and deployment access"
      },
      {
        title: "Development Environment Cleanup",
        description: "Clean up development environments and personal code",
        category: "employee",
        priority: "medium",
        assigned_to_role: "employee",
        due_day_offset: -2,
        instructions: "Remove personal scripts, clean up development environments, commit pending work"
      },
      {
        title: "Security Key and Certificate Handover",
        description: "Transfer or revoke security keys, certificates, and tokens",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 0,
        instructions: "Revoke API keys, SSL certificates, SSH keys, and authentication tokens"
      },
      {
        title: "Technical Mentor Assignment",
        description: "Assign technical mentors for ongoing support of transferred projects",
        category: "manager",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: -5,
        instructions: "Identify team members to serve as ongoing technical contacts for transferred work"
      }
    ],
    checklist_items: [
      {
        title: "Technical documentation completed",
        category: "documentation",
        required: true
      },
      {
        title: "Code repositories access removed",
        category: "security",
        required: true
      },
      {
        title: "Production access revoked",
        category: "security",
        required: true
      },
      {
        title: "API keys and certificates revoked",
        category: "security",
        required: true
      },
      {
        title: "Knowledge transfer sessions completed",
        category: "transition",
        required: true
      }
    ]
  },
  {
    name: "Management Role Offboarding",
    description: "Specialized offboarding process for managers and team leaders",
    department_id: null,
    job_role: "manager",
    reason_for_leaving: "resignation",
    is_default: false,
    is_active: true,
    exit_interview_required: true,
    knowledge_transfer_required: true,
    reference_letter_provided: true,
    task_templates: [
      {
        title: "Team Transition Planning",
        description: "Develop comprehensive plan for team leadership transition",
        category: "manager",
        priority: "critical",
        assigned_to_role: "manager",
        due_day_offset: -14,
        instructions: "Identify interim leadership, plan team communication, address ongoing projects"
      },
      {
        title: "Direct Report Transition Meetings",
        description: "Hold individual meetings with each direct report about transition",
        category: "manager",
        priority: "critical",
        assigned_to_role: "manager",
        due_day_offset: -10,
        dependencies: [0], // After transition planning
        instructions: "Meet with each team member individually to discuss transition and address concerns"
      },
      {
        title: "Performance Review Documentation",
        description: "Complete performance reviews and development plans for all direct reports",
        category: "manager",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: -12,
        documents_required: ["Performance reviews", "Development plans", "Goal tracking"],
        instructions: "Ensure all team member performance documentation is current and comprehensive"
      },
      {
        title: "Budget and Resource Handover",
        description: "Transfer budget responsibility and resource management",
        category: "manager",
        priority: "critical",
        assigned_to_role: "manager",
        due_day_offset: -7,
        instructions: "Handover budget management, vendor relationships, and resource allocation responsibilities"
      },
      {
        title: "Strategic Project Briefing",
        description: "Brief successor on strategic initiatives and long-term projects",
        category: "manager",
        priority: "critical",
        assigned_to_role: "manager",
        due_day_offset: -5,
        instructions: "Provide detailed briefing on strategic initiatives, project roadmaps, and key objectives"
      },
      {
        title: "Stakeholder Communication",
        description: "Notify key stakeholders and introduce new leadership",
        category: "manager",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: -3,
        dependencies: [4], // After successor briefing
        instructions: "Communicate with key internal and external stakeholders about leadership transition"
      },
      {
        title: "Team Announcement and Q&A",
        description: "Hold team meeting to announce departure and address questions",
        category: "manager",
        priority: "high",
        assigned_to_role: "manager",
        due_day_offset: -2,
        instructions: "Conduct team meeting to announce departure, introduce interim leadership, and address concerns"
      },
      {
        title: "Management System Access Transfer",
        description: "Transfer management system access and administrative permissions",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 0,
        instructions: "Transfer HRIS access, performance management systems, and administrative permissions"
      }
    ],
    checklist_items: [
      {
        title: "Team transition plan executed",
        category: "transition",
        required: true
      },
      {
        title: "All direct reports briefed",
        category: "team",
        required: true
      },
      {
        title: "Performance documentation current",
        category: "documentation",
        required: true
      },
      {
        title: "Budget and resources transferred",
        category: "operations",
        required: true
      },
      {
        title: "Stakeholders notified",
        category: "communication",
        required: true
      }
    ]
  },
  {
    name: "Involuntary Termination",
    description: "Structured process for involuntary terminations and dismissals",
    reason_for_leaving: "termination",
    is_default: false,
    is_active: true,
    exit_interview_required: false,
    knowledge_transfer_required: false,
    reference_letter_provided: false,
    task_templates: [
      {
        title: "Legal Review and Documentation",
        description: "Review termination documentation with legal counsel",
        category: "legal",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: -1,
        approval_required: true,
        instructions: "Ensure all documentation is complete and compliant with employment law"
      },
      {
        title: "Security Preparation",
        description: "Prepare immediate security measures for termination day",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 0,
        instructions: "Prepare to immediately disable all access upon termination notification"
      },
      {
        title: "Termination Meeting",
        description: "Conduct termination meeting with employee",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 0,
        instructions: "Conduct professional termination meeting with witness present"
      },
      {
        title: "Immediate Access Revocation",
        description: "Immediately revoke all system access and permissions",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 0,
        dependencies: [2], // After termination meeting
        auto_assign: true,
        instructions: "Immediately disable all accounts, revoke access cards, and secure systems"
      },
      {
        title: "Equipment Collection",
        description: "Collect all company equipment and property",
        category: "it",
        priority: "critical",
        assigned_to_role: "it",
        due_day_offset: 0,
        instructions: "Collect laptop, phone, keys, access cards, and any other company property"
      },
      {
        title: "Final Pay Calculation",
        description: "Calculate final pay according to legal requirements",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: 1,
        approval_required: true,
        instructions: "Calculate final pay per state law, process within required timeframe"
      },
      {
        title: "Benefits Termination Notice",
        description: "Provide COBRA and benefits termination information",
        category: "hr",
        priority: "high",
        assigned_to_role: "hr",
        due_day_offset: 3,
        instructions: "Mail COBRA election notice and benefits termination information"
      },
      {
        title: "Update Records and Systems",
        description: "Update all HR systems and employment records",
        category: "hr",
        priority: "medium",
        assigned_to_role: "hr",
        due_day_offset: 5,
        instructions: "Update HRIS, remove from directories, update organizational charts"
      }
    ],
    checklist_items: [
      {
        title: "Legal documentation complete",
        category: "legal",
        required: true
      },
      {
        title: "All access immediately revoked",
        category: "security",
        required: true
      },
      {
        title: "Equipment collected",
        category: "equipment",
        required: true
      },
      {
        title: "Final pay processed per law",
        category: "payroll",
        required: true
      },
      {
        title: "Benefits notices sent",
        category: "benefits",
        required: true
      }
    ]
  },
  {
    name: "Retirement Offboarding",
    description: "Special process for employee retirements with celebration and knowledge preservation",
    reason_for_leaving: "retirement",
    is_default: false,
    is_active: true,
    exit_interview_required: true,
    knowledge_transfer_required: true,
    reference_letter_provided: true,
    task_templates: [
      {
        title: "Retirement Benefits Consultation",
        description: "Schedule consultation with benefits specialist for retirement planning",
        category: "hr",
        priority: "critical",
        assigned_to_role: "hr",
        due_day_offset: -30,
        instructions: "Connect with benefits provider for retirement plan distribution options"
      },
      {
        title: "Legacy Project Documentation",
        description: "Document institutional knowledge and career legacy",
        category: "employee",
        priority: "high",
        assigned_to_role: "employee",
        due_day_offset: -21,
        documents_required: ["Project histories", "Institutional knowledge", "Best practices"],
        instructions: "Create comprehensive documentation of career accomplishments and knowledge"
      },
      {
        title: "Mentorship Transition",
        description: "Transition mentorship relationships and identify successors",
        category: "employee",
        priority: "high",
        assigned_to_role: "employee",
        due_day_offset: -14,
        instructions: "Transition mentorship relationships and identify team members to continue guidance"
      },
      {
        title: "Plan Retirement Celebration",
        description: "Organize retirement celebration event",
        category: "hr",
        priority: "medium",
        assigned_to_role: "hr",
        due_day_offset: -10,
        instructions: "Plan appropriate retirement celebration recognizing years of service"
      },
      {
        title: "Knowledge Preservation Video",
        description: "Record video interview preserving institutional knowledge",
        category: "hr",
        priority: "medium",
        assigned_to_role: "hr",
        due_day_offset: -7,
        instructions: "Record interview about career highlights, lessons learned, and advice for successors"
      },
      {
        title: "Retiree Contact Information",
        description: "Collect contact information for alumni network and future consultation",
        category: "hr",
        priority: "low",
        assigned_to_role: "hr",
        due_day_offset: -3,
        instructions: "Collect updated contact information and preferences for future communication"
      }
    ],
    checklist_items: [
      {
        title: "Retirement benefits consultation completed",
        category: "benefits",
        required: true
      },
      {
        title: "Legacy documentation created",
        category: "documentation",
        required: false
      },
      {
        title: "Knowledge preservation completed",
        category: "knowledge",
        required: false
      },
      {
        title: "Retirement celebration held",
        category: "celebration",
        required: false
      }
    ]
  }
] 