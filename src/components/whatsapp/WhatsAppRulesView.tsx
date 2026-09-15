import React, { useState } from 'react';
import { AutomationRuleItem } from './automations/types';
import { INITIAL_AUTOMATION_RULES } from './automations/rulesMockData';
import { AutomationsLibraryView } from './automations/AutomationsLibraryView';
import { RuleBuilderWorkspace } from './automations/RuleBuilderWorkspace';

export const WhatsAppRulesView: React.FC = () => {
  const [rules, setRules] = useState<AutomationRuleItem[]>(INITIAL_AUTOMATION_RULES);
  const [currentView, setCurrentView] = useState<'library' | 'builder'>('library');
  const [activeRuleId, setActiveRuleId] = useState<string | null>(null);
  
  // Shared prototype toggles (Theme & Permissions)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const activeRule = rules.find(r => r.id === activeRuleId);

  const handleSelectRule = (rule: AutomationRuleItem) => {
    setActiveRuleId(rule.id);
    setCurrentView('builder');
  };

  const handleCreateRule = () => {
    const newRule: AutomationRuleItem = {
      id: `rule-${Date.now()}`,
      name: 'New WhatsApp Automation Rule',
      description: 'Automatically process and route incoming WhatsApp events.',
      status: 'Draft',
      triggerType: 'message_received',
      triggerConfig: {
        channel: 'whatsapp',
        inbox: 'Agamagizh WhatsApp Main',
        messageDirection: 'incoming'
      },
      matchMode: 'ALL',
      conditions: [
        {
          id: `c-${Date.now()}`,
          field: 'message_text',
          operator: 'contains',
          value: 'appointment'
        }
      ],
      actions: [
        {
          id: `a-${Date.now()}`,
          type: 'assign_conversation',
          params: { targetType: 'team', targetValue: 'Reception Desk' }
        }
      ],
      executionCount: 0,
      lastUpdated: 'Just now'
    };

    setRules(prev => [newRule, ...prev]);
    setActiveRuleId(newRule.id);
    setCurrentView('builder');
  };

  const handleSaveRule = (updatedRule: AutomationRuleItem) => {
    setRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r));
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleTogglePermission = () => {
    setIsReadOnly(prev => !prev);
  };

  if (currentView === 'builder' && activeRule) {
    return (
      <RuleBuilderWorkspace
        key={activeRule.id}
        initialRule={activeRule}
        isReadOnly={isReadOnly}
        theme={theme}
        onBack={() => {
          setCurrentView('library');
          setActiveRuleId(null);
        }}
        onSaveRule={handleSaveRule}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <AutomationsLibraryView
      rules={rules}
      theme={theme}
      isReadOnly={isReadOnly}
      onSelectRule={handleSelectRule}
      onCreateRule={handleCreateRule}
      onUpdateRules={setRules}
      onToggleTheme={handleToggleTheme}
      onTogglePermission={handleTogglePermission}
    />
  );
};
