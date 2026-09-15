import { TemplateDraft, VariableItem, ValidationIssue, TemplateBuilderButton } from './types';

// Extract variable tokens (e.g. {{1}}, {{2}}) from text
export function extractVariablesFromText(text: string): number[] {
  const regex = /\{\{(\d+)\}\}/g;
  const indices: number[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && !indices.includes(num)) {
      indices.push(num);
    }
  }
  return indices.sort((a, b) => a - b);
}

// Sync variables list while retaining user-typed examples and descriptions
export function syncVariables(
  bodyText: string,
  headerText: string,
  existingVariables: VariableItem[]
): VariableItem[] {
  const combinedText = `${headerText || ''} ${bodyText || ''}`;
  const detectedIndices = extractVariablesFromText(combinedText);
  const existingMap = new Map<number, VariableItem>();
  existingVariables.forEach((v) => existingMap.set(v.index, v));

  // Default suggestions for common indices
  const defaultSuggestions: Record<number, { example: string; description: string }> = {
    1: { example: 'Meera Sundaram', description: 'Recipient name' },
    2: { example: '14 Sep, 10:30 AM', description: 'Appointment date/time' },
    3: { example: 'Adyar Campus', description: 'Clinic location' },
    4: { example: 'Dr. Arulmozhi', description: 'Consulting specialist' },
    5: { example: 'APT-9042', description: 'Booking reference' }
  };

  return detectedIndices.map((idx) => {
    const existing = existingMap.get(idx);
    if (existing) {
      return {
        token: `{{${idx}}}`,
        index: idx,
        example: existing.example || '',
        description: existing.description || ''
      };
    }
    const defaultData = defaultSuggestions[idx] || {
      example: '',
      description: `Variable {{${idx}}} parameter`
    };
    return {
      token: `{{${idx}}}`,
      index: idx,
      example: defaultData.example,
      description: defaultData.description
    };
  });
}

// Live interpolation of text with variable examples for WhatsApp phone preview
export function interpolateText(text: string, variables: VariableItem[]): string {
  if (!text) return '';
  let result = text;
  variables.forEach((v) => {
    const replacement = v.example.trim() ? v.example : `[${v.token}]`;
    result = result.split(v.token).join(replacement);
  });
  return result;
}

