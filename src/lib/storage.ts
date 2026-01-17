import { Document, Entity, Settings } from "./types";

const STORAGE_KEYS = {
  DOCUMENTS: "invoiceapp_documents",
  ENTITIES: "invoiceapp_entities",
  SETTINGS: "invoiceapp_settings",
  USER: "invoiceapp_user",
};

export const storage = {
  // Documents
  getDocuments: (): Document[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return data ? JSON.parse(data) : [];
  },

  saveDocuments: (documents: Document[]) => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  },

  addDocument: (document: Document) => {
    const documents = storage.getDocuments();
    documents.push(document);
    storage.saveDocuments(documents);
  },

  updateDocument: (id: string, updates: Partial<Document>) => {
    const documents = storage.getDocuments();
    const index = documents.findIndex((d) => d.id === id);
    if (index !== -1) {
      documents[index] = { ...documents[index], ...updates, updatedAt: new Date().toISOString() };
      storage.saveDocuments(documents);
    }
  },

  deleteDocument: (id: string) => {
    const documents = storage.getDocuments();
    storage.saveDocuments(documents.filter((d) => d.id !== id));
  },

  // Entities
  getEntities: (): Entity[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ENTITIES);
    return data ? JSON.parse(data) : [];
  },

  saveEntities: (entities: Entity[]) => {
    localStorage.setItem(STORAGE_KEYS.ENTITIES, JSON.stringify(entities));
  },

  addEntity: (entity: Entity) => {
    const entities = storage.getEntities();
    entities.push(entity);
    storage.saveEntities(entities);
  },

  updateEntity: (id: string, updates: Partial<Entity>) => {
    const entities = storage.getEntities();
    const index = entities.findIndex((e) => e.id === id);
    if (index !== -1) {
      entities[index] = { ...entities[index], ...updates };
      storage.saveEntities(entities);
    }
  },

  deleteEntity: (id: string) => {
    const entities = storage.getEntities();
    storage.saveEntities(entities.filter((e) => e.id !== id));
  },

  // Settings
  getSettings: (): Settings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          companyName: "My Company",
          companyEmail: "hello@mycompany.com",
          defaultCurrency: "USD",
          defaultTaxRate: 20,
          invoicePrefix: "INV-",
          receiptPrefix: "REC-",
          creditNotePrefix: "CN-",
        };
  },

  saveSettings: (settings: Settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // User
  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: any) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};
