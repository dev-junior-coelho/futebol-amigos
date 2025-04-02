// Utilitário simples de cache
const cache = {
  data: {},
  set: (key, value, ttl = 300000) => { // TTL padrão de 5 minutos
    const now = new Date().getTime();
    cache.data[key] = {
      value,
      expiry: now + ttl
    };
  },
  get: (key) => {
    const cachedItem = cache.data[key];
    if (!cachedItem) return null;
    
    const now = new Date().getTime();
    if (now > cachedItem.expiry) {
      delete cache.data[key];
      return null;
    }
    
    return cachedItem.value;
  },
  clear: () => {
    cache.data = {};
  }
};

export default cache;
