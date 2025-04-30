sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'event/monitoring/eventmonitoringapp/test/integration/FirstJourney',
		'event/monitoring/eventmonitoringapp/test/integration/pages/EventsList',
		'event/monitoring/eventmonitoringapp/test/integration/pages/EventsObjectPage'
    ],
    function(JourneyRunner, opaJourney, EventsList, EventsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('event/monitoring/eventmonitoringapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheEventsList: EventsList,
					onTheEventsObjectPage: EventsObjectPage
                }
            },
            opaJourney.run
        );
    }
);