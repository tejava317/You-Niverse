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
  user_id: string;
  projectName: string;
  project_id: string;
  createdAt: string;
  project_start: string;
  project_end: string;
}): Promise<void> => {
  const db = await initializeDatabase();
  const transaction = db.transaction("projects", "readwrite");
  const store = transaction.objectStore("projects");

  store.add(project);
};

export const getProjectsByUserId = async (user_id: string): Promise<any[]> => {
  const db = await initializeDatabase();
  const transaction = db.transaction("projects", "readonly");
  const store = transaction.objectStore("projects");

  return new Promise((resolve) => {
    const request = store.openCursor();
    const projects: any[] = [];

    request.onsuccess = (event) => {
      const cursor = request.result;
      if (cursor) {
        if (cursor.value.user_id === user_id) {
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

export const getProjectById = async (project_id: string): Promise<any | null> => {
  const db = await initializeDatabase();
  const transaction = db.transaction("projects", "readonly");
  const store = transaction.objectStore("projects");

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      const projects = request.result || [];
      const project = projects.find((p) => p.project_id === project_id);
      resolve(project || null);
    };

    request.onerror = () => {
      console.error("Error fetching project by ID:", request.error);
      reject(request.error);
    };
  });
};

export const calculateDday = (endDate: string): number => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 하루 단위로 계산
};

// export const clearDatabase = (dbName: string): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.deleteDatabase(dbName);

//     request.onsuccess = () => {
//       console.log(`Database '${dbName}' has been deleted.`);
//       resolve();
//     };

//     request.onerror = () => {
//       console.error(`Failed to delete database '${dbName}':`, request.error);
//       reject(request.error);
//     };

//     request.onblocked = () => {
//       console.warn(`Database '${dbName}' deletion is blocked.`);
//     };
//   });
// };

// await clearDatabase("MyAppDatabase"); // 전체 IndexedDB 초기화
