
// ============================================
// FILE: backend/src/cache/filtersCache.ts
// ============================================

export type CacheEntry<T = any> = {
  data: T;
  expiresAt?: number;
  lastAccessed: number;
  size: number; // in bytes
};

type CacheStore = Record<string, CacheEntry>;

// Configuration
const CONFIG = {
  CATEGORY_TTL: 20 * 60 * 1000, // 20 minutes
  ATTRIBUTES_TTL: 30 * 60 * 1000, // 30 minutes
  LISTING_TYPES_TTL: Infinity, // Never expires
  MAX_TOTAL_ENTRIES: 200,
  MAX_ATTRIBUTE_ENTRIES: 150,
  MAX_CACHE_SIZE_MB: 10, // 10MB total
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  STATS_LOG_INTERVAL: 60 * 1000, // 1 minute
  ENABLE_STATS_LOGGING: process.env.NODE_ENV !== 'production',
};

const cache: CacheStore = {};
let cleanupInterval: ReturnType<typeof setInterval> | null = null;
let statsInterval: ReturnType<typeof setInterval> | null = null;



function calculateSize(data: any): number {
  try {
    return new TextEncoder().encode(JSON.stringify(data)).length;
  } catch {
    return 0;
  }
}

function getTotalCacheSize(): number {
  return Object.values(cache).reduce((sum, entry) => sum + entry.size, 0);
}

function getTotalCacheSizeMB(): number {
  return getTotalCacheSize() / (1024 * 1024);
}

function isExpired(entry: CacheEntry): boolean {
  return entry.expiresAt !== undefined && Date.now() > entry.expiresAt;
}

// ============================================
// CACHE EVICTION STRATEGIES
// ============================================

function evictExpiredEntries(): number {
  const now = Date.now();
  let evicted = 0;

  Object.keys(cache).forEach((key) => {
    if (isExpired(cache[key])) {
      delete cache[key];
      evicted++;
    }
  });

  if (evicted > 0) {
    console.log(`🗑️  Evicted ${evicted} expired cache entries`);
  }

  return evicted;
}

function evictLRUEntry(): void {
  const keys = Object.keys(cache);
  if (keys.length === 0) return;

  // Find least recently used entry
  const lruKey = keys.reduce((oldest, key) => {
    return cache[key].lastAccessed < cache[oldest].lastAccessed ? key : oldest;
  }, keys[0]);

  console.log(`🗑️  Evicting LRU entry: ${lruKey}`);
  delete cache[lruKey];
}

function evictOldestAttributeEntry(): void {
  const attributeKeys = Object.keys(cache).filter((k) => k.startsWith('attributes:'));
  
  if (attributeKeys.length === 0) return;

  const oldestKey = attributeKeys.reduce((oldest, key) => {
    return cache[key].lastAccessed < cache[oldest].lastAccessed ? key : oldest;
  }, attributeKeys[0]);

  console.log(`🗑️  Evicting oldest attribute entry: ${oldestKey}`);
  delete cache[oldestKey];
}

function enforceMaxEntries(): void {
  const totalEntries = Object.keys(cache).length;
  
  if (totalEntries >= CONFIG.MAX_TOTAL_ENTRIES) {
    console.warn(`⚠️  Cache at max entries (${totalEntries}/${CONFIG.MAX_TOTAL_ENTRIES})`);
    evictLRUEntry();
  }

  const attributeKeys = Object.keys(cache).filter((k) => k.startsWith('attributes:'));
  if (attributeKeys.length >= CONFIG.MAX_ATTRIBUTE_ENTRIES) {
    console.warn(`⚠️  Attribute cache at limit (${attributeKeys.length}/${CONFIG.MAX_ATTRIBUTE_ENTRIES})`);
    evictOldestAttributeEntry();
  }
}

function enforceMaxSize(): void {
  const sizeMB = getTotalCacheSizeMB();
  
  if (sizeMB >= CONFIG.MAX_CACHE_SIZE_MB) {
    console.warn(`⚠️  Cache size limit reached (${sizeMB.toFixed(2)}MB/${CONFIG.MAX_CACHE_SIZE_MB}MB)`);
    
    while (getTotalCacheSizeMB() >= CONFIG.MAX_CACHE_SIZE_MB * 0.8) {
      evictLRUEntry();
      if (Object.keys(cache).length === 0) break;
    }
  }
}

// ============================================
// CATEGORIES CACHE
// ============================================

export function getCategoriesFromCache(lang: string): any | null {
  const key = `categories:${lang}`;
  const entry = cache[key];

  if (!entry) {
    console.log(`[CACHE MISS] Categories for lang=${lang}`);
    return null;
  }

  if (isExpired(entry)) {
    console.log(`[CACHE EXPIRED] Categories for lang=${lang}`);
    delete cache[key];
    return null;
  }

  entry.lastAccessed = Date.now();
  console.log(`[CACHE HIT] Categories for lang=${lang}`);
  return entry.data;
}