// Comprehensive local validation engine
export function validateTemplateDraft(draft: TemplateDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // 1. BASICS
  if (!draft.name || !draft.name.trim()) {
    issues.push({
      id: 'val-name-missing',
      section: 'basics',
      field: 'name',
      message: 'Template identifier name is required.',
      severity: 'error'
    });
  } else {
    const validNameRegex = /^[a-z0-9_]+$/;
    if (!validNameRegex.test(draft.name)) {
      issues.push({
        id: 'val-name-format',
        section: 'basics',
        field: 'name',
        message: 'Template name must contain only lowercase letters, numbers, and underscores (no spaces).',
        severity: 'error'
      });
    }
    if (draft.name.length > 512) {
      issues.push({
        id: 'val-name-length',
        section: 'basics',
        field: 'name',
        message: 'Template name must be less than 512 characters.',
        severity: 'error'
      });
    }
  }

  if (!draft.language) {
    issues.push({
      id: 'val-lang-missing',
      section: 'basics',
      field: 'language',
      message: 'Template language is required.',
      severity: 'error'
    });
  }

  if (!draft.category) {
    issues.push({
      id: 'val-cat-missing',
      section: 'basics',
      field: 'category',
      message: 'Template category is required.',
      severity: 'error'
    });
  }

  // 2. HEADER
  if (draft.header.type === 'text') {
    if (!draft.header.text || !draft.header.text.trim()) {
      issues.push({
        id: 'val-header-empty',
        section: 'header',
        field: 'headerText',
        message: 'Header text is required when text header is selected.',
        severity: 'error'
      });
    } else if (draft.header.text.length > 60) {
      issues.push({
        id: 'val-header-length',
        section: 'header',
        field: 'headerText',
        message: `Header text exceeds limit (${draft.header.text.length}/60 characters).`,
        severity: 'error'
      });
    }
  }

  // 3. BODY
  if (!draft.body || !draft.body.trim()) {
    issues.push({
      id: 'val-body-missing',
      section: 'body',
      field: 'body',
      message: 'Message body content is required.',
      severity: 'error'
    });
  } else {
    if (draft.body.length > 1024) {
      issues.push({
        id: 'val-body-length',
        section: 'body',
        field: 'body',
        message: `Body text exceeds WhatsApp standard limit (${draft.body.length}/1024 characters).`,
        severity: 'error'
      });
    }
  }

  // 4. VARIABLES
  const detectedIndices = extractVariablesFromText(`${draft.header.text || ''} ${draft.body || ''}`);
  
  // Check sequential order (1, 2, 3...)
  for (let i = 0; i < detectedIndices.length; i++) {
    const expected = i + 1;
    if (detectedIndices[i] !== expected) {
      issues.push({
        id: `val-var-sequence-${detectedIndices[i]}`,
        section: 'variables',
        field: 'variables',
        message: `Variable sequence is missing {{${expected}}}. Found {{${detectedIndices[i]}}} instead.`,
        severity: 'warning'
      });
      break;
    }
  }

  // Check example values
  draft.variables.forEach((v) => {
    if (!v.example || !v.example.trim()) {
      issues.push({
        id: `val-var-${v.index}-no-example`,
        section: 'variables',
        field: `var_${v.index}`,
        message: `Variable ${v.token} requires an example value (e.g. "${v.description || 'sample text'}").`,
        severity: 'error'
      });
    }
  });

  // 5. FOOTER
  if (draft.footer && draft.footer.length > 60) {
    issues.push({
      id: 'val-footer-length',
      section: 'footer',
      field: 'footer',
      message: `Footer text exceeds limit (${draft.footer.length}/60 characters).`,
      severity: 'error'
    });
  }

  // 6. BUTTONS
  if (draft.buttons && draft.buttons.length > 0) {
    const quickReplies = draft.buttons.filter((b) => b.type === 'QUICK_REPLY');
    const ctaButtons = draft.buttons.filter((b) => b.type === 'URL' || b.type === 'PHONE_NUMBER');

    if (quickReplies.length > 3) {
      issues.push({
        id: 'val-buttons-qr-limit',
        section: 'buttons',
        field: 'buttons',
        message: 'Maximum 3 Quick Reply buttons allowed by WhatsApp.',
        severity: 'error'
      });
    }
    if (ctaButtons.length > 2) {
      issues.push({
        id: 'val-buttons-cta-limit',
        section: 'buttons',
        field: 'buttons',
        message: 'Maximum 2 Call-To-Action (URL/Phone) buttons allowed.',
        severity: 'error'
      });
    }

    draft.buttons.forEach((btn, idx) => {
      if (!btn.text || !btn.text.trim()) {
        issues.push({
          id: `val-btn-${idx}-text`,
          section: 'buttons',
          field: `btn_${idx}_text`,
          message: `Button #${idx + 1} label is required.`,
          severity: 'error'
        });
      } else if (btn.text.length > 25) {
        issues.push({
          id: `val-btn-${idx}-length`,
          section: 'buttons',
          field: `btn_${idx}_text`,
          message: `Button #${idx + 1} label exceeds 25 characters (${btn.text.length}/25).`,
          severity: 'error'
        });
      }

      if (btn.type === 'URL') {
        if (!btn.value || !btn.value.trim()) {
          issues.push({
            id: `val-btn-${idx}-url-missing`,
            section: 'buttons',
            field: `btn_${idx}_val`,
            message: `Button "${btn.text || '#' + (idx + 1)}" requires a target URL.`,
            severity: 'error'
          });
        } else if (!btn.value.startsWith('http://') && !btn.value.startsWith('https://')) {
          issues.push({
            id: `val-btn-${idx}-url-protocol`,
            section: 'buttons',
            field: `btn_${idx}_val`,
            message: `Button "${btn.text || '#' + (idx + 1)}" URL must begin with https:// or http://`,
            severity: 'error'
          });
        }
      }

      if (btn.type === 'PHONE_NUMBER') {
        if (!btn.phoneNumber || !btn.phoneNumber.trim()) {
          issues.push({
            id: `val-btn-${idx}-phone-missing`,
            section: 'buttons',
            field: `btn_${idx}_phone`,
            message: `Button "${btn.text || '#' + (idx + 1)}" requires a destination phone number.`,
            severity: 'error'
          });
        }
      }
    });
  }

  return issues;
}

// Generate Meta Cloud API Provider Payload JSON structure
export function generateMetaPayload(draft: TemplateDraft): Record<string, any> {
  const components: any[] = [];

  // Header component
  if (draft.header.type === 'text' && draft.header.text) {
    components.push({
      type: 'HEADER',
      format: 'TEXT',
      text: draft.header.text,
      example: draft.header.text.includes('{{1}}')
        ? { header_text: [draft.variables.find((v) => v.index === 1)?.example || 'Sample'] }
        : undefined
    });
  } else if (draft.header.type === 'image') {
    components.push({
      type: 'HEADER',
      format: 'IMAGE',
      example: { header_handle: ['https://agamagizh.org/assets/wellness_cover.jpg'] }
    });
  } else if (draft.header.type === 'document') {
    components.push({
      type: 'HEADER',
      format: 'DOCUMENT',
      example: { header_handle: ['https://agamagizh.org/assets/schedule.pdf'] }
    });
  }

  // Body component
  const bodyVariables = draft.variables.map((v) => v.example || 'Sample');
  components.push({
    type: 'BODY',
    text: draft.body,
    example: bodyVariables.length > 0 ? { body_text: [bodyVariables] } : undefined
  });

  // Footer component
  if (draft.footer && draft.footer.trim()) {
    components.push({
      type: 'FOOTER',
      text: draft.footer
    });
  }

  // Buttons component
  if (draft.buttons && draft.buttons.length > 0) {
    components.push({
      type: 'BUTTONS',
      buttons: draft.buttons.map((b) => {
        if (b.type === 'QUICK_REPLY') {
          return {
            type: 'QUICK_REPLY',
            text: b.text
          };
        }
        if (b.type === 'URL') {
          return {
            type: 'URL',
            text: b.text,
            url: b.value || 'https://agamagizh.org'
          };
        }
        if (b.type === 'PHONE_NUMBER') {
          return {
            type: 'PHONE_NUMBER',
            text: b.text,
            phone_number: b.phoneNumber || '+914424450099'
          };
        }
        return { type: b.type, text: b.text };
      })
    });
  }

  return {
    name: draft.name,
    category: draft.category,
    language: draft.language,
    components,
    _local_metadata: {
      source: 'local_draft',
      readiness: 'Ready for provider submission preparation',
      validation_passed: validateTemplateDraft(draft).length === 0,
      client_timestamp: new Date().toISOString()
    }
  };
}

