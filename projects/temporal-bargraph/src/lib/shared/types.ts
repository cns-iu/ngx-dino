export type LabelPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface Bar {
  start: number; // Percentage
  end: number; // Percentage
  offset: number; // Percentage
  weight: number; // Percentage
  style: object;

  label: string;
  labelPosition: LabelPosition;

  tooltip: string;
}

export interface BarItem {
  // Position
  start: any;
  end: any;
  weight: number; // Pixels
  stackOrder: number; // Index

  // Styling
  color: string;
  transparency: number;
  strokeColor: string;
  strokeWidth: number;
  strokeTransparency: number;

  // Label
  label: string;
  labelPosition: LabelPosition;

  // Tooltip
  tooltip: string;
}