export function setCategoriesCache(lang: string, data: any): void {
  enforceMaxEntries();
  enforceMaxSize();

  const key = `categories:${lang}`;
  const size = calculateSize(data);
  
  cache[key] = {
    data,
    expiresAt: Date.now() + CONFIG.CATEGORY_TTL,
    lastAccessed: Date.now(),
    size,
  };

  console.log(`[CACHE SET] Categories for lang=${lang} (${(size / 1024).toFixed(2)}KB)`);
}

// ============================================
// LISTING TYPES CACHE
// ============================================

export function getListingTypesFromCache(lang: string): any | null {
  const key = `listingTypes:${lang}`;
  const entry = cache[key];

  if (!entry) {
    console.log(`[CACHE MISS] Listing types for lang=${lang}`);
    return null;
  }

  entry.lastAccessed = Date.now();
  console.log(`[CACHE HIT] Listing types for lang=${lang}`);
  return entry.data;
}

export function setListingTypesCache(lang: string, data: any): void {
  enforceMaxEntries();
  enforceMaxSize();

  const key = `listingTypes:${lang}`;
  const size = calculateSize(data);
  
  cache[key] = {
    data,
    expiresAt: undefined, // Never expires
    lastAccessed: Date.now(),
    size,
  };

  console.log(`[CACHE SET] Listing types for lang=${lang} (${(size / 1024).toFixed(2)}KB)`);
}

// ============================================
// ATTRIBUTES CACHE
// ============================================

export function getAttributesFromCache(key: string): any | null {
  const cacheKey = `attributes:${key}`;
  const entry = cache[cacheKey];

  if (!entry) {
    console.log(`[CACHE MISS] Attributes for key=${key}`);
    return null;
  }

  if (isExpired(entry)) {
    console.log(`[CACHE EXPIRED] Attributes for key=${key}`);
    delete cache[cacheKey];
    return null;
  }

  entry.lastAccessed = Date.now();
  console.log(`[CACHE HIT] Attributes for key=${key}`);
  return entry.data;
}

export function setAttributesCache(key: string, data: any): void {
  enforceMaxEntries();
  enforceMaxSize();

  const cacheKey = `attributes:${key}`;
  const size = calculateSize(data);
  
  cache[cacheKey] = {
    data,
    expiresAt: Date.now() + CONFIG.ATTRIBUTES_TTL,
    lastAccessed: Date.now(),
    size,
  };

  console.log(`[CACHE SET] Attributes for key=${key} (${(size / 1024).toFixed(2)}KB)`);
}

// ============================================
// CACHE STATISTICS
// ============================================

export interface CacheStats {
  totalEntries: number;
  categoriesCount: number;
  listingTypesCount: number;
  attributesCount: number;
  totalSizeBytes: number;
  totalSizeMB: number;
  expiredEntries: number;
  oldestEntry: { key: string; ageSeconds: number } | null;
  newestEntry: { key: string; ageSeconds: number } | null;
}

export function getCacheStats(): CacheStats {
  const now = Date.now();
  const keys = Object.keys(cache);
  
  let oldestKey: string | null = null;
  let oldestTime = Infinity;
  let newestKey: string | null = null;
  let newestTime = 0;
  let expiredCount = 0;

  keys.forEach((key) => {
    const entry = cache[key];
    
    if (isExpired(entry)) {
      expiredCount++;
    }
    
    if (entry.lastAccessed < oldestTime) {
      oldestTime = entry.lastAccessed;
      oldestKey = key;
    }
    
    if (entry.lastAccessed > newestTime) {
      newestTime = entry.lastAccessed;
      newestKey = key;
    }
  });

  return {
    totalEntries: keys.length,
    categoriesCount: keys.filter((k) => k.startsWith('categories:')).length,
    listingTypesCount: keys.filter((k) => k.startsWith('listingTypes:')).length,
    attributesCount: keys.filter((k) => k.startsWith('attributes:')).length,
    totalSizeBytes: getTotalCacheSize(),
    totalSizeMB: getTotalCacheSizeMB(),
    expiredEntries: expiredCount,
    oldestEntry: oldestKey ? {
      key: oldestKey,
      ageSeconds: Math.floor((now - oldestTime) / 1000),
    } : null,
    newestEntry: newestKey ? {
      key: newestKey,
      ageSeconds: Math.floor((now - newestTime) / 1000),
    } : null,
  };
}

