export interface SolveStep {
  step_number: number;
  title: string;
  explanation: string;
  working: string;
  hint: string;
}

export interface SimilarProblem {
  problem: string;
  hint: string;
}

export interface ScanSolveResult {
  id: string;
  timestamp: string;
  problem: {
    latex: string;
    plain: string;
    subject: string;
    difficulty: 'O-Level' | 'A-Level' | 'university';
  };
  solution: {
    final_answer: string;
    steps: SolveStep[];
    key_concepts: string[];
    common_mistakes: string[];
    similar_problems: SimilarProblem[];
    zimsec_exam_tip: string;
    audio_script: string;
  };
  media: {
    simulation_html: string;
    audio_base64: string;
    audio_format: 'mp3';
  };
  meta: {
    id: string;
    solvable: boolean;
    cache_hit: boolean;
  };
}

export interface ScanSolveApiResponse {
  success: boolean;
  problem: ScanSolveResult['problem'];
  solution: ScanSolveResult['solution'];
  media: ScanSolveResult['media'];
  meta: ScanSolveResult['meta'];
}

export interface ScanSolveLoadingState {
  duration: number;
  message: string;
  icon: string;
}
