
const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');


const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;


const client = algoliasearch(APP_ID, ADMIN_KEY);

const index = client.initIndex('productos');

// // Create and Deploy Your First Cloud Functions
exports.synAlgolia = functions.firestore.document('productos/{productoID}').onCreate(snapshot => {

    const data = snapshot.data();
    const objectID = snapshot.id;
    return index.saveObject({
        ...data,
        objectID
    });

});


exports.updateAlgolia = functions.firestore.document('productos/{productoID}').onUpdate(change => {

    const newData = change.after.data();
    const objectID = change.after.id;
    return index.saveObject({
        ...newData,
        objectID,
    });
});


exports.deleteAlgolia = functions.firestore.document('productos/{productoID}').onDelete(snapshot => {
    const objectID = snapshot.id;
    return index.deleteObject(objectID);
});

