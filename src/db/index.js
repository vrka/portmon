import Dexie from 'dexie';
import { schema } from './schema';

export const db = new Dexie('expenses_db');

db.version(1).stores(schema);
