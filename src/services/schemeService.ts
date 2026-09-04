import { Scheme } from '@/types';
import schemeData from '@/data/schemes.json';
import { fetchSupabaseSchemes, fetchSupabaseSchemeById } from '@/lib/supabase';

let memoryCache: Scheme[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

/**
 * Returns all schemes from Supabase database, falling back to local dataset if unavailable.
 */
export async function getAllSchemes(): Promise<Scheme[]> {
  const now = Date.now();
  if (memoryCache && now - lastCacheTime < CACHE_TTL_MS) {
    return memoryCache;
  }

  const supabaseSchemes = await fetchSupabaseSchemes();
  if (supabaseSchemes && supabaseSchemes.length > 0) {
    memoryCache = supabaseSchemes;
    lastCacheTime = now;
    return supabaseSchemes;
  }

  // Fallback to local schemes if database is unreachable
  return getAllSchemesSync();
}

/**
 * Returns a specific scheme by ID from Supabase database or local fallback.
 */
export async function getSchemeById(id: string): Promise<Scheme | undefined> {
  const schemes = await getAllSchemes();
  const found = schemes.find((scheme) => scheme.id.toLowerCase() === id.toLowerCase());
  if (found) return found;

  const direct = await fetchSupabaseSchemeById(id);
  if (direct) return direct;

  return getSchemeByIdSync(id);
}

/**
 * Synchronously returns local schemes (useful for unit tests and fallback).
 */
export function getAllSchemesSync(): Scheme[] {
  return schemeData.schemes as Scheme[];
}

/**
 * Synchronously returns a local scheme by ID.
 */
export function getSchemeByIdSync(id: string): Scheme | undefined {
  return getAllSchemesSync().find((scheme) => scheme.id === id);
}
