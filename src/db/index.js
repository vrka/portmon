import Dexie, {liveQuery} from 'dexie'
import {useObservable} from '@vueuse/rxjs'
import {ref, watch} from 'vue'
import {schema} from "src/db/schema.js";
import {waitReady} from "library/helpers.js";

export let db;

createDb();

function createDb() {
  db = new Dexie('expenses_db');
  db.version(1).stores(schema);
  Object.assign(db, {query, record, field, deleteDatabase, dumpDb})
}


/**
 * Reactive live query for Dexie collections/tables
 * @param {Dexie.Table|Dexie.Collection|Function} source
 * @returns {Ref<Array>} reactive array
 */
function query(source) {
  let observable
  if (typeof source === 'function') {
    observable = useObservable(liveQuery(source))
  } else if (source && typeof source.toArray === 'function') {
    observable = useObservable(liveQuery(() => source.toArray()))
  } else {
    throw new Error('query() expects Dexie Table, Collection, or function')
  }

  const result = ref([])
  watch(observable, val => {
    result.value = val || []
  }, {immediate: true, flush: 'sync'})

  return result
}

/**
 * Reactive single record
 * @param {Dexie.Table|Function} source
 * @param {any|Promise<any>} id
 * @returns {Ref<Object|null>} reactive record
 */
function record(source, id) {
  const rec = ref(null)

  const createQuery = idValue => {
    let observable
    if (typeof source === 'function') {
      observable = useObservable(liveQuery(source))
    } else if (source && typeof source.get === 'function') {
      observable = useObservable(liveQuery(() => source.get(idValue)))
    } else {
      throw new Error('record() expects Dexie Table + id or function')
    }

    watch(observable, val => {
      rec.value = val
    }, {immediate: true, flush: 'sync'})
  }

  if (id instanceof Promise) {
    id.then(createQuery)
  } else {
    createQuery(id)
  }

  return rec
}

/**
 * Return a Promise that resolves to a field value once record is ready
 * @param {Ref<Object|null>} record - reactive record returned by db.record()
 * @param {string} field - the field name
 * @returns {Promise<any>}
 */
function field(record, field) {
  return waitReady(record).then(r => r[field])
}

async function dumpDb() {
  const tables = {}

  for (const table of db.tables) {
    tables[table.name] = await table.toArray()
  }

  return tables
}

async function deleteDatabase() {
  await db.delete();
  createDb();
}
