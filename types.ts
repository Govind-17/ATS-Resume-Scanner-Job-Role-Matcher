export interface Skill {
  name: string;
  category: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  bestRole: string;
  candidateName: string;
  summary: string;
  skills: Skill[];
  experienceHighlights: string[];
  education: string[];
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];

  // New scoring fields
  section_scores?: Record<string, number>;
  keyword_match_score?: number;
  final_ats_score?: number;
  report_file?: string;
}

export interface FileData {
  file: File;
  base64: string;
  mimeType: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}