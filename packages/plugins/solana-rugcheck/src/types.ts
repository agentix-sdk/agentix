export interface TokenCheck {
    tokenProgram: string;
    tokenType: string;
    risks: Array<{
      name: string;
      level: string;
      description: string;
      score: number;
    }>;
    score: number;
}