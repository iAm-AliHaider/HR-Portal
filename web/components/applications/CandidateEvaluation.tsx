import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useApi';

interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  type: 'rating' | 'yesno' | 'text';
  required: boolean;
  score?: number;
  answer?: string | boolean;
}

interface CandidateEvaluationProps {
  applicationId: string;
  candidateName: string;
  position: string;
  stage: 'screening' | 'interview' | 'technical' | 'final';
  onSave: (data: any) => void;
  onStatusUpdate: (status: string) => void;
  existingEvaluation?: any;
}

const defaultCriteria: Record<string, EvaluationCriterion[]> = {
  screening: [
    { id: 'resumeQuality', name: 'Resume Quality', description: 'Overall quality of the resume', type: 'rating', required: true },
    { id: 'experienceMatch', name: 'Experience Match', description: 'How well the candidate\'s experience matches requirements', type: 'rating', required: true },
    { id: 'skillsMatch', name: 'Skills Match', description: 'Relevance of candidate\'s skills to the role', type: 'rating', required: true },
    { id: 'educationMatch', name: 'Education Match', description: 'Relevance of candidate\'s education to the role', type: 'rating', required: true },
    { id: 'initialImpression', name: 'Initial Impression', description: 'Overall first impression of the candidate', type: 'rating', required: true },
    { id: 'meetsCoreRequirements', name: 'Meets Core Requirements', description: 'Does the candidate meet the core requirements?', type: 'yesno', required: true }
  ],
  interview: [
    { id: 'communicationSkills', name: 'Communication Skills', description: 'Clarity and effectiveness of communication', type: 'rating', required: true },
    { id: 'relevantExperience', name: 'Relevant Experience', description: 'Depth and relevance of past experience', type: 'rating', required: true },
    { id: 'problemSolving', name: 'Problem Solving', description: 'Ability to think through complex problems', type: 'rating', required: true },
    { id: 'teamwork', name: 'Teamwork', description: 'Experience working in teams and collaboration skills', type: 'rating', required: true },
    { id: 'cultureFit', name: 'Cultural Fit', description: 'Alignment with company values and culture', type: 'rating', required: true },
    { id: 'leadershipPotential', name: 'Leadership Potential', description: 'Demonstrated leadership capabilities', type: 'rating', required: false }
  ],
  technical: [
    { id: 'technicalKnowledge', name: 'Technical Knowledge', description: 'Depth of technical knowledge', type: 'rating', required: true },
    { id: 'codingSkills', name: 'Coding Skills', description: 'Quality and efficiency of code', type: 'rating', required: true },
    { id: 'systemDesign', name: 'System Design', description: 'Ability to design scalable systems', type: 'rating', required: true },
    { id: 'problemSolvingApproach', name: 'Problem-Solving Approach', description: 'Methodology to solving technical problems', type: 'rating', required: true },
    { id: 'technicalCommunication', name: 'Technical Communication', description: 'Ability to explain technical concepts clearly', type: 'rating', required: true },
    { id: 'codeQuality', name: 'Code Quality', description: 'Attention to best practices and clean code', type: 'rating', required: true }
  ],
  final: [
    { id: 'overallAssessment', name: 'Overall Assessment', description: 'Final impression of the candidate', type: 'rating', required: true },
    { id: 'strengths', name: 'Key Strengths', description: 'Candidate\'s primary strengths', type: 'text', required: true },
    { id: 'weaknesses', name: 'Areas for Development', description: 'Candidate\'s areas for improvement', type: 'text', required: true },
    { id: 'teamFit', name: 'Team Fit', description: 'How well the candidate would fit with the team', type: 'rating', required: true },
    { id: 'growthPotential', name: 'Growth Potential', description: 'Long-term potential of the candidate', type: 'rating', required: true },
    { id: 'hiringRecommendation', name: 'Hiring Recommendation', description: 'Would you recommend hiring this candidate?', type: 'yesno', required: true }
  ]
};

