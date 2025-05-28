import { NextApiRequest, NextApiResponse } from 'next';
import { emailService } from '../../services/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, template, data, attachments } = req.body;

    if (!to || !template || !data) {
      return res.status(400).json({ error: 'Missing required fields: to, template, data' });
    }

    const result = await emailService.sendEmail({
      to,
      template,
      data,
      attachments
    });

    if (result.success) {
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 