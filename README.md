# CDS Event Monitoring Plugin

The Event Monitoring Plugin provides a robust event monitoring service capable of hooking into multiple topics and storing event data in a database table. It exposes this data through a CDS service that users can extend as needed. This is perfect if you want to keep track of your event data and need retry/resend functionalities. For an example of how to use this package, refer to the testProject folder of the github repository.

**Features**

- Event Monitoring for Multiple Topics
- Stores event data in a customizable CDS entity/table.
- Provides a default CDS service (EventMonitoringService) to interact with event data.
- Actions to resend individual events, all events, or dead-message queue events.
- Monitors and consumes messages from specified DMQs.
- Configurable retentionInDays setting to automatically delete old events.
- Duplicate Event Filtering

## Table of Content

- [CDS Event Monitoring Plugin](#cds-event-monitoring-plugin)
  - [Table of Content](#table-of-content)
  - [Setup](#setup)
    - [Adding Required Configurations](#adding-required-configurations)
  - [Default service definition](#default-service-definition)
  - [Extending the Service](#extending-the-service)
  - [Extending the Service and Event Logic](#extending-the-service-and-event-logic)
  - [Fiori annotations](#fiori-annotations)
  - [Extending the database table](#extending-the-database-table)

## Setup

To enable event monitoring, add plugin package to your project with the following command:

```sh
 npm add cds-event-monitoring
```

### Adding Required Configurations

This package requires specific configurations in your package.json or .cdsrc.json.

```json
  "cds": {
    "requires": {
      ...
      "event-monitoring": {
        "retentionInDays": 7,
        "topics": [
          "<namespace>/<topic-name>"
        ],
        "dead-message-queues": [
          "<namespace>/<dead-message-queue-name>"
        ]
      }
    }
  }
```

| Configuration Option             | Type             | Description                                                                                                                                                    |
| -------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| topics                           | Array of Strings | Defines the topics that the package will monitor.                                                                                                              |
| retentionInDays (optional)       | Integer          | Specifies the number of days to retain events in the database. Events are deleted when a new event is detected. If no events are received, no deletion occurs. |
| ignoreIdenticalEvents (optional) | Boolean          | If you want to ignore events with the same data (e.g., from retries), set this flag to `true`. Default: `false`.                                                            |
| dead-message-queues (optional)   | Array of Strings | Defines the dead-message queues that will be monitored. Be aware that messages from the DMQ will be consumed and acknowledged.                                 |

## Default service definition

The package includes a default service definition, providing an endpoint for interacting with event data.

```cds
service EventMonitoringService {

  action resendAll(topic : String, startTimestamp : Timestamp, endTimestamp : Timestamp);
  action resendDeadMessageQueue(queue : String);
  action sendToTopic(topic : String, message : LargeString);

  entity Events as projection on EventData
    actions {
      action resend();
      action resendToTopic(topic : String);
    };

}
```

The resend action allows requeuing the event back into the original topic.

## Extending the Service

To extend the existing service, add a new CDS service to your project and import the event monitoring service from the package:

```cds
using {EventMonitoringService} from 'cds-event-monitoring/srv';

extend EventMonitoringService with @(requires: 'admin');
```

In this example, the service is extended with a custom scope.

## Extending the Service and Event Logic

You can create your own service implementation that extends the existing one. Use the `@impl` annotation to reference an implementation file.

```cds
extend EventMonitoringService with @(impl: 'srv/event-ext.js');
```

Next, import the existing service implementation and extend it with your own logic:

```js
const cds = require('@sap/cds');
const EventServiceHandler = require('cds-event-monitoring/srv');
module.exports = class EventServiceExt extends EventServiceHandler {
  async init() {
    const messaging = await cds.connect.to('messaging');

    // extend messaging behavior
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
```

**Note**: New messaging handlers will execute before the event logic provided by the package, ensuring you do not overwrite existing logic.

Service extensions are also compatible with TS projects.

```TS
import cds from '@sap/cds';

import EventServiceHandler from 'cds-event-monitoring/srv';

export default class EventServiceExt extends EventServiceHandler {
  async init() {
    const messaging = await cds.connect.to('messaging');

    // extend messaging behavior
    messaging.on('*', (msg) => {
      const { data, event } = msg;
      console.log(data);
      console.log(event);
    });

    return super.init();
  }
}
```

## Fiori annotations

The `Events` includes several predefined Fiori annotations, which can be used and extended to develop an event monitoring UI.
You can find an example in the `testProject/app` folder of the github repository.

## Extending the database table

If you want to store specific fields in separate database columns (for example for searching purposes) you can do so, by extending the cds entity `EventData`.

```cds
using {event.monitoring.EventData} from 'cds-event-monitoring/db';

extend EventData with {
  description : String;
}
```

The new fields will be automatically filled with the data of the incoming event.
Make sure, that a corresponding data field is present in the event body.
In this example e.g.

```json
{
  "data": {
    ...,
    "description": "<description-string>"
  }
}
```
