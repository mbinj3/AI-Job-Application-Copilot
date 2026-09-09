/**
 * Resume and profile types for upcoming AI extraction and generation features.
 */

export interface ResumeProfile {
  id: string;
  title: string;
  contact: {
    fullName: string;
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    location?: string;
  };
  summary?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
}
