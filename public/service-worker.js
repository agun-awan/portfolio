importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);


workbox.routing.registerRoute(
	new RegExp('/photos/'),
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'photos',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 15
			}),
			new workbox.cacheableResponse.Plugin({
				statuses: [200]
			})
		]
	})
);
	
workbox.precaching.precacheAndRoute([
  {
    "url": "css/app.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/app.js",
    "revision": "024de067b4f5aecc50046ba824965873"
  },
  {
    "url": "logo.png",
    "revision": "5fc1fee143839e3ce88b2f2cfad07c38"
  },
  {
    "url": "sw-base.js",
    "revision": "61ad1af04d541258eacbf7f286675f77"
  },
  {
    "url": "offline.html",
    "revision": "c26121d08e17aac5d3dadd5c3439d09e"
  }
]);

const networkFirstHandler = new workbox.strategies.NetworkFirst({
	cacheName: 'dynamic',
	plugins: [
		new workbox.expiration.Plugin({
			maxEntries: 10
		}),
		new workbox.cacheableResponse.Plugin({
			statuses: [200]
		})
	]
});

const FALLBACK_URL = workbox.precaching.getCacheKeyForURL('/offline.html');
const matcher = ({ event }) => event.request.mode === 'navigate';
const handler = args =>
	networkFirstHandler
		.handle(args)
		.then(response => response || caches.match(FALLBACK_URL))
		.catch(() => caches.match(FALLBACK_URL));

workbox.routing.registerRoute(matcher, handler);