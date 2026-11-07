import { FavoriteItem, SearchHistoryItem, SearchResult } from '@/types';
import fs from 'fs';
import path from 'path';

// Local disk persistence fallback directory
const DATA_DIR = path.join(process.cwd(), '.data');
const HISTORY_FILE = path.join(DATA_DIR, 'searches.json');
const FAVORITES_FILE = path.join(DATA_DIR, 'favorites.json');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // safe fallback if read-only
    }
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    ensureDataDir();
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath: string, data: any): void {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

// In-Memory cache for superfast responses
let memoryHistory: SearchHistoryItem[] = [];
let memoryFavorites: FavoriteItem[] = [];
let memoryResults: Record<string, SearchResult[]> = {};

// Initial load
try {
  memoryHistory = readJsonFile<SearchHistoryItem[]>(HISTORY_FILE, []);
  memoryFavorites = readJsonFile<FavoriteItem[]>(FAVORITES_FILE, []);
  memoryResults = readJsonFile<Record<string, SearchResult[]>>(RESULTS_FILE, {});
} catch {
  // start clean
}

export const StorageService = {
  async saveSearch(searchItem: SearchHistoryItem, results: SearchResult[]): Promise<void> {
    memoryHistory = [searchItem, ...memoryHistory.filter(h => h.id !== searchItem.id)].slice(0, 100);
    memoryResults[searchItem.id] = results;

    writeJsonFile(HISTORY_FILE, memoryHistory);
    writeJsonFile(RESULTS_FILE, memoryResults);
  },

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    return memoryHistory;
  },

  async getSearchById(id: string): Promise<{ search: SearchHistoryItem | null; results: SearchResult[] }> {
    const search = memoryHistory.find(h => h.id === id) || null;
    const results = memoryResults[id] || [];
    return { search, results };
  },

  async clearHistory(): Promise<void> {
    memoryHistory = [];
    memoryResults = {};
    writeJsonFile(HISTORY_FILE, []);
    writeJsonFile(RESULTS_FILE, {});
  },

  async toggleFavorite(result: SearchResult, notes?: string, tags: string[] = []): Promise<boolean> {
    const existingIndex = memoryFavorites.findIndex(f => f.resultId === result.id);
    if (existingIndex >= 0) {
      // Remove
      memoryFavorites.splice(existingIndex, 1);
      writeJsonFile(FAVORITES_FILE, memoryFavorites);
      return false;
    } else {
      // Add
      const fav: FavoriteItem = {
        id: `fav-${Math.random().toString(36).substring(2, 11)}`,
        resultId: result.id,
        result,
        notes,
        tags,
        createdAt: new Date().toISOString(),
      };
      memoryFavorites = [fav, ...memoryFavorites];
      writeJsonFile(FAVORITES_FILE, memoryFavorites);
      return true;
    }
  },

  async getFavorites(): Promise<FavoriteItem[]> {
    return memoryFavorites;
  },

  async isFavorite(resultId: string): Promise<boolean> {
    return memoryFavorites.some(f => f.resultId === resultId);
  },

  async removeFavorite(resultId: string): Promise<void> {
    memoryFavorites = memoryFavorites.filter(f => f.resultId !== resultId);
    writeJsonFile(FAVORITES_FILE, memoryFavorites);
  },
};
