// service worker will cache the app data for offline use

const FILES_TO_CACHE = [
    "./index.html",
]
const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log('installing cache: ' + CACHE_NAME);
            // this will add all files in FILES_TO_CACHE array to the cache
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

// clear out old data from cache and tell service worker how to manage caches
self.addEventListener('activate', function(e){
    e.waitUntil(
        // keys returns array of cached names as keyList
        caches.keys().then(function(keyList){
            let cacheKeepList = keyList.filter(function (key){
                return key.indexOf(APP_PREFIX);
            })
            // add current cache to keepList
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i){
                if(cacheKeepList.indexOf(key) === -1){
                    console.log('deleting cache: ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        }));
});

// tells browser how to handle fetch requests
self.addEventListener('fetch', function(e){
    console.log('fetch request: ' + e.request.url)
    // intecept fetch request
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if(request){
                console.log('responding with cache: ' + e.request.url);
                return request;
            } else {
                console.log('file is not cached, fetching: ' + e.request.url);
                return (e.request)
            }
        })
    )
})



