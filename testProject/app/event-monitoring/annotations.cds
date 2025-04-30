using EventMonitoringService as service from '../../srv/event-ext.cds';

annotate service.Events with @UI: {
  SelectionFields: [
    createdAt,
    topic,
    entityKey
  ],
  LineItem       : [
    {Value: ID},
    {Value: createdAt},
    {Value: topic},
    {Value: entityKey}
  ]
};

annotate service.Events with {
    entityKey @Common.Label : '{i18n>EntityKey}'
};