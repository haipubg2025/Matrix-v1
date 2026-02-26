
const DB_NAME = 'QuantumNarratorDB';
const DB_VERSION = 1;
const STORE_NAME = 'gameState';

export interface SaveMetadata {
  playerName: string;
  level: number;
  timestamp: number;
  genre: string;
  worldId: string;
  turnCount: number;
  avatar?: string;
}

export class DBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    console.log("Initializing DB...");
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = (e) => {
        console.error("IndexedDB Open Error:", e);
        reject('Lỗi mở IndexedDB');
      };
      request.onsuccess = () => {
        console.log("DB Initialized successfully");
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = (event: any) => {
        console.log("DB Upgrade needed");
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  async save(data: any, slot: string): Promise<void> {
    console.log(`Saving to slot [${slot}]`, { playerName: data.player?.name, turnCount: data.player?.turnCount });
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const metadata: SaveMetadata = {
        playerName: data.player?.name || 'Vô Danh',
        level: data.player?.level || 1,
        timestamp: Date.now(),
        genre: data.selectedWorld?.genre || 'Chưa rõ',
        worldId: data.selectedWorld?.id || 'unknown',
        turnCount: data.player?.turnCount || 0,
        avatar: data.player?.avatar
      };

      try {
        const request = store.put({ ...data, metadata }, slot);
        request.onsuccess = () => {
          console.log(`Successfully saved to slot [${slot}]`);
          resolve();
        };
        request.onerror = (e) => {
          console.error("IndexedDB Put Error:", e);
          reject('Lỗi lưu dữ liệu: ' + (request.error?.message || 'Unknown error'));
        };
      } catch (err) {
        console.error("IndexedDB Sync Error:", err);
        reject('Lỗi đồng bộ IndexedDB: ' + err);
      }
    });
  }

  async load(slot: string): Promise<any> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(slot);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Lỗi tải dữ liệu');
    });
  }

  async delete(slot: string): Promise<void> {
    console.log(`Deleting slot [${slot}]`);
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(slot);
      request.onsuccess = () => {
        console.log(`Successfully deleted slot [${slot}]`);
        resolve();
      };
      request.onerror = () => reject('Lỗi xóa slot');
    });
  }

  async getLatestSave(): Promise<{slot: string, data: any} | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      request.onsuccess = async () => {
        const keys = request.result as string[];
        let latest: {slot: string, data: any} | null = null;

        for (const slot of keys) {
          const data = await this.load(slot);
          if (data && data.metadata) {
            if (!latest || data.metadata.timestamp > latest.data.metadata.timestamp) {
              latest = { slot, data };
            }
          }
        }
        resolve(latest);
      };
      request.onerror = () => reject('Lỗi tìm tệp lưu mới nhất');
    });
  }

  async getSlotsInfo(): Promise<Record<string, SaveMetadata | null>> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();
      request.onsuccess = async () => {
        const keys = request.result as string[];
        const result: Record<string, SaveMetadata | null> = {};
        for (const key of keys) {
          const data = await this.load(key);
          result[key] = data?.metadata || null;
        }
        resolve(result);
      };
      request.onerror = () => reject('Lỗi lấy danh sách slot');
    });
  }

  async clearAll(): Promise<void> {
    console.log("Clearing all data from DB...");
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => {
        console.log("Successfully cleared all data");
        resolve();
      };
      request.onerror = () => reject('Lỗi xóa toàn bộ dữ liệu');
    });
  }
}

export const dbService = new DBService();
