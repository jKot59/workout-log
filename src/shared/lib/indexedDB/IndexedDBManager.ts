import { IExercise } from '@/stores/programs-store';
import { DayOfWeek } from '@/widgets/appSider';

export interface IndexedDBItem {
  name: DayOfWeek;
  exercises: IExercise[];
  [key: string]: unknown;
}

export class IndexedDBManager<T extends IndexedDBItem = IndexedDBItem> {
  private dbName: string;
  private version: number;
  private storeName: string;
  private db: IDBDatabase | null;

  constructor(dbName: string, version: number, storeName: string) {
    this.dbName = dbName;
    this.version = version;
    this.storeName = storeName;
    this.db = null;
  }

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, {
            keyPath: 'name',
            // autoIncrement: true,
          });
          objectStore.createIndex('name', 'name', { unique: true });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async addItem(item: Omit<T, 'id'>): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized. Call openDB() first.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add(item);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as number);
    });
  }

  async getAllItems(): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not initialized. Call openDB() first.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T[]);
    });
  }

  async getItemByProgramName(name: DayOfWeek): Promise<T | undefined> {
    if (!this.db) {
      throw new Error('Database not initialized. Call openDB() first.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(name);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T | undefined);
    });
  }

  async updateItem(item: T): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized. Call openDB() first.');
    }

    if (!item.name) {
      throw new Error('Item must have an id property to update');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.put(item);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as number);
    });
  }

  async deleteItem(id: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized. Call openDB() first.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearAllItems(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized. Call openDB() first.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getCount(): Promise<number> {
    if (!this.db) {
      throw new Error('Database not initialized. Call openDB() first.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.count();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  closeDB(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
