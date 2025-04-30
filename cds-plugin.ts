'use strict';
//@ts-ignore
const globalcds = global.cds || require("@sap/cds");

globalcds.once('served', async function connectServices() {
  await globalcds.connect.to('event-broker');
  await globalcds.connect.to('EventMonitoringService');
});