export default function CandidateEvaluation({
  applicationId,
  candidateName,
  position,
  stage,
  onSave,
  onStatusUpdate,
  existingEvaluation
}: CandidateEvaluationProps) {
  const toast = useToast();
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>(defaultCriteria[stage] || []);
  const [overallNotes, setOverallNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decisionMade, setDecisionMade] = useState(false);
  const [decision, setDecision] = useState<'advance' | 'reject' | 'hold'>('hold');
  
  // Load existing evaluation if present
  useEffect(() => {
    if (existingEvaluation) {
      if (existingEvaluation.criteria && Array.isArray(existingEvaluation.criteria)) {
        const updatedCriteria = [...criteria];
        existingEvaluation.criteria.forEach((saved: any) => {
          const index = updatedCriteria.findIndex(c => c.id === saved.id);
          if (index !== -1) {
            updatedCriteria[index] = {
              ...updatedCriteria[index],
              score: saved.score,
              answer: saved.answer
            };
          }
        });
        setCriteria(updatedCriteria);
      }
      
      if (existingEvaluation.overallNotes) {
        setOverallNotes(existingEvaluation.overallNotes);
      }
      
      if (existingEvaluation.decision) {
        setDecision(existingEvaluation.decision);
        setDecisionMade(true);
      }
    }
  }, [existingEvaluation]);
  
  // Calculate overall score
  const calculateOverallScore = () => {
    const ratingCriteria = criteria.filter(c => c.type === 'rating' && c.score !== undefined);
    if (ratingCriteria.length === 0) return 0;
    
    const sum = ratingCriteria.reduce((total, criterion) => total + (criterion.score || 0), 0);
    return Math.round((sum / ratingCriteria.length) * 10) / 10;
  };
  
  // Handle criteria updates
  const updateCriterion = (id: string, field: 'score' | 'answer', value: any) => {
    setCriteria(prev => 
      prev.map(criterion => 
        criterion.id === id ? { ...criterion, [field]: value } : criterion
      )
    );
  };
  
  // Validate form before submission
  const validateForm = () => {
    const requiredCriteria = criteria.filter(c => c.required);
    const missingFields = requiredCriteria.filter(c => {
      if (c.type === 'rating') return c.score === undefined;
      if (c.type === 'yesno') return c.answer === undefined;
      if (c.type === 'text') return !c.answer;
      return false;
    });
    
    if (missingFields.length > 0) {
      toast.error(`Please complete all required fields: ${missingFields.map(f => f.name).join(', ')}`);
      return false;
    }
    
    if (!decisionMade) {
      toast.error('Please make a decision about this candidate');
      return false;
    }
    
    return true;
  };
  
  // Save evaluation data
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const evaluationData = {
        applicationId,
        candidateName,
        position,
        stage,
        criteria,
        overallNotes,
        decision,
        overallScore: calculateOverallScore(),
        evaluatedAt: new Date().toISOString()
      };
      
      await onSave(evaluationData);
      
      // Update application status based on decision
      const newStatus = decision === 'advance' 
        ? (stage === 'final' ? 'Offered' : 'Interview') 
        : decision === 'reject' 
          ? 'Rejected' 
          : 'Screening';
      
      await onStatusUpdate(newStatus);
      
      toast.success('Evaluation saved successfully');
    } catch (error) {
      toast.error('Failed to save evaluation');
      console.error('Error saving evaluation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-blue-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md shadow-sm border p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">{candidateName}</h2>
            <p className="text-gray-500">{position} - {stage.charAt(0).toUpperCase() + stage.slice(1)} Evaluation</p>
          </div>
          <div className="mt-2 md:mt-0">
            <div className="text-lg font-semibold flex items-center">
              <span>Overall Score:</span>
              <span className={`ml-2 ${getScoreColor(calculateOverallScore())}`}>
                {calculateOverallScore()} / 5
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div key={criterion.id} className="border-b pb-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{criterion.name} {criterion.required && <span className="text-red-500">*</span>}</h3>
                    <p className="text-sm text-gray-500">{criterion.description}</p>
                  </div>
                  
                  {criterion.type === 'rating' && criterion.score !== undefined && (
                    <span className={`font-bold ${getScoreColor(criterion.score)}`}>
                      {criterion.score} / 5
                    </span>
                  )}
                </div>
                
                {criterion.type === 'rating' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Poor (1)</span>
                      <span>Average (3)</span>
                      <span>Excellent (5)</span>
                    </div>
                    <Slider
                      value={[criterion.score || 0]}
                      min={0}
                      max={5}
                      step={0.5}
                      onValueChange={(value) => updateCriterion(criterion.id, 'score', value[0])}
                    />
                  </div>
                )}
                
                {criterion.type === 'yesno' && (
                  <div className="mt-4">
                    <RadioGroup 
                      value={criterion.answer === true ? 'yes' : criterion.answer === false ? 'no' : undefined}
                      onValueChange={(value) => updateCriterion(criterion.id, 'answer', value === 'yes')}
                    >
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`${criterion.id}-yes`} />
                          <Label htmlFor={`${criterion.id}-yes`}>Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`${criterion.id}-no`} />
                          <Label htmlFor={`${criterion.id}-no`}>No</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                {criterion.type === 'text' && (
                  <div className="mt-4">
                    <Textarea
                      placeholder="Enter your assessment..."
                      value={criterion.answer as string || ''}
                      onChange={(e) => updateCriterion(criterion.id, 'answer', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Overall Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <Textarea
                placeholder="Enter any additional observations, concerns, or highlights about the candidate..."
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Decision *</label>
              <RadioGroup 
                value={decision}
                onValueChange={(value: 'advance' | 'reject' | 'hold') => {
                  setDecision(value);
                  setDecisionMade(true);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 border rounded-lg cursor-pointer ${decision === 'advance' ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advance" id="decision-advance" />
                      <Label htmlFor="decision-advance" className="font-medium">Advance Candidate</Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {stage === 'final' 
                        ? 'Recommend for job offer' 
                        : 'Move to the next interview stage'}
                    </p>
                  </div>
                  
                  <div className={`p-4 border rounded-lg cursor-pointer ${decision === 'hold' ? 'bg-yellow-50 border-yellow-300' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hold" id="decision-hold" />
                      <Label htmlFor="decision-hold" className="font-medium">Hold for Review</Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Needs additional consideration or review from other team members
                    </p>
                  </div>
                  
                  <div className={`p-4 border rounded-lg cursor-pointer ${decision === 'reject' ? 'bg-red-50 border-red-300' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reject" id="decision-reject" />
                      <Label htmlFor="decision-reject" className="font-medium">Reject Candidate</Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Not suitable for this position
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-3 border-t pt-6">
          <Button variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Evaluation'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 