const cds = require('@sap/cds');
const EventServiceHandler = require('cds-event-monitoring/srv');
module.exports = class EventServiceExt extends EventServiceHandler {
  async init() {
    const messaging = await cds.connect.to('messaging');

    // extend messaging behavior
    messaging.on('plugin/example/1/test2', (msg) => {
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
