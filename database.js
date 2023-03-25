import * as mongodb from 'mongodb'
//const {MongoClient} = require('mongodb');
const { MongoClient } = mongodb;

class Database {
  constructor(connection_url, db_name, collection_name){
    this.connection_url = connection_url;
    this.db_name = db_name;
    this.collection_name = collection_name;
  }

  async run(document, operation)
  {
    this.client = new MongoClient(this.connection_url)
    await this.client.connect();

    this.collection = this.client.db(this.db_name).collection(this.collection_name)

    let result;
    if (operation.toLowerCase() === "delete") {
      result = await this.collection.deleteOne(document);
    } else if (operation.toLowerCase() === "find") {
      result = await this.collection.find(document).toArray();
    } else if (operation.toLowerCase() === "find_one"){
      result = await this.collection.findOne(document)
    } else if (operation.toLowerCase() === "insert"){
      result = await this.collection.insertOne(document)
    }

    return result;
  }

}

export { Database }
