/**
 * Job posting and application tracking types for future modules.
 */

export type JobStatus =
  'bookmarked' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'archived';

export type MatchScoreLevel = 'low' | 'medium' | 'high' | 'exceptional';

export interface JobMatchAnalysis {
  matchScore: number; // 0-100
  level: MatchScoreLevel;
  matchingSkills: string[];
  missingSkills: string[];
  summary: string;
}

export interface JobPostingSummary {
  id: string;
  title: string;
  company: string;
  location?: string;
  remoteType?: 'remote' | 'hybrid' | 'onsite';
  sourceUrl?: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}
