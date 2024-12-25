import { MongoClient, Db, Collection } from 'mongodb';

class Database {
  private static instance: Database;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;
  private readonly maxRetries: number = 3;
  private readonly retryInterval: number = 7000; // 7 seconds

  private constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
  }
  

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (this.isConnected && this.client) {
        return;
      }

      let retries = 0;
      while (retries < this.maxRetries) {
        try {
          this.client = await MongoClient.connect(process.env.MONGODB_URI!);
          this.db = this.client.db('sample_mflix');
          this.isConnected = true;
          console.log('Successfully connected to MongoDB.');
          return;
        } catch (error) {
          retries++;
          console.error(`Connection attempt ${retries} failed. Retrying...`);
          await new Promise(resolve => setTimeout(resolve, this.retryInterval));
        }
      }
      throw new Error('Failed to connect to MongoDB after maximum retries');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.client && this.isConnected) {
        await this.client.close();
        this.isConnected = false;
        this.client = null;
        this.db = null;
        console.log('Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  public getCollection(collectionName: string) {
    if (!this.db) {
      throw new Error('Database connection not established');
    }
    return this.db.collection(collectionName);
  }

  public async ping(): Promise<boolean> {
    try {
      if (!this.db) {
        return false;
      }
      await this.db.command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }

  public isConnectedToDb(): boolean {
    return this.isConnected;
  }
  
}


export default Database;