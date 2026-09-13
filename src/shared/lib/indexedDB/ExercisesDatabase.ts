import { BaseIndexedDBManager, BaseItem } from './BaseIndexedDBManager';

export interface IExerciseItem extends BaseItem {
  name: string;
  image?: string; // Can be base64 string, URL, or blob
  imageType?: 'url' | 'base64' | 'blob';
  description?: string;
  muscleGroup?: string;
}

export class ExercisesDatabase extends BaseIndexedDBManager<IExerciseItem> {
  constructor() {
    super('ExercisesDB', 1, 'exercises');
  }

  // Override openDB to create custom indexes for exercises
  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        this.db = request.result;

        resolve(this.db);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });

          // Create indexes for better querying
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('muscleGroup', 'muscleGroup', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  // Business-specific methods for exercises
  async addExercise(exercise: IExerciseItem): Promise<number> {
    const newExercise: IExerciseItem = { ...exercise };
    return this.addItem(newExercise);
  }

  async getExerciseByName(name: string): Promise<IExerciseItem | undefined> {
    const allExercises = await this.getAllItems();
    return allExercises.find((exercise) => exercise.name.toLowerCase() === name.toLowerCase());
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<IExerciseItem[]> {
    const allExercises = await this.getAllItems();
    return allExercises.filter((exercise) => exercise.muscleGroup?.toLowerCase() === muscleGroup.toLowerCase());
  }

  async updateExercise(exercise: IExerciseItem): Promise<number> {
    const updatedExercise = {
      ...exercise,
      updatedAt: new Date().toISOString(),
    };
    return this.updateItem(updatedExercise);
  }

  async deleteExerciseById(id: number): Promise<void> {
    await this.deleteItem(id);
  }

  async searchExercises(searchTerm: string): Promise<IExerciseItem[]> {
    const allExercises = await this.getAllItems();
    return allExercises.filter((exercise) => exercise.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}
