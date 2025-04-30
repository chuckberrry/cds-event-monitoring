sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'event.monitoring.eventmonitoringapp',
            componentId: 'EventsList',
            entitySet: 'Events'
        },
        CustomPageDefinitions
    );
});