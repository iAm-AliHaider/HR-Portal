import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "../../lib/supabase/client";

// Mock payroll data for development
const mockPayrollData = {
  settings: {
    company_info: {
      name: "Acme Corporation",
      tax_id: "12-3456789",
      address: "123 Business Street, Tech City, TC 12345",
      payroll_frequency: "bi-weekly", // weekly, bi-weekly, monthly, semi-monthly
      fiscal_year_start: "01-01",
      default_currency: "USD",
    },
    tax_settings: {
      federal_tax: {
        enabled: true,
        rate_structure: "progressive",
        brackets: [
          { min: 0, max: 10275, rate: 10 },
          { min: 10276, max: 41775, rate: 12 },
          { min: 41776, max: 89450, rate: 22 },
          { min: 89451, max: 190750, rate: 24 },
        ],
      },
      state_tax: {
        enabled: true,
        flat_rate: 7.0,
        state: "CA",
      },
      social_security: {
        enabled: true,
        rate: 6.2,
        wage_base: 160200,
        employer_rate: 6.2,
      },
      medicare: {
        enabled: true,
        rate: 1.45,
        additional_rate: 0.9,
        additional_threshold: 200000,
        employer_rate: 1.45,
      },
      unemployment: {
        federal_rate: 0.6,
        state_rate: 3.4,
        wage_base: 7000,
      },
    },
    deduction_types: [
      {
        id: "health_insurance",
        name: "Health Insurance",
        type: "pre_tax",
        category: "benefit",
        default_amount: 285.0,
        frequency: "monthly",
        employer_contribution: 70,
        enabled: true,
      },
      {
        id: "dental_insurance",
        name: "Dental Insurance",
        type: "pre_tax",
        category: "benefit",
        default_amount: 45.0,
        frequency: "monthly",
        employer_contribution: 0,
        enabled: true,
      },
      {
        id: "retirement_401k",
        name: "401(k) Contribution",
        type: "pre_tax",
        category: "retirement",
        default_percentage: 10.0,
        max_percentage: 100,
        employer_match: 6.0,
        frequency: "per_paycheck",
        enabled: true,
      },
      {
        id: "life_insurance",
        name: "Life Insurance",
        type: "post_tax",
        category: "benefit",
        default_amount: 12.0,
        frequency: "monthly",
        enabled: true,
      },
      {
        id: "parking",
        name: "Parking Fee",
        type: "post_tax",
        category: "other",
        default_amount: 50.0,
        frequency: "monthly",
        enabled: false,
      },
    ],
    pay_schedules: [
      {
        id: "weekly",
        name: "Weekly",
        frequency: 52,
        description: "Every Friday",
      },
      {
        id: "bi_weekly",
        name: "Bi-Weekly",
        frequency: 26,
        description: "Every other Friday",
      },
      {
        id: "semi_monthly",
        name: "Semi-Monthly",
        frequency: 24,
        description: "15th and last day of month",
      },
      {
        id: "monthly",
        name: "Monthly",
        frequency: 12,
        description: "Last business day of month",
      },
    ],
    approval_workflow: {
      enabled: true,
      steps: [
        { role: "payroll_admin", required: true },
        { role: "finance_manager", required: true },
        { role: "hr_director", required: false },
      ],
    },
    overtime_rules: {
      enabled: true,
      daily_overtime_hours: 8,
      weekly_overtime_hours: 40,
      overtime_rate_multiplier: 1.5,
      double_time_hours: 12,
      double_time_rate_multiplier: 2.0,
    },
    compliance: {
      minimum_wage: 15.0,
      state: "CA",
      workers_comp_rate: 0.75,
      disability_insurance_rate: 0.9,
      family_leave_rate: 0.5,
    },
  },
  employees: [
    {
      id: "emp-001",
      employee_id: "EMP-2024-045",
      name: "Sarah Johnson",
      position: "Senior Developer",
      department: "Engineering",
      hire_date: "2022-03-15",
      pay_type: "salary",
      pay_schedule: "bi_weekly",
      salary_amount: 95000,
      hourly_rate: null,
      overtime_eligible: false,
      pay_grade: "L5",
      tax_info: {
        filing_status: "single",
        exemptions: 1,
        additional_withholding: 0,
        tax_exempt: false,
      },
      deductions: {
        health_insurance: { enabled: true, amount: 285.0 },
        dental_insurance: { enabled: true, amount: 45.0 },
        retirement_401k: { enabled: true, percentage: 10.0 },
        life_insurance: { enabled: true, amount: 12.0 },
      },
      banking_info: {
        routing_number: "123456789",
        account_number: "****5678",
        account_type: "checking",
        direct_deposit: true,
      },
      status: "active",
    },
    {
      id: "emp-002",
      employee_id: "EMP-2024-032",
      name: "Michael Chen",
      position: "Sales Manager",
      department: "Sales",
      hire_date: "2021-08-20",
      pay_type: "salary_commission",
      pay_schedule: "bi_weekly",
      salary_amount: 85000,
      commission_rate: 2.5,
      hourly_rate: null,
      overtime_eligible: false,
      pay_grade: "M3",
      tax_info: {
        filing_status: "married",
        exemptions: 3,
        additional_withholding: 50,
        tax_exempt: false,
      },
      deductions: {
        health_insurance: { enabled: true, amount: 285.0 },
        dental_insurance: { enabled: true, amount: 45.0 },
        retirement_401k: { enabled: true, percentage: 8.0 },
        life_insurance: { enabled: true, amount: 12.0 },
      },
      banking_info: {
        routing_number: "987654321",
        account_number: "****1234",
        account_type: "checking",
        direct_deposit: true,
      },
      status: "active",
    },
  ],
  payroll_periods: [
    {
      id: "period-001",
      period_name: "June 2024 - Period 1",
      start_date: "2024-06-01",
      end_date: "2024-06-14",
      pay_date: "2024-06-21",
      status: "processing",
      total_gross: 485600,
      total_net: 364200,
      total_deductions: 121400,
      total_taxes: 97120,
      employee_count: 247,
      processing_progress: 85,
      created_by: "payroll_admin",
      approved_by: null,
      processed_at: null,
    },
    {
      id: "period-002",
      period_name: "May 2024 - Period 2",
      start_date: "2024-05-16",
      end_date: "2024-05-31",
      pay_date: "2024-06-07",
      status: "completed",
      total_gross: 478200,
      total_net: 358650,
      total_deductions: 119550,
      total_taxes: 95640,
      employee_count: 245,
      processing_progress: 100,
      created_by: "payroll_admin",
      approved_by: "finance_manager",
      processed_at: "2024-06-07T09:00:00Z",
    },
  ],
  pay_stubs: [
    {
      id: "stub-001",
      employee_id: "emp-001",
      payroll_period_id: "period-002",
      pay_date: "2024-06-07",
      earnings: {
        regular_hours: 80,
        overtime_hours: 4,
        regular_pay: 3653.85,
        overtime_pay: 274.04,
        bonus: 500.0,
        commission: 0,
        total_gross: 4427.89,
      },
      deductions: {
        federal_tax: 796.14,
        state_tax: 309.95,
        social_security: 274.53,
        medicare: 64.2,
        health_insurance: 142.5,
        dental_insurance: 22.5,
        retirement_401k: 384.62,
        life_insurance: 6.0,
        total_deductions: 2000.44,
      },
      employer_contributions: {
        social_security: 274.53,
        medicare: 64.2,
        unemployment: 26.57,
        workers_comp: 33.21,
        health_insurance: 199.5,
      },
      net_pay: 2427.45,
      ytd_totals: {
        gross: 53133.34,
        federal_tax: 9553.61,
        state_tax: 3719.33,
        social_security: 3294.27,
        medicare: 770.43,
        net_pay: 29115.4,
      },
    },
  ],
  reports: [
    {
      id: "report-001",
      name: "Payroll Summary Report",
      type: "summary",
      period: "June 2024",
      generated_date: "2024-06-30",
      generated_by: "Payroll Administrator",
      status: "ready",
      file_path: "/reports/payroll-summary-june-2024.pdf",
      file_size: "2.4 MB",
    },
    {
      id: "report-002",
      name: "Tax Liability Report",
      type: "tax",
      period: "Q2 2024",
      generated_date: "2024-06-30",
      generated_by: "Finance Team",
      status: "ready",
      file_path: "/reports/tax-liability-q2-2024.pdf",
      file_size: "1.8 MB",
    },
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET":
        return await handleGet(req, res);
      case "POST":
        return await handlePost(req, res);
      case "PUT":
        return await handlePut(req, res);
      case "DELETE":
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Payroll API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { type, id, employee_id, period_id } = req.query;

  switch (type) {
    case "settings":
      return res.status(200).json({
        success: true,
        data: mockPayrollData.settings,
      });

    case "employees":
      if (id) {
        const employee = mockPayrollData.employees.find((emp) => emp.id === id);
        if (!employee) {
          return res.status(404).json({ error: "Employee not found" });
        }
        return res.status(200).json({
          success: true,
          data: employee,
        });
      }
      return res.status(200).json({
        success: true,
        data: mockPayrollData.employees,
      });

    case "periods":
      if (id) {
        const period = mockPayrollData.payroll_periods.find((p) => p.id === id);
        if (!period) {
          return res.status(404).json({ error: "Payroll period not found" });
        }
        return res.status(200).json({
          success: true,
          data: period,
        });
      }
      return res.status(200).json({
        success: true,
        data: mockPayrollData.payroll_periods,
      });

    case "paystubs":
      let payStubs = mockPayrollData.pay_stubs;

      if (employee_id) {
        payStubs = payStubs.filter((stub) => stub.employee_id === employee_id);
      }
      if (period_id) {
        payStubs = payStubs.filter(
          (stub) => stub.payroll_period_id === period_id,
        );
      }
      if (id) {
        const payStub = payStubs.find((stub) => stub.id === id);
        if (!payStub) {
          return res.status(404).json({ error: "Pay stub not found" });
        }
        return res.status(200).json({
          success: true,
          data: payStub,
        });
      }

      return res.status(200).json({
        success: true,
        data: payStubs,
      });

    case "reports":
      return res.status(200).json({
        success: true,
        data: mockPayrollData.reports,
      });

    case "analytics":
      return res.status(200).json({
        success: true,
        data: {
          current_period: {
            total_gross: 485600,
            total_net: 364200,
            total_employees: 247,
            processing_status: 85,
          },
          year_to_date: {
            total_gross: 2914560,
            total_net: 2185320,
            total_taxes: 729240,
            average_salary: 95120,
          },
          trends: [
            { month: "Jan", gross: 478200 },
            { month: "Feb", gross: 481500 },
            { month: "Mar", gross: 485600 },
            { month: "Apr", gross: 489200 },
            { month: "May", gross: 492800 },
            { month: "Jun", gross: 496400 },
          ],
        },
      });

    default:
      return res.status(200).json({
        success: true,
        data: {
          periods: mockPayrollData.payroll_periods,
          employees: mockPayrollData.employees.length,
          settings: mockPayrollData.settings,
        },
      });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  const data = req.body;

  switch (type) {
    case "process-payroll":
      // Simulate payroll processing
      const newPeriod = {
        id: `period-${Date.now()}`,
        period_name: data.period_name,
        start_date: data.start_date,
        end_date: data.end_date,
        pay_date: data.pay_date,
        status: "processing",
        total_gross: 0,
        total_net: 0,
        total_deductions: 0,
        total_taxes: 0,
        employee_count: data.employee_count || 0,
        processing_progress: 0,
        created_by: "payroll_admin",
        approved_by: null,
        processed_at: null,
      };

      return res.status(201).json({
        success: true,
        message: "Payroll processing started",
        data: newPeriod,
      });

    case "employee-payroll":
      // Add/update employee payroll information
      const employeePayroll = {
        id: `emp-${Date.now()}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return res.status(201).json({
        success: true,
        message: "Employee payroll information created",
        data: employeePayroll,
      });

    case "generate-paystub":
      // Generate pay stub for employee
      const payStub = {
        id: `stub-${Date.now()}`,
        employee_id: data.employee_id,
        payroll_period_id: data.period_id,
        generated_at: new Date().toISOString(),
        status: "generated",
      };

      return res.status(201).json({
        success: true,
        message: "Pay stub generated successfully",
        data: payStub,
      });

    case "generate-report":
      // Generate payroll report
      const report = {
        id: `report-${Date.now()}`,
        name: data.name,
        type: data.type,
        period: data.period,
        generated_date: new Date().toISOString(),
        generated_by: data.generated_by || "System",
        status: "generating",
        file_path: null,
        file_size: null,
      };

      return res.status(201).json({
        success: true,
        message: "Report generation started",
        data: report,
      });

    default:
      return res.status(400).json({
        error: "Invalid operation type",
      });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { type, id } = req.query;
  const data = req.body;

  switch (type) {
    case "settings":
      // Update payroll settings
      return res.status(200).json({
        success: true,
        message: "Payroll settings updated successfully",
        data: { ...mockPayrollData.settings, ...data },
      });

    case "employee":
      // Update employee payroll information
      if (!id) {
        return res.status(400).json({ error: "Employee ID required" });
      }

      return res.status(200).json({
        success: true,
        message: "Employee payroll information updated",
        data: { id, ...data, updated_at: new Date().toISOString() },
      });

    case "approve-payroll":
      // Approve payroll period
      if (!id) {
        return res.status(400).json({ error: "Payroll period ID required" });
      }

      return res.status(200).json({
        success: true,
        message: "Payroll period approved",
        data: {
          id,
          status: "approved",
          approved_by: data.approved_by,
          approved_at: new Date().toISOString(),
        },
      });

    default:
      return res.status(400).json({
        error: "Invalid operation type",
      });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { type, id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID required for deletion" });
  }

  switch (type) {
    case "employee":
      return res.status(200).json({
        success: true,
        message: "Employee payroll information deleted",
      });

    case "period":
      return res.status(200).json({
        success: true,
        message: "Payroll period deleted",
      });

    default:
      return res.status(400).json({
        error: "Invalid operation type",
      });
  }
}
