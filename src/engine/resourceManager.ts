export class ResourceManager {
  private static instance: ResourceManager;
  private resources: Map<string, HTMLImageElement | HTMLAudioElement>;

  private constructor() {
    this.resources = new Map();
  }

  public static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }

    return ResourceManager.instance;
  }

  public async loadImage(imageUrls: (string | {url: string, name: string})[]): Promise<void> {
    const promises = imageUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const image = new Image();
        const item = typeof url === 'string' ? {url, name: url} : url;
        image.src = item.url;
        image.onload = () => {
          this.resources.set(item.name, image);
          resolve();
        };
        image.onerror = (err) => {
          reject(err);
        };
      });
    });

    await Promise.all(promises);
  }

  public async loadAudio(audioUrls: {url: string, name: string}[]): Promise<void> {
    const promises = audioUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const audio = new Audio();
        audio.src = url.url;
        audio.oncanplaythrough = () => {
          this.resources.set(url.name, audio);
          resolve();
        };
        audio.onerror = (err) => {
          reject(err);
        };
      });
    });

    await Promise.all(promises);
  }

  public get<T = HTMLImageElement | HTMLAudioElement>(url: string): T {
    if (!this.resources.has(url)) {
      throw new Error(`Resource ${url} not found`);
    }
    return this.resources.get(url)! as T;
  }
}