import { BaseIndexedDBManager, BaseItem } from './BaseIndexedDBManager';

export interface IExerciseItem extends BaseItem {
  name: string;
  image?: string; // Can be base64 string, URL, or blob
  imageType?: 'url' | 'base64' | 'blob';
  description?: string;
  muscleGroup?: string;
}

const PRESET_EXERCISES: IExerciseItem[] = [
  { name: 'Bulgarian split squats', image: '/images/exercises/bulgarian_split_squats.jpeg', muscleGroup: 'legs' },
  { name: 'Calf raises', image: '/images/exercises/calf_raises.jpeg', muscleGroup: 'legs' },
  { name: 'Hindu push-ups', image: '/images/exercises/hindu_pushups.jpeg', muscleGroup: 'chest' },
  { name: 'Parallel bar dips', image: '/images/exercises/dips.jpeg', muscleGroup: 'chest' },
  { name: 'Pull-ups', image: '/images/exercises/pull_ups.jpeg', muscleGroup: 'back' },
  { name: 'Knee to chest on parallel bars', image: '/images/exercises/knees_to_chest.jpeg', muscleGroup: 'abdominal' },
  { name: 'Biceps pull-ups', image: '/images/exercises/biceps_pull_ups.jpeg', muscleGroup: 'arms' },
];

export class ExercisesDatabase extends BaseIndexedDBManager<IExerciseItem> {
  private presetExercisesAdded: boolean = false;

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

        // Check and add preset exercises after successful open
        await this.ensurePresetExercises();

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

  private async ensurePresetExercises(): Promise<void> {
    if (this.presetExercisesAdded) return;

    try {
      const existingExercises = await this.getAllItems();

      // Only add presets if database is empty
      if (existingExercises.length === 0) {
        for (const exercise of PRESET_EXERCISES) {
          await this.addExercise(exercise);
        }
      }

      this.presetExercisesAdded = true;
    } catch (error) {
      console.error('Failed to add preset exercises:', error);
    }
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
