import ReactGA from 'react-ga';

const trackingId = 'G-L1M8RFSJ0Q'; // Replace with your Google Analytics Tracking ID
ReactGA.initialize(trackingId);

export const logPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);
};

