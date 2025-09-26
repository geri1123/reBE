export type CacheEntry<T = any> = {
  data: T;
  expiresAt?: number; // Optional: for TTL caches
};

// Cache store type
type CacheStore = Record<string, CacheEntry>;

// memory store
const cache: CacheStore = {};

//Categories cache (20 min TTL) 
const CATEGORY_TTL = 20 * 60 * 1000;

export function getCategoriesFromCache(lang: string) {
  const entry = cache[`categories:${lang}`];
  if (!entry) return null;

  // Check TTL
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    delete cache[`categories:${lang}`];
    return null;
  }

  return entry.data;
}

export function setCategoriesCache(lang: string, data: any) {
  cache[`categories:${lang}`] = {
    data,
    expiresAt: Date.now() + CATEGORY_TTL,
  };
}

// Listing types cache (forever)
export function getListingTypesFromCache(lang: string) {
  return cache[`listingTypes:${lang}`]?.data || null;
}

export function setListingTypesCache(lang: string, data: any) {
  cache[`listingTypes:${lang}`] = {
    data,
  };
}


let cleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startCacheCleanup(interval = 5 * 60 * 1000) {
  if (cleanupInterval) return; 
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    Object.keys(cache).forEach((key) => {
      if (cache[key].expiresAt && now > cache[key].expiresAt) {
        delete cache[key];
      }
    });
  }, interval);
}

export function stopCacheCleanup() {
  if (cleanupInterval) clearInterval(cleanupInterval);
  cleanupInterval = null;
}