export function logCacheStats(): void {
  const stats = getCacheStats();
  
  console.log('\n📊 Cache Statistics:');
  console.log(`   Total: ${stats.totalEntries}/${CONFIG.MAX_TOTAL_ENTRIES} entries`);
  console.log(`   - Categories: ${stats.categoriesCount}`);
  console.log(`   - Listing Types: ${stats.listingTypesCount}`);
  console.log(`   - Attributes: ${stats.attributesCount}/${CONFIG.MAX_ATTRIBUTE_ENTRIES}`);
  console.log(`   Size: ${stats.totalSizeMB.toFixed(2)}MB / ${CONFIG.MAX_CACHE_SIZE_MB}MB`);
  console.log(`   Expired: ${stats.expiredEntries}`);
  
  if (stats.totalEntries > CONFIG.MAX_TOTAL_ENTRIES * 0.8) {
    console.warn(`   ⚠️  High usage: ${((stats.totalEntries / CONFIG.MAX_TOTAL_ENTRIES) * 100).toFixed(1)}%`);
  }
  
  if (stats.totalSizeMB > CONFIG.MAX_CACHE_SIZE_MB * 0.8) {
    console.warn(`   ⚠️  High size: ${((stats.totalSizeMB / CONFIG.MAX_CACHE_SIZE_MB) * 100).toFixed(1)}%`);
  }
  
  console.log('');
}

// ============================================
// CACHE MANAGEMENT
// ============================================

export function clearCache(): void {
  const keys = Object.keys(cache);
  keys.forEach((key) => delete cache[key]);
  console.log(`🗑️  Cache cleared (${keys.length} entries removed)`);
}

export function clearCacheByPattern(pattern: string): number {
  const keys = Object.keys(cache).filter((key) => key.includes(pattern));
  keys.forEach((key) => delete cache[key]);
  console.log(`🗑️  Cleared ${keys.length} entries matching: ${pattern}`);
  return keys.length;
}

export function startCacheCleanup(interval?: number): void {
  if (cleanupInterval) {
    console.warn('⚠️  Cache cleanup already running');
    return;
  }

  const cleanupInt = interval || CONFIG.CLEANUP_INTERVAL;

  cleanupInterval = setInterval(() => {
    const evicted = evictExpiredEntries();
    if (evicted === 0 && CONFIG.ENABLE_STATS_LOGGING) {
      console.log('🧹 Cache cleanup: No expired entries');
    }
  }, cleanupInt);

  console.log(`✅ Cache cleanup started (every ${cleanupInt / 1000}s)`);
}

export function stopCacheCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log('⏹️  Cache cleanup stopped');
  }
}

export function startStatsLogging(): void {
  if (!CONFIG.ENABLE_STATS_LOGGING) {
    return;
  }

  if (statsInterval) {
    console.warn('⚠️  Stats logging already running');
    return;
  }

  statsInterval = setInterval(() => {
    logCacheStats();
  }, CONFIG.STATS_LOG_INTERVAL);

  console.log(`✅ Stats logging started (every ${CONFIG.STATS_LOG_INTERVAL / 1000}s)`);
}

export function stopStatsLogging(): void {
  if (statsInterval) {
    clearInterval(statsInterval);
    statsInterval = null;
    console.log('⏹️  Stats logging stopped');
  }
}

// ============================================
// INITIALIZATION
// ============================================

export function initializeCache(): void {
  console.log('🚀 Initializing cache system...');
  console.log(`   Max entries: ${CONFIG.MAX_TOTAL_ENTRIES}`);
  console.log(`   Max attributes: ${CONFIG.MAX_ATTRIBUTE_ENTRIES}`);
  console.log(`   Max size: ${CONFIG.MAX_CACHE_SIZE_MB}MB`);
  console.log(`   Category TTL: ${CONFIG.CATEGORY_TTL / 60000}min`);
  console.log(`   Attributes TTL: ${CONFIG.ATTRIBUTES_TTL / 60000}min`);
  
  startCacheCleanup();
  
  if (CONFIG.ENABLE_STATS_LOGGING) {
    startStatsLogging();
  }
  
  console.log('✅ Cache system initialized\n');
}

export function shutdownCache(): void {
  console.log('⏹️  Shutting down cache system...');
  stopCacheCleanup();
  stopStatsLogging();
  clearCache();
  console.log('✅ Cache system shut down');
}

// ============================================
// AUTO-INITIALIZATION
// ============================================
// Automatically initialize when module is imported
// No manual setup needed in index.ts!
let isInitialized = false;

function autoInitialize() {
  if (!isInitialized && process.env.NODE_ENV !== 'test') {
    console.log('🔄 Auto-initializing cache system...');
    initializeCache();
    isInitialized = true;
  }
}

// Auto-initialize on import
autoInitialize();

// Graceful shutdown
if (process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', shutdownCache);
  process.on('SIGTERM', shutdownCache);
}
