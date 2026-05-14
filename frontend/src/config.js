// src/config.js

// Using Vite Environment variables if available, falling back to the provided Bluehost domain.
// NOTE: Verify if "hrntechsolutions" requires a domain extension like .com, .in, etc.
const BASE_DOMAIN = import.meta.env.VITE_DOMAIN_URL || "https://hrntechsolutions.com";

export const API_BASE_URL = `${BASE_DOMAIN}/backend/api`;
export const ADMIN_BASE_URL = `${BASE_DOMAIN}/backend/admin/`;
