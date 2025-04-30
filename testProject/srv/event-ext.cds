using {EventMonitoringService} from '@brenntag/dih-dl-event-monitoring-package/srv';

extend EventMonitoringService with @(requires: 'admin');
extend EventMonitoringService with @(impl: 'srv/event-ext.js');
