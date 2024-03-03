import { useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    useLocation
  } from "react-router-dom";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages?hl=en#manual_pageviews
export const TrackPageView = () => {

    let location = useLocation();

    useEffect(() => {
 
        window.gtag('event', 'page_view', {
            page_location: location
        });

    }, [location]);

/**
 * 
 *  gtag('config', 'GA_MEASUREMENT_ID', {
        send_page_view: false
    });

    gtag('event', 'page_view', {
    page_title: '<Page Title>',
    page_location: '<Page Location>',
    page_path: '<Page Path>',
    send_to: '<GA_MEASUREMENT_ID>'
    })

 */
    
    //window.gtag('event', 'page_view');
    //console.log("TRACK ", location.pathname + location.search)
    return "";
}

export const trackError = error => {
    window.gtag('event', 'frontend-error', {
        'event_category' : 'error',
        'event_label' : error
    });
}

export const trackLoginWith = method => {
    window.gtag('event', 'login', {
        method 
    });
}

export const trackEvent = ( type, category, label ) => {
    window.gtag('event', type, {
        'event_category' : category,
        'event_label' : label
    });
}