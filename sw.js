// 캐시 이름에 버전을 포함 — 코드를 수정해 배포할 때 이 버전만 올리면
// activate 단계에서 구버전 캐시를 자동으로 정리한다
const CACHE_VERSION = 'v2';
const CACHE_NAME = `incheon-travel-${CACHE_VERSION}`;

// 설치 시 미리 캐싱할 핵심 자산(앱 셸)만 포함 — 용량이 큰 images 폴더나
// 나머지 페이지는 포함하지 않고, 사용자가 실제로 방문할 때 fetch에서 캐싱한다
// offline.html은 캐시에도 없고 네트워크도 끊겼을 때 보여줄 오프라인 안내 페이지라 미리 캐싱해둔다
const APP_SHELL = [
    './index.html',
    './offline.html',
    './css/common.css',
    './js/common.js',
    './manifest.json',
    './icon/bridge.png',
    './icon/bridge-192.png',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// stale-while-revalidate: 캐시에 있으면 즉시 응답해 빠르고 오프라인에서도 보이게 하고,
// 동시에 네트워크로 최신 버전을 받아와 다음 방문을 위해 캐시를 갱신한다.
// 캐시에 없으면 네트워크 응답을 기다리고, 성공하면 캐시에 저장한다.
self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return; // 카카오맵·구글맵·폰트 CDN 등 외부 요청은 그대로 네트워크로

    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>
            cache.match(request).then(cached => {
                const networkFetch = fetch(request)
                    .then(response => {
                        if (response.ok) cache.put(request, response.clone());
                        return response;
                    })
                    .catch(() => {
                        if (cached) return cached; // 캐시에 있으면 그걸로 대체
                        // 캐시에도 없는 페이지면(오프라인 + 처음 방문) 오프라인 안내 페이지로 대체
                        if (request.mode === 'navigate') return cache.match('./offline.html');
                    });

                return cached || networkFetch;
            })
        )
    );
});
