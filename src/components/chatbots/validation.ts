import { FlowNode, FlowEdge, ValidationIssue } from './types';

export function validateFlow(nodes: FlowNode[], edges: FlowEdge[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check each node according to its semantic constraints
  nodes.forEach((node) => {
    // 1. Message Node checks
    if (node.type === 'message') {
      if (!node.data.messageText || !node.data.messageText.trim()) {
        issues.push({
          id: `val-${node.id}-empty-msg`,
          nodeId: node.id,
          severity: 'error',
          message: 'Message text is empty.',
          field: 'messageText'
        });
      }
      // Check if it has an outgoing edge (unless it's explicitly disconnected)
      const outgoing = edges.filter((e) => e.source === node.id);
      if (outgoing.length === 0) {
        issues.push({
          id: `val-${node.id}-no-outgoing`,
          nodeId: node.id,
          severity: 'warning',
          message: 'Message has no subsequent step connected.',
          field: 'connection'
        });
      }
    }

    // 2. Question Node checks
    if (node.type === 'question') {
      if (!node.data.questionText || !node.data.questionText.trim()) {
        issues.push({
          id: `val-${node.id}-empty-q`,
          nodeId: node.id,
          severity: 'error',
          message: 'Question prompt is empty.',
          field: 'questionText'
        });
      }
      if (!node.data.saveResponseAs || !node.data.saveResponseAs.trim()) {
        issues.push({
          id: `val-${node.id}-no-var`,
          nodeId: node.id,
          severity: 'error',
          message: 'Missing variable name to save customer response.',
          field: 'saveResponseAs'
        });
      }
      const outgoing = edges.filter((e) => e.source === node.id);
      if (outgoing.length === 0) {
        issues.push({
          id: `val-${node.id}-no-outgoing`,
          nodeId: node.id,
          severity: 'warning',
          message: 'Question has no subsequent step connected.',
          field: 'connection'
        });
      }
    }

    // 3. Choice Node checks
    if (node.type === 'choice') {
      const choices = node.data.choices || [];
      if (choices.length === 0) {
        issues.push({
          id: `val-${node.id}-no-choices`,
          nodeId: node.id,
          severity: 'error',
          message: 'Choice node must contain at least one option.',
          field: 'choices'
        });
      } else {
        choices.forEach((opt, idx) => {
          if (!opt.label.trim()) {
            issues.push({
              id: `val-${node.id}-choice-${idx}-empty`,
              nodeId: node.id,
              severity: 'error',
              message: `Choice option ${idx + 1} has an empty label.`,
              field: 'choices'
            });
          }
          // Verify if this specific option handle has an edge
          const hasEdge = edges.some(
            (e) => e.source === node.id && (e.sourceHandle === opt.id || e.label === opt.label)
          );
          if (!hasEdge) {
            issues.push({
              id: `val-${node.id}-choice-${opt.id}-unconnected`,
              nodeId: node.id,
              severity: 'warning',
              message: `Option "${opt.label || 'Choice'}" has no destination connected.`,
              field: 'choices'
            });
          }
        });
      }
    }

    // 4. Condition Node checks
    if (node.type === 'condition') {
      const cond = node.data.condition;
      if (!cond || !cond.value.trim()) {
        issues.push({
          id: `val-${node.id}-no-val`,
          nodeId: node.id,
          severity: 'error',
          message: 'Condition comparison value is missing.',
          field: 'condition'
        });
      }
      const hasTrue = edges.some(
        (e) => e.source === node.id && (e.sourceHandle === 'true' || e.label === 'True' || e.label === 'True Branch')
      );
      const hasFalse = edges.some(
        (e) => e.source === node.id && (e.sourceHandle === 'false' || e.label === 'False' || e.label === 'False Branch')
      );
      if (!hasTrue) {
        issues.push({
          id: `val-${node.id}-no-true`,
          nodeId: node.id,
          severity: 'warning',
          message: 'Condition True path is not connected.',
          field: 'condition'
        });
      }
      if (!hasFalse) {
        issues.push({
          id: `val-${node.id}-no-false`,
          nodeId: node.id,
          severity: 'warning',
          message: 'Condition False path is not connected.',
          field: 'condition'
        });
      }
    }

    // 5. Handoff Node checks
    if (node.type === 'handoff') {
      const target = node.data.handoff?.target;
      if (!target || !target.trim()) {
        issues.push({
          id: `val-${node.id}-no-handoff-target`,
          nodeId: node.id,
          severity: 'error',
          message: 'Handoff destination team or agent is required.',
          field: 'handoff'
        });
      }
    }

    // 6. Start Node checks
    if (node.type === 'start') {
      const outgoing = edges.filter((e) => e.source === node.id);
      if (outgoing.length === 0) {
        issues.push({
          id: `val-${node.id}-start-disconnected`,
          nodeId: node.id,
          severity: 'error',
          message: 'Start trigger must connect to the first conversation step.',
          field: 'connection'
        });
      }
    }
  });

  return issues;
}
