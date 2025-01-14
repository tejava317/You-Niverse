export const initializeDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyAppDatabase", 1);
  
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects", { keyPath: "id", autoIncrement: true });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  export const saveProject = async (project: {
    userId: string;
    projectName: string;
    projectId: string;
    createdAt: string;
  }): Promise<void> => {
    const db = await initializeDatabase();
    const transaction = db.transaction("projects", "readwrite");
    const store = transaction.objectStore("projects");
  
    store.add(project);
  };
  
  export const getProjectsByUserId = async (userId: string): Promise<any[]> => {
    const db = await initializeDatabase();
    const transaction = db.transaction("projects", "readonly");
    const store = transaction.objectStore("projects");
  
    return new Promise((resolve) => {
      const request = store.openCursor();
      const projects: any[] = [];
  
      request.onsuccess = (event) => {
        const cursor = request.result;
        if (cursor) {
          if (cursor.value.userId === userId) {
            projects.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(projects);
        }
      };
  
      request.onerror = () => resolve([]);
    });
  };
  