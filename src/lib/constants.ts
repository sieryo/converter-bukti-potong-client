
const BASE_API_PATH = import.meta.env.VITE_API_BASE ? `${import.meta.env.VITE_API_BASE}/api` : "/api"
const VERSION = import.meta.env.VITE_VERSION;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;


export {
  BASE_API_PATH,
  ENVIRONMENT,
  VERSION,
};
