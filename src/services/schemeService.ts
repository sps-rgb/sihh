import { Scheme } from '@/types';
import schemeData from '@/data/schemes.json';

export function getAllSchemes(): Scheme[] {
  return schemeData.schemes as Scheme[];
}

export function getSchemeById(id: string): Scheme | undefined {
  return getAllSchemes().find((scheme) => scheme.id === id);
}
