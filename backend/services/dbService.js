const mongoose = require('mongoose');

async function fetchAllDocuments(collectionName) {
    try {
        const collection = mongoose.connection.db.collection(collectionName);
        const docs = await collection.find({}).toArray();
        return docs;
    } catch (error) {
        throw new Error(`Error fetching from ${collectionName}: ${error.message}`);
    }
}

async function fetchAllCollections() {
    try {
        const collections = mongoose.connection.db.listCollections().toArray();
        return collections.map(c => c.name);
    } catch (error) {
        throw new Error(`Error listing collections: ${error.message}`);
    }
}
module.exports = {
    fetchAllDocuments,
    fetchAllCollections
}