import Game from './components/game.jsx';
import React from 'react';
import ReactDOM from 'react-dom';


/**
* Check to make sure service workers are supported in the current browser,
*   and that the current page is accessed from a secure origin.
*/
var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

// Run service worker
if ('serviceWorker' in navigator &&
  (window.location.protocol == 'https:' || isLocalhost)) {
  navigator.serviceWorker.register('sw.js', {
    scope: '/'
  })
  .then((registration) => {
    console.log('Service Worker has been registered');
  }).catch((e) => {
    console.error('Errur during service worker registration:', e);
  });
}

// Fire up application
ReactDOM.render(
  <Game/>,
  document.getElementById('container')
);
