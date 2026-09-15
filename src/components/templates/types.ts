export type TemplateCategory = 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en_US', name: 'English (US)' },
  { code: 'en_GB', name: 'English (UK)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

export type HeaderType = 'none' | 'text' | 'image' | 'document';

export type TemplateButtonType = 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';

export interface TemplateBuilderButton {
  id: string;
  type: TemplateButtonType;
  text: string;
  value?: string; // for URL
  phoneNumber?: string; // for PHONE_NUMBER
}

export interface VariableItem {
  token: string; // e.g. "{{1}}"
  index: number; // e.g. 1
  example: string;
  description: string;
}

export interface TemplateDraft {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  source: 'local_draft';
  status: 'local_draft';
  isCampaignEligible: false;
  header: {
    type: HeaderType;
    text?: string;
    mediaPlaceholder?: string;
  };
  body: string;
  footer: string;
  variables: VariableItem[];
  buttons: TemplateBuilderButton[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationIssue {
  id: string;
  section: 'basics' | 'header' | 'body' | 'variables' | 'footer' | 'buttons';
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export type SaveState = 'saved' | 'saving' | 'unsaved' | 'error';
