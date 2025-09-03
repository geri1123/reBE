type CacheEntry = {
  data: any;
  expiresAt?: number; // optional: only for TTL caches
};

type CacheStore = Record<string, CacheEntry>;
const cache: CacheStore = {};

// --- Categories cache (20 min TTL) ---
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

// --- Listing types cache (forever) ---
export function getListingTypesFromCache(lang: string) {
  return cache[`listingTypes:${lang}`]?.data || null;
}

export function setListingTypesCache(lang: string, data: any) {
  cache[`listingTypes:${lang}`] = {
    data,
    // no expiresAt → cached “forever”
  };
}


// type CacheEntry = {
//   data: any;
//   expiresAt: number;
// };

// type CacheStore = Record<string, CacheEntry>;
// const categoriesCache: CacheStore = {};


// const TTL = 20 * 60 * 1000;

// export function getCategoriesFromCache(lang: string) {
//   const entry = categoriesCache[lang];

//   if (!entry) return null; 

//   // check if cache expired
//   if (Date.now() > entry.expiresAt) {
//     delete categoriesCache[lang];
//     return null;
//   }

//   return entry.data;
// }

// export function setCategoriesCache(lang: string, data: any) {
//   categoriesCache[lang] = {
//     data,
//     expiresAt: Date.now() + TTL, 
//   };
// }