// Preset samples for fast demo & testing
export const SAMPLE_DRAFTS: Record<string, TemplateDraft> = {
  appointment_reminder: {
    id: 'draft-appointment-reminder',
    name: 'appointment_reminder_adyar',
    category: 'UTILITY',
    language: 'en_US',
    source: 'local_draft',
    status: 'local_draft',
    isCampaignEligible: false,
    header: {
      type: 'text',
      text: 'Agamagizh Appointment Notice'
    },
    body: 'Vanakkam {{1}},\n\nThis is a friendly reminder for your scheduled appointment on {{2}} at our {{3}} center.\n\nPlease arrive 10 minutes prior to your slot.\n\nReply CONFIRM or select an option below.',
    footer: 'Agamagizh Clinic Operations Desk',
    variables: [
      { token: '{{1}}', index: 1, example: 'Meera Sundaram', description: 'Recipient full name' },
      { token: '{{2}}', index: 2, example: '14 Sep, 10:30 AM', description: 'Date and time slot' },
      { token: '{{3}}', index: 3, example: 'Adyar Campus', description: 'Clinic location/hub' }
    ],
    buttons: [
      { id: 'btn-1', type: 'QUICK_REPLY', text: 'Confirm Slot' },
      { id: 'btn-2', type: 'QUICK_REPLY', text: 'Request Reschedule' },
      { id: 'btn-3', type: 'PHONE_NUMBER', text: 'Call Desk', phoneNumber: '+914424450099' }
    ],
    createdAt: '2026-09-14 09:30 AM',
    updatedAt: 'Just now'
  },
  holiday_schedule: {
    id: 'draft-holiday-schedule',
    name: 'holiday_schedule_update_2026',
    category: 'UTILITY',
    language: 'en_US',
    source: 'local_draft',
    status: 'local_draft',
    isCampaignEligible: false,
    header: {
      type: 'text',
      text: 'Holiday Schedule Advisory'
    },
    body: 'Dear {{1}},\n\nPlease note our operational hours for {{2}}. Sessions will be hosted as per pre-booked appointments between {{3}}.\n\nFor urgent enquiries, contact our coordinator.',
    footer: 'Agamagizh Care Administration',
    variables: [
      { token: '{{1}}', index: 1, example: 'Suresh Ramanathan', description: 'Patient or family name' },
      { token: '{{2}}', index: 2, example: 'Gandhi Jayanthi (Oct 2)', description: 'Holiday occasion' },
      { token: '{{3}}', index: 3, example: '08:30 AM - 01:30 PM', description: 'Revised timings' }
    ],
    buttons: [
      { id: 'btn-h1', type: 'URL', text: 'View Holiday Roster', value: 'https://agamagizh.org/schedule' },
      { id: 'btn-h2', type: 'QUICK_REPLY', text: 'Acknowledge' }
    ],
    createdAt: '2026-09-14 10:15 AM',
    updatedAt: 'Just now'
  },
  blank: {
    id: `draft-${Date.now()}`,
    name: 'new_template_draft',
    category: 'UTILITY',
    language: 'en_US',
    source: 'local_draft',
    status: 'local_draft',
    isCampaignEligible: false,
    header: {
      type: 'none'
    },
    body: 'Hello {{1}},\n\nYour reference number is {{2}}.',
    footer: 'Agamagizh Health',
    variables: [
      { token: '{{1}}', index: 1, example: 'Meera Sundaram', description: 'Recipient name' },
      { token: '{{2}}', index: 2, example: 'REF-2026-01', description: 'Reference ID' }
    ],
    buttons: [
      { id: 'b-init-1', type: 'QUICK_REPLY', text: 'Confirm' }
    ],
    createdAt: 'Today',
    updatedAt: 'Just now'
  }
};
