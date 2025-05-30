import type { NextApiRequest, NextApiResponse } from 'next';

// Mock learning data API endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock course data
    const courses = [
      {
        id: '1',
        title: 'Company Values & Culture',
        description: 'Learn about our mission, values, and company culture.',
        category: 'Onboarding',
        duration: 2,
        level: 'Beginner',
        instructor: 'HR Team',
        enrolled: true,
        completed: true,
        progress: 100,
        certificate: 'company-values-cert.pdf',
        rating: 4.8,
        enrolledCount: 250,
        mandatory: true,
        modules: 8,
        assignments: 5,
        price: 'free',
        skills: ['Company Values', 'Culture'],
        prerequisites: [],
        thumbnail: '💻',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Workplace Safety Training',
        description: 'Mandatory safety training for all employees.',
        category: 'Safety',
        duration: 3,
        level: 'Beginner',
        instructor: 'Safety Team',
        enrolled: true,
        completed: true,
        progress: 100,
        certificate: 'safety-cert.pdf',
        rating: 4.6,
        enrolledCount: 300,
        mandatory: true,
        modules: 6,
        assignments: 3,
        price: 'free',
        skills: ['Safety', 'Risk Management'],
        prerequisites: [],
        thumbnail: '🛡️',
        status: 'completed'
      },
      {
        id: '3',
        title: 'Data Analysis Fundamentals',
        description: 'Master essential data analysis techniques.',
        category: 'Technical',
        duration: 6,
        level: 'Intermediate',
        instructor: 'Data Team',
        enrolled: true,
        completed: false,
        progress: 45,
        rating: 4.7,
        enrolledCount: 180,
        mandatory: false,
        modules: 10,
        assignments: 5,
        price: 'free',
        skills: ['Data Analysis', 'Excel', 'Statistics'],
        prerequisites: ['Basic Mathematics'],
        thumbnail: '📊',
        status: 'in_progress'
      }
    ];

    const learningPaths = [
      {
        id: '1',
        title: 'Professional Development Track',
        description: 'Comprehensive career advancement pathway',
        courses: ['1', '2', '3'],
        completed: 2,
        total: 3,
        difficulty: 'intermediate',
        skills: ['Leadership', 'Communication', 'Technical Skills'],
        courseIds: ['1', '2', '3'],
        thumbnail: '🚀'
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      res.status(200).json({
        success: true,
        courses,
        learningPaths,
        timestamp: new Date().toISOString()
      });
    }, 500);
    
  } catch (error) {
    console.error('Learning API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}