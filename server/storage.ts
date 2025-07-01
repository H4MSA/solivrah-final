
import { promises as fs } from "fs";
import path from "path";

const STORAGE_DIR = path.join(process.cwd(), "storage");

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

export class Storage {
  private storageDir: string;

  constructor() {
    this.storageDir = STORAGE_DIR;
    ensureStorageDir();
  }

  async save(filename: string, data: string): Promise<void> {
    const filePath = path.join(this.storageDir, filename);
    await fs.writeFile(filePath, data, "utf-8");
  }

  async load(filename: string): Promise<string | null> {
    try {
      const filePath = path.join(this.storageDir, filename);
      return await fs.readFile(filePath, "utf-8");
    } catch {
      return null;
    }
  }

  async delete(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.storageDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async exists(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.storageDir, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const storage = new Storage();
