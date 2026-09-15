import React from 'react';
import { ClinicPipelineCard } from '../../types';
import { PipelineKanbanView } from './PipelineKanbanView';
import { PipelineItem } from './types';
import { INITIAL_PIPELINE_ITEMS } from './pipelineMockData';

interface ClinicPipelineViewProps {
  cards?: ClinicPipelineCard[];
  onMoveStage?: (cardId: string, newStageId: string) => void;
  onOpenConversation?: (card: ClinicPipelineCard | any) => void;
  onAddNewCard?: (card: Omit<ClinicPipelineCard, 'id' | 'lastContacted'>) => void;
  onOpenContact?: (item: any) => void;
}

export const ClinicPipelineView: React.FC<ClinicPipelineViewProps> = ({
  cards = [],
  onMoveStage,
  onOpenConversation,
  onAddNewCard,
  onOpenContact
}) => {
  // If cards are provided from App.tsx, map them to PipelineItem structure;
  // otherwise fallback to rich initial operational items.
  const mappedItems: PipelineItem[] = React.useMemo(() => {
    if (!cards || cards.length === 0) {
      return INITIAL_PIPELINE_ITEMS;
    }

    return cards.map(c => ({
      id: c.id,
      stageId: c.stageId === 'lead_inquiry' ? 'new_enquiry' :
               c.stageId === 'contacted_qualified' ? 'contacted' :
               c.stageId === 'consultation_scheduled' ? 'follow_up' :
               c.stageId === 'active_client' ? 'confirmed' :
               c.stageId === 'retention_review' ? 'completed' :
               c.stageId,
      title: c.title,
      contactName: c.contactName,
      contactPhone: c.contactPhone,
      assignedAgent: c.assignedAgent || 'Kavitha Sundaram',
      assignedTeam: 'Reception Team',
      labels: c.labels || ['Inbound Inquiry'],
      lastActivity: c.lastContacted || 'Today',
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main',
      recentNote: c.nextActivity ? `Next: ${c.nextActivity}` : undefined,
      conversationId: c.conversationId
    }));
  }, [cards]);

  return (
    <div className="h-full flex flex-col flex-1 overflow-hidden">
      <PipelineKanbanView
        initialItems={mappedItems}
        context="clinic"
        onOpenConversation={(item) => {
          if (onOpenConversation) {
            onOpenConversation({
              id: item.id,
              stageId: item.stageId,
              title: item.title,
              contactName: item.contactName,
              contactPhone: item.contactPhone,
              value: '₹3,500',
              assignedAgent: item.assignedAgent,
              priority: 'high',
              labels: item.labels,
              nextActivity: item.recentNote || '',
              lastContacted: item.lastActivity,
              conversationId: item.conversationId
            });
          }
        }}
        onOpenContact={(item) => {
          if (onOpenContact) {
            onOpenContact(item);
          }
        }}
      />
    </div>
  );
};
