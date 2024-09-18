const { defaults } = require("js-cookie");

function useGetAllIndexedDB() {
 return (db, store) =>
    new Promise((res, rej) => {
      const keysTr = db.transaction(store).objectStore(store).getAllKeys();
      keysTr.onsuccess = (event) => {
        const keys = event.target.result;
        if (keys?.length) {
          const valuesTr = db.transaction(store);
          const objStore = valuesTr.objectStore(store);
          const result = []; 
          keys.forEach((key) => {
            const tr = objStore.get(key);
            tr.onsuccess = (e) => {
              result.push({
                key,
                value: e.target.result,
              });
            };
          });
          valuesTr.oncomplete = () => {
            res(result);
          };
          valuesTr.onerror = (event) => {
            rej(event);
          };
        } else res([]);
      };
      keysTr.onerror = (event) => {
        rej(event);
      };
    });
}

export default useGetAllIndexedDB
