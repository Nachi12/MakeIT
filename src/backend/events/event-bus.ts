import { EventEmitter } from 'events';

export interface CrmEvent {
  type: 
    | 'lead.created'
    | 'lead.updated'
    | 'lead.assigned'
    | 'lead.status_changed'
    | 'contact.created'
    | 'contact.updated'
    | 'call.started'
    | 'call.ringing'
    | 'call.answered'
    | 'call.ended'
    | 'call.failed'
    | 'call.missed'
    | 'followup.created'
    | 'followup.updated'
    | 'followup.completed'
    | 'note.created'
    | 'project.created';
  data: any;
  timestamp: string;
}

class CrmEventBus extends EventEmitter {
  private clients: Set<(event: CrmEvent) => void> = new Set();

  subscribe(client: (event: CrmEvent) => void) {
    this.clients.add(client);
    return () => {
      this.clients.delete(client);
    };
  }

  broadcast(type: CrmEvent['type'], data: any) {
    const event: CrmEvent = {
      type,
      data,
      timestamp: new Date().toISOString()
    };

    this.emit('crm-event', event);

    for (const client of this.clients) {
      try {
        client(event);
      } catch (e) {
        // Handle client disconnect
      }
    }
  }
}

export const crmEventBus = new CrmEventBus();
