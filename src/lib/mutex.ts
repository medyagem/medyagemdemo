export class Mutex {
  private queue: Array<() => void> = [];
  private locked = false;

  async lock(): Promise<() => void> {
    return new Promise((resolve) => {
      const exec = () => {
        this.locked = true;
        resolve(() => this.unlock());
      };

      if (!this.locked) {
        exec();
      } else {
        this.queue.push(exec);
      }
    });
  }

  private unlock() {
    this.locked = false;
    const next = this.queue.shift();
    if (next) {
      next();
    }
  }
}

// Dosya tabanlı JSON I/O işlemleri için global lock (race-condition önleyici)
export const dbMutex = new Mutex();
