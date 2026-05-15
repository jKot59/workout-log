import { DayOfWeek } from '@/widgets/appSider';
import { BaseIndexedDBManager, BaseItem } from './BaseIndexedDBManager';
import { IExercise } from '@/stores/programs-store';

export interface ProgramItem extends BaseItem {
  id?: number;
  name: DayOfWeek;
  exercises: IExercise[];
  timestamp?: string;
}

export class ProgramDatabase extends BaseIndexedDBManager<ProgramItem> {
  constructor() {
    super('WorkoutProgramsDB', 1, 'programs');
  }

  // Override onupgradeneeded if needed
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
          });

          // Create your specific indexes
          objectStore.createIndex('name', 'name', { unique: true });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Business-specific methods using base class methods
  async getProgramByName(name: DayOfWeek): Promise<ProgramItem | undefined> {
    const allPrograms = await this.getAllItems();
    return allPrograms.find((program) => program.name === name);
  }

  async addProgram(program: Omit<ProgramItem, 'id'>): Promise<number> {
    const programWithTimestamp = {
      ...program,
      timestamp: new Date().toISOString(),
    };
    return this.addItem(programWithTimestamp);
  }

  async updateProgram(program: ProgramItem): Promise<number> {
    const updatedProgram = {
      ...program,
      timestamp: new Date().toISOString(),
    };
    return this.updateItem(updatedProgram);
  }

  async deleteProgramByName(name: DayOfWeek): Promise<void> {
    await this.deleteItem(name);
  }
}
