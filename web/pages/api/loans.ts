import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "../../lib/supabase/client";
import { emailService } from "../../services/emailService";

// Mock data for development/fallback
const mockLoanApplications = [
  {
    id: "LN-2024-001",
    employee_id: "EMP-001",
    employee_name: "John Smith",
    employee_email: "john.smith@company.com",
    loan_type: "Personal Loan",
    amount: 50000,
    purpose: "Home renovation",
    term_months: 24,
    interest_rate: 9.5,
    status: "pending",
    application_date: "2024-01-15",
    monthly_payment: 2250.45,
    documents: ["salary_slip", "bank_statement"],
    approval_notes: "",
    disbursement_date: null,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "LN-2024-002",
    employee_id: "EMP-002",
    employee_name: "Sarah Johnson",
    employee_email: "sarah.johnson@company.com",
    loan_type: "Education Loan",
    amount: 100000,
    purpose: "Masters degree program",
    term_months: 60,
    interest_rate: 8.5,
    status: "approved",
    application_date: "2024-01-10",
    monthly_payment: 2055.5,
    documents: ["admission_letter", "fee_structure", "salary_slip"],
    approval_notes: "Approved for full amount",
    disbursement_date: "2024-01-20",
    created_at: "2024-01-10T14:30:00Z",
  },
];

