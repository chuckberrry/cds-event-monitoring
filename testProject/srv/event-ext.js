const cds = require('@sap/cds');
const EventServiceHandler = require('cds-event-monitoring/srv');
module.exports = class EventServiceExt extends EventServiceHandler {
  async init() {
    const messaging = await cds.connect.to('messaging');

    // change messaging behavior
    messaging.on('*', (msg) => {
      const { data, event } = msg;
      console.log(data);
      console.log(event);
    });

    // hook into CRUD events
    this.after('each', (data) => {
      console.log(data);
    });

    return super.init();
  }
};
