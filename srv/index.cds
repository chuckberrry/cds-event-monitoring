using {cap.plugin.eventmonitoring.EventData} from '../db';

// -- Fiori Annotations ----------------------------------------------------------

////////////////////////////////////////////////////////////////////////////
//
//	Event List
//
annotate EventMonitoringService.EventDataView with @UI: {
  SelectionFields: [
    createdAt,
    topic
  ],
  LineItem       : [
    {Value: ID},
    {Value: createdAt},
    {Value: topic},
  ]
};


////////////////////////////////////////////////////////////////////////////
//
//	Event Details
//
annotate EventMonitoringService.EventDataView with @(UI: {
  Identification  : [
    {
      $Type             : 'UI.DataFieldForAction',
      Action            : 'EventMonitoringService.resend',
      Label             : '{i18n>Resend}',
      InvocationGrouping: #Isolated
    },
    {
      $Type             : 'UI.DataFieldForAction',
      Action            : 'EventMonitoringService.resendToTopic',
      Label             : '{i18n>ResendToTopic}',
      InvocationGrouping: #Isolated
    }
  ],
  HeaderInfo      : {
    TypeName      : '{i18n>EventData}',
    TypeNamePlural: '{i18n>EventData}',
    Title         : {Value: ID},
    Description   : {Value: topic}
  },
  Facets          : [{
    $Type : 'UI.ReferenceFacet',
    Label : '{i18n>Data}',
    Target: '@UI.FieldGroup#Data'
  }, ],
  FieldGroup #Data: {

  Data: [{Value: data}, ]},
});

@(impl: 'cds-event-monitoring/srv')
service EventMonitoringService {

  action resendAll(topic : String, startTimestamp : Timestamp, endTimestamp : Timestamp);
  action resendDeadMessageQueue(queue : String);
  action sendToTopic(topic : String, message : LargeString);
  entity EventDataView as projection on EventData
    actions {
      action resend();
      action resendToTopic(topic : String);
    };

}
