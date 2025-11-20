export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface AnalysisResult {
  rawMarkdown: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export interface VideoFile {
  file: File;
  previewUrl: string;
  base64Data?: string;
}