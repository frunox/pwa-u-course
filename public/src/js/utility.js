// open IDB, create data store
let dbPromise = idb.open('posts-store', 1, function (db) {
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('sync-posts')) {
    db.createObjectStore('sync-posts', { keyPath: 'id' });
  }
});

// store data in IDB.  'st' is the name of our data store
const writeData = (st, data) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readwrite');
    let store = tx.objectStore(st);
    store.put(data);
    return tx.complete;
  });
};

// read data from IDB
const readAllData = (st) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readonly');
    let store = tx.objectStore(st);
    return store.getAll();
  });
};

// clear IBD of all data
const clearAllData = (st) => {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, 'readwrite');
    let store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  });
};

// delete 1 item from IDB
const deleteItemFromData = (st, id) => {
  dbPromise
    .then((db) => {
      let tx = db.transaction(st, 'readwrite');
      let store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(() => {
      console.log('Item deleted');
    });
};
