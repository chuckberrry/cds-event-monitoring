import cds from '@sap/cds';
import crypto from 'crypto';

const EventData = 'event.monitoring.EventData';

interface EventMessage {
  data: Record<string, any>;
  event: string;
}

interface EventMonitoringConfig {
  topics: string[];
  ['dead-message-queues']: string[];
  retentionInDays?: number;
  ignoreIdenticalEvents?: boolean;
}

export default class EventHandler extends cds.Service {
  async init(): Promise<void> {
    const messaging = await cds.connect.to('messaging');
    const eventMonitoring: EventMonitoringConfig = cds.env.requires['event-monitoring'];
    const db = await cds.connect.to('db');

    if (!eventMonitoring || !(eventMonitoring.topics || eventMonitoring['dead-message-queues'])) {
      throw new Error('event-monitoring->topics or event-monitoring->dead-message-queues must be configured in cds variables.');
    }

    for (const topic of eventMonitoring?.topics || []) {
      messaging.on(topic, async (msg: EventMessage) => {
        if (eventMonitoring.retentionInDays && typeof eventMonitoring.retentionInDays === 'number') {
          await this.deleteDataOlderThanDays(eventMonitoring.retentionInDays, db);
        }
        const { data, event } = msg;
        const eventData = this.buildEventData(event, data);

        if (eventMonitoring.ignoreIdenticalEvents) {
          const existingEventData = await db.run(SELECT.one.from(EventData).where({ hash: this.calculateHash(eventData) }));
          if (existingEventData) {
            return;
          }
        }

        return db.run(INSERT.into(EventData).entries(eventData));
      });
    }

    for (const deadMessageQueue of eventMonitoring?.['dead-message-queues'] ?? []) {
      const queueConnection = await cds.connect.to('dead-message-queues', {
        kind: messaging.kind,
        // @ts-expect-error
        queue: { name: deadMessageQueue }
      });

      queueConnection.on('*', (msg: EventMessage) => {
        const { data, event } = msg;
        const eventData = this.buildEventData(event, data);
        eventData.dmq = deadMessageQueue;
        return db.run(INSERT.into(EventData).entries(eventData));
      });
    }

    return super.init();
  }

  async deleteDataOlderThanDays(days: number, db: any): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    await db.run(DELETE.from(EventData).where({ createdAt: { '<': date.toISOString() } }));
  }

  buildEventData(event: string, data: Record<string, any>): Record<string, any> {
    const eventData: Record<string, any> = {};
    const eventDataEntity = cds.model?.definitions[EventData] as cds.linked.LinkedDefinitions | undefined;
    for (const key in eventDataEntity?.elements) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        eventData[key] = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
      }
    }
    eventData.data = JSON.stringify(data);
    eventData.topic = event;
    eventData.hash = this.calculateHash(eventData);
    return eventData;
  }

  calculateHash(eventData: Record<string, any>): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify({ topic: eventData.topic, data: eventData.data }))
      .digest('hex');
  }
}
