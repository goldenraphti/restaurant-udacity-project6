var staticCacheName = 'restaurant-static-v1';

self.addEventListener('install', function(event) {

    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                'sw.js',
                'index.html',
                'restaurant.html',
                'js/main.js',
                'js/restaurant-info.js',
                'js/dbhelper.js',
                'data/restaurant.json',
                'css/styles.css',
                'img/',
                'img/icons/asian-food.svg',
                'img/icons/bbq.svg',
                'img/icons/mexican-tacos.svg',
                'img/icons/pizza.svg',
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['staticCacheName'];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function(event) {

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});