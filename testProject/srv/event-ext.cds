using {EventMonitoringService} from 'cds-event-monitoring/srv';

extend EventMonitoringService with @(requires: 'admin');
extend EventMonitoringService with @(impl: 'srv/event-ext.js');
