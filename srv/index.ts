// srv/index.ts
import { ApplicationService, connect, log, Request } from '@sap/cds';
const EventData = 'event.monitoring.EventData';

export = class EventServiceHandler extends ApplicationService {
  async init(): Promise<void> {
    const messaging = await connect.to('messaging');
    const LOG = log('event-monitoring');

    this.on('resend', 'Events', async (req: Request) => {
      const id = req.params[0];
      LOG.debug(`Resend Event with ID: ${id}`);
  
      const eventData = await SELECT.one.from(EventData).where({ ID: id });
      if (!eventData) {
        return req.reject(404, 'Event not found');
      }
      messaging.emit(eventData.topic, this.parseData(eventData.data));
    });

    this.on('resendToTopic', 'Events', async (req: Request) => {
      const id = req.params[0];
      const { topic } = req.data;
      LOG.debug(`Resend Event with ID: ${id} to topic: ${topic}`);
      
      const eventData = await SELECT.one.from(EventData).where({ ID: id });
      if (!eventData) {
        return req.reject(404, 'Event not found');
      }
      messaging.emit(topic, this.parseData(eventData.data));
    });

    this.on('sendToTopic', async (req: Request) => {
      const { topic, message } = req.data;
      LOG.debug(`Send Event to topic: ${topic}`);
      messaging.emit(topic, this.parseData(message));
    });

    this.on('resendAll', async (req: Request) => {
      const { topic, startTimestamp, endTimestamp } = req.data;
      LOG.debug(`Resend All Events with topic: ${topic}`);
      
      const eventData = await SELECT.from(EventData).where({
        topic: topic,
        dmq: null,
        createdAt: { '>=': startTimestamp },
        and: {
          createdAt: { '<=': endTimestamp }
        }
      });

      for (const event of eventData) {
        messaging.emit(topic, this.parseData(event.data));
      }
    });

    this.on('resendDeadMessageQueue', async (req: Request) => {
      const { queue } = req.data;
      LOG.debug(`Resend All Events for Dead Message Queue ${queue}`);
      
      const eventData = await SELECT.from(EventData).where({ dmq: queue });
      for (const event of eventData) {
        messaging.emit(event.topic, this.parseData(event.data));
      }

      // Delete all events for DMQ to prevent double entries
      await DELETE.from(EventData).where({ dmq: queue });
    });

    return super.init();
  }

  parseData(data: string): any {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }
};