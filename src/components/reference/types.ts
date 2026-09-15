export type ReferenceViewport = 'fluid' | 'mobile' | 'laptop' | 'desktop';

export type ReferenceSectionId = 
  | 'brand'
  | 'typography'
  | 'buttons'
  | 'inputs'
  | 'badges'
  | 'cards'
  | 'tables'
  | 'overlays'
  | 'feedback'
  | 'states'
  | 'accessibility';

export interface ColorToken {
  name: string;
  hex: string;
  role: string;
  usage: string;
  textDark?: boolean;
}

export interface BadgeExample {
  label: string;
  category: 'lifecycle' | 'provider' | 'recipient' | 'rules';
  colorClasses: string;
  darkColorClasses: string;
  description: string;
}
