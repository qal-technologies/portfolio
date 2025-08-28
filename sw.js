const CACHE_NAME = 'pascodes-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/animation.css',
    '/css/general.css',
    '/css/home.css',
    '/css/media.css',
    '/css/cart.css',
    '/css/contact.css',
    '/css/service.css',
    '/css/blog.css',
    '/css/courses.css',
    '/css/auth.css',
    '/css/admin.css',
    '/js/general.js',
    '/js/service.js',
    '/src/images/logo.png',
    '/src/images/logo-trans.png',
    '/src/images/name-with-logo.png',
    '/src/images/Picsart_25-06-07_09-55-35-367.jpg',
    '/src/images/Picsart_25-06-07_10-04-28-098.jpg',
    '/src/images/Picsart_25-06-07_10-06-49-318.jpg',
    '/html/cart.html',
    '/html/contact.html',
    '/html/services.html',
    '/html/blog.html',
    '/html/courses.html',
    '/html/login.html',
    '/html/signup.html',
    '/html/admin.html',
    'https://cdn.jsdelivr.net/npm/devicon@2.15.1/devicon.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