const mockLoanSettings = {
  loan_types: [
    {
      id: "personal",
      name: "Personal Loan",
      min_amount: 10000,
      max_amount: 200000,
      min_term_months: 6,
      max_term_months: 60,
      interest_rate_min: 8.5,
      interest_rate_max: 12.0,
      eligibility_criteria: "Minimum 1 year employment",
      required_documents: ["salary_slip", "bank_statement", "id_proof"],
    },
    {
      id: "education",
      name: "Education Loan",
      min_amount: 25000,
      max_amount: 500000,
      min_term_months: 12,
      max_term_months: 120,
      interest_rate_min: 7.5,
      interest_rate_max: 9.5,
      eligibility_criteria: "Minimum 2 years employment",
      required_documents: [
        "admission_letter",
        "fee_structure",
        "salary_slip",
        "guarantor_details",
      ],
    },
    {
      id: "emergency",
      name: "Emergency Loan",
      min_amount: 5000,
      max_amount: 50000,
      min_term_months: 3,
      max_term_months: 24,
      interest_rate_min: 6.0,
      interest_rate_max: 8.0,
      eligibility_criteria: "All employees eligible",
      required_documents: ["emergency_proof", "salary_slip"],
    },
  ],
  global_settings: {
    max_active_loans_per_employee: 2,
    min_credit_score: 650,
    grace_period_days: 7,
    late_fee_percentage: 2.0,
    prepayment_penalty: 0,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req;

  try {
    switch (method) {
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
    console.error("Loan API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { type, id, employee_id } = req.query;

  switch (type) {
    case "applications":
      return await getLoanApplications(req, res);
    case "repayments":
      return await getRepaymentSchedule(req, res);
    case "settings":
      return await getLoanSettings(req, res);
    case "analytics":
      return await getLoanAnalytics(req, res);
    case "employee-loans":
      return await getEmployeeLoans(req, res);
    default:
      return await getLoanApplications(req, res);
  }
}

async function getLoanApplications(req: NextApiRequest, res: NextApiResponse) {
  const { status, employee_id, limit = 50 } = req.query;

  try {
    let query = supabase
      .from("loan_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Number(limit));

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (employee_id) {
      query = query.eq("employee_id", employee_id);
    }

    const { data, error } = await query;

    if (error) {
      console.log("Database query failed, using mock data");
      let filteredMockData = [...mockLoanApplications];

      if (status && status !== "all") {
        filteredMockData = filteredMockData.filter(
          (app) => app.status === status,
        );
      }

      if (employee_id) {
        filteredMockData = filteredMockData.filter(
          (app) => app.employee_id === employee_id,
        );
      }

      return res.status(200).json(filteredMockData);
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    return res.status(200).json(mockLoanApplications);
  }
}

async function getRepaymentSchedule(req: NextApiRequest, res: NextApiResponse) {
  const { loan_id, employee_id } = req.query;

  try {
    let query = supabase
      .from("loan_repayments")
      .select(
        `
        *,
        loan_applications!inner(*)
      `,
      )
      .order("due_date", { ascending: true });

    if (loan_id) {
      query = query.eq("loan_id", loan_id);
    }

    if (employee_id) {
      query = query.eq("loan_applications.employee_id", employee_id);
    }

    const { data, error } = await query;

    if (error) {
      // Mock repayment schedule
      const mockRepayments = [
        {
          id: "RPY-001",
          loan_id: "LN-2024-001",
          installment_number: 1,
          due_date: "2024-02-15",
          amount: 2250.45,
          principal: 1834.12,
          interest: 416.33,
          status: "paid",
          paid_date: "2024-02-14",
          late_fee: 0,
        },
        {
          id: "RPY-002",
          loan_id: "LN-2024-001",
          installment_number: 2,
          due_date: "2024-03-15",
          amount: 2250.45,
          principal: 1848.72,
          interest: 401.73,
          status: "pending",
          paid_date: null,
          late_fee: 0,
        },
      ];
      return res.status(200).json(mockRepayments);
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error("Error fetching repayment schedule:", error);
    return res.status(200).json([]);
  }
}

async function getLoanSettings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase
      .from("loan_settings")
      .select("*")
      .single();

    if (error) {
      return res.status(200).json(mockLoanSettings);
    }

    return res.status(200).json(data || mockLoanSettings);
  } catch (error) {
    console.error("Error fetching loan settings:", error);
    return res.status(200).json(mockLoanSettings);
  }
}

async function getLoanAnalytics(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Mock analytics data
    const analytics = {
      total_applications: 156,
      pending_applications: 12,
      approved_applications: 128,
      rejected_applications: 16,
      total_disbursed: 12500000,
      total_outstanding: 8750000,
      monthly_collections: 1200000,
      default_rate: 2.3,
      average_loan_amount: 80128,
      popular_loan_types: [
        { type: "Personal Loan", count: 68, percentage: 43.6 },
        { type: "Education Loan", count: 45, percentage: 28.8 },
        { type: "Emergency Loan", count: 43, percentage: 27.6 },
      ],
      monthly_trends: [
        {
          month: "Jan",
          applications: 28,
          disbursements: 18,
          collections: 1100000,
        },
        {
          month: "Feb",
          applications: 32,
          disbursements: 22,
          collections: 1150000,
        },
        {
          month: "Mar",
          applications: 35,
          disbursements: 25,
          collections: 1200000,
        },
      ],
    };

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching loan analytics:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

async function getEmployeeLoans(req: NextApiRequest, res: NextApiResponse) {
  const { employee_id } = req.query;

  if (!employee_id) {
    return res.status(400).json({ error: "Employee ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("loan_applications")
      .select(
        `
        *,
        loan_repayments(*)
      `,
      )
      .eq("employee_id", employee_id)
      .eq("status", "approved");

    if (error) {
      // Mock employee loans
      const mockEmployeeLoans = mockLoanApplications.filter(
        (loan) =>
          loan.employee_id === employee_id && loan.status === "approved",
      );
      return res.status(200).json(mockEmployeeLoans);
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error("Error fetching employee loans:", error);
    return res.status(200).json([]);
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  switch (type) {
    case "apply":
      return await createLoanApplication(req, res);
    case "approve":
      return await approveLoanApplication(req, res);
    case "reject":
      return await rejectLoanApplication(req, res);
    case "disburse":
      return await disburseLoan(req, res);
    case "payment":
      return await recordPayment(req, res);
    default:
      return await createLoanApplication(req, res);
  }
}

async function createLoanApplication(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    employee_id,
    employee_name,
    employee_email,
    loan_type,
    amount,
    purpose,
    term_months,
    documents,
  } = req.body;

  try {
    // Calculate interest rate and monthly payment based on loan type
    const loanTypeSettings = mockLoanSettings.loan_types.find(
      (lt) => lt.id === loan_type,
    );
    if (!loanTypeSettings) {
      return res.status(400).json({ error: "Invalid loan type" });
    }

    const interest_rate =
      (loanTypeSettings.interest_rate_min +
        loanTypeSettings.interest_rate_max) /
      2;
    const monthly_rate = interest_rate / 100 / 12;
    const num_payments = term_months;
    const monthly_payment =
      (amount * monthly_rate * Math.pow(1 + monthly_rate, num_payments)) /
      (Math.pow(1 + monthly_rate, num_payments) - 1);

    const loanApplication = {
      id: `LN-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      employee_id,
      employee_name,
      employee_email,
      loan_type: loanTypeSettings.name,
      amount,
      purpose,
      term_months,
      interest_rate,
      monthly_payment: Math.round(monthly_payment * 100) / 100,
      status: "pending",
      application_date: new Date().toISOString().split("T")[0],
      documents: documents || [],
      created_at: new Date().toISOString(),
    };

    // Try to save to database
    const { data, error } = await supabase
      .from("loan_applications")
      .insert(loanApplication)
      .select()
      .single();

    if (error) {
      console.log("Database insert failed, returning mock data");
      // Send notification emails
      try {
        await emailService.sendEmail({
          to: "hr@company.com",
          template: "loan_application_notification",
          data: {
            employeeName: employee_name,
            loanType: loanTypeSettings.name,
            amount: amount,
            applicationId: loanApplication.id,
          },
        });

        await emailService.sendEmail({
          to: employee_email,
          template: "loan_application_confirmation",
          data: {
            employeeName: employee_name,
            loanType: loanTypeSettings.name,
            amount: amount,
            applicationId: loanApplication.id,
          },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }

      return res.status(201).json(loanApplication);
    }

    // Send notification emails
    try {
      await emailService.sendEmail({
        to: "hr@company.com",
        template: "loan_application_notification",
        data: {
          employeeName: employee_name,
          loanType: loanTypeSettings.name,
          amount: amount,
          applicationId: data.id,
        },
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error creating loan application:", error);
    return res.status(500).json({ error: "Failed to create loan application" });
  }
}

async function approveLoanApplication(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { loan_id, approved_amount, interest_rate, notes, approver_id } =
    req.body;

  try {
    const { data, error } = await supabase
      .from("loan_applications")
      .update({
        status: "approved",
        approved_amount: approved_amount,
        interest_rate: interest_rate,
        approval_notes: notes,
        approver_id: approver_id,
        approved_date: new Date().toISOString(),
      })
      .eq("id", loan_id)
      .select()
      .single();

    if (error) {
      console.log("Database update failed");
      return res.status(500).json({ error: "Failed to approve loan" });
    }

    // Send approval notification
    try {
      await emailService.sendEmail({
        to: data.employee_email,
        template: "loan_approval_notification",
        data: {
          employeeName: data.employee_name,
          loanType: data.loan_type,
          approvedAmount: approved_amount,
          applicationId: loan_id,
        },
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error approving loan:", error);
    return res.status(500).json({ error: "Failed to approve loan" });
  }
}

async function rejectLoanApplication(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { loan_id, rejection_reason, approver_id } = req.body;

  try {
    const { data, error } = await supabase
      .from("loan_applications")
      .update({
        status: "rejected",
        rejection_reason: rejection_reason,
        approver_id: approver_id,
        approved_date: new Date().toISOString(),
      })
      .eq("id", loan_id)
      .select()
      .single();

    if (error) {
      console.log("Database update failed");
      return res.status(500).json({ error: "Failed to reject loan" });
    }

    // Send rejection notification
    try {
      await emailService.sendEmail({
        to: data.employee_email,
        template: "loan_rejection_notification",
        data: {
          employeeName: data.employee_name,
          loanType: data.loan_type,
          rejectionReason: rejection_reason,
          applicationId: loan_id,
        },
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error rejecting loan:", error);
    return res.status(500).json({ error: "Failed to reject loan" });
  }
}

async function disburseLoan(req: NextApiRequest, res: NextApiResponse) {
  const { loan_id, disbursement_date, disbursement_amount, bank_details } =
    req.body;

  try {
    const { data, error } = await supabase
      .from("loan_applications")
      .update({
        status: "disbursed",
        disbursement_date: disbursement_date,
        disbursement_amount: disbursement_amount,
        bank_details: bank_details,
      })
      .eq("id", loan_id)
      .select()
      .single();

    if (error) {
      console.log("Database update failed");
      return res.status(500).json({ error: "Failed to disburse loan" });
    }

    // Generate repayment schedule
    await generateRepaymentSchedule(loan_id, data);

    // Send disbursement notification
    try {
      await emailService.sendEmail({
        to: data.employee_email,
        template: "loan_disbursement_notification",
        data: {
          employeeName: data.employee_name,
          loanType: data.loan_type,
          disbursedAmount: disbursement_amount,
          applicationId: loan_id,
        },
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error disbursing loan:", error);
    return res.status(500).json({ error: "Failed to disburse loan" });
  }
}

async function recordPayment(req: NextApiRequest, res: NextApiResponse) {
  const { loan_id, payment_amount, payment_date, payment_method } = req.body;

  try {
    // Get the next pending installment
    const { data: installment, error: installmentError } = await supabase
      .from("loan_repayments")
      .select("*")
      .eq("loan_id", loan_id)
      .eq("status", "pending")
      .order("due_date", { ascending: true })
      .limit(1)
      .single();

    if (installmentError) {
      return res.status(404).json({ error: "No pending installments found" });
    }

    // Update installment as paid
    const { data, error } = await supabase
      .from("loan_repayments")
      .update({
        status: "paid",
        paid_date: payment_date,
        payment_method: payment_method,
        amount_paid: payment_amount,
      })
      .eq("id", installment.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: "Failed to record payment" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error recording payment:", error);
    return res.status(500).json({ error: "Failed to record payment" });
  }
}

async function generateRepaymentSchedule(loan_id: string, loanData: any) {
  const { amount, term_months, interest_rate, disbursement_date } = loanData;

  const monthly_rate = interest_rate / 100 / 12;
  const num_payments = term_months;
  const monthly_payment =
    (amount * monthly_rate * Math.pow(1 + monthly_rate, num_payments)) /
    (Math.pow(1 + monthly_rate, num_payments) - 1);

  const schedule = [];
  let remaining_balance = amount;
  const start_date = new Date(disbursement_date);

  for (let i = 1; i <= term_months; i++) {
    const interest_amount = remaining_balance * monthly_rate;
    const principal_amount = monthly_payment - interest_amount;
    remaining_balance -= principal_amount;

    const due_date = new Date(start_date);
    due_date.setMonth(due_date.getMonth() + i);

    schedule.push({
      loan_id: loan_id,
      installment_number: i,
      due_date: due_date.toISOString().split("T")[0],
      amount: Math.round(monthly_payment * 100) / 100,
      principal: Math.round(principal_amount * 100) / 100,
      interest: Math.round(interest_amount * 100) / 100,
      balance: Math.round(remaining_balance * 100) / 100,
      status: "pending",
    });
  }

  // Save schedule to database
  try {
    await supabase.from("loan_repayments").insert(schedule);
  } catch (error) {
    console.error("Error generating repayment schedule:", error);
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  switch (type) {
    case "settings":
      return await updateLoanSettings(req, res);
    default:
      return res.status(400).json({ error: "Invalid update type" });
  }
}

async function updateLoanSettings(req: NextApiRequest, res: NextApiResponse) {
  const settings = req.body;

  try {
    const { data, error } = await supabase
      .from("loan_settings")
      .upsert(settings)
      .select()
      .single();

    if (error) {
      console.log("Database update failed, returning mock response");
      return res.status(200).json(settings);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating loan settings:", error);
    return res.status(500).json({ error: "Failed to update settings" });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { loan_id } = req.query;

  if (!loan_id) {
    return res.status(400).json({ error: "Loan ID is required" });
  }

  try {
    const { error } = await supabase
      .from("loan_applications")
      .delete()
      .eq("id", loan_id);

    if (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete loan application" });
    }

    return res
      .status(200)
      .json({ message: "Loan application deleted successfully" });
  } catch (error) {
    console.error("Error deleting loan application:", error);
    return res.status(500).json({ error: "Failed to delete loan application" });
  }
}
