export type Range = {
  start: number;
  end: number;
};

export type DrawOptions = {
  allowRepeats: boolean;
  seed?: number; // opcional, para reproduzir sequências
};

export type DrawnNumber = {
  value: number;
  at: string; // ISO timestamp
};

export type DrawState = {
  pool: number[]; // números disponíveis
  drawn: DrawnNumber[]; // histórico
  options: DrawOptions;
  isSpinning: boolean;
  lastDrawn?: number;
};

export type InputMode = 'quantity' | 'ranges';

export type WheelSector = {
  number: number;
  startAngle: number;
  endAngle: number;
  centerAngle: number;
  isDrawn: boolean;
};

export type SpinResult = {
  targetNumber: number;
  finalRotation: number;
  duration: number;
};

export type ThemeTokens = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
};
