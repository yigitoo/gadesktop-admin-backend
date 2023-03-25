import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import * as mongodb from 'mongodb'
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


dotenv.config();
const PORT = process.env.EXPRESS_PORT || 3000;
const db_url = process.env.DB_URI || "mongodb://localhost:27017/";

const db_name = "galbul";
const user_collection_name = "users";
const ban_collection_name = "banned_emails";
const complaints_collection = "complaints"
const admin_collection = process.env.ADMIN_DB_COLLECTION ?? "admin_token"

const user_client = new Database(db_url, db_name, user_collection_name)
const ban_client = new Database(db_url, db_name, ban_collection_name)
const complaints_client = new Database(db_url, db_name, complaints_collection)
const admin_client = new Database(db_url, db_name, admin_collection)

// const database = new Database(db_url, db_name, user_collection);
// await database.client.connect();


const app = express();
app.use(cors())
app.use(bodyParser.json());
function cannot_get(req, res){
  res.status(200).json({
    status:200,
    message: "THIS PAGE ACCEPT ONLY 'POST' COMMAND."
  })
}
app.get('/', cannot_get)
app.get('/complaints', cannot_get)
app.get('/login', cannot_get)
app.get('/complaint_case', cannot_get)


app.post('/complaints', async function(req ,res) {
  const { email, secretKey } = req.body;
  const user = await user_client.run({email: email}, "find_one")
  let admin = await admin_client.run({}, "find_one");
  let complaints = [];

  if(user.type === "normal" && secretKey === admin.secretKey)
  {
    user_client.deleteOne({
      "email": user.email
    }, "delete")

    ban_client.run({
      "email": user.email
    }, "insert")

    return res.status(403).json({
      message: "BANNING_THIS_USER_PERMENANTLY_FOR_HACKING_CRIME",
      response: 403,
      user: null
    })
  } else if (user.type === "admin" && secretKey === admin.secretKey) {
      complaints = await complaints_client.run({}, 'find');
      console.log(complaints);
      return res.status(200).json({
        message: "REQUEST_SUCCESSFUL",
        response: 200,
        data: complaints
      })
  } else {
    res.status(500).json({
      message: "LOGIN_FAILURE",
      response: 500,
    })
  }
});

app.post('/complaint_case', async (req, res) => {
  const comp_img_path = process.env.COMPLAINTS_IMG_PATH;
  const { comp_id } = req.body;

  const complaint_case = await complaints_client.run({_id: comp_id}, 'find_one') ?? false;
  let comp_user;
  let complainant;
  
  if (complaint_case)
  {
    comp_user = await user_client.run({_id: complaint_case.comp_user}, 'find_one')
    complainant = await user_client.run({_id: complaint_case.complainant}, 'find_one')
  }

  return res.status(200).json({
    status: 200,
    data: {
      comp_username: comp_user.username,
      complainant_username: complainant.username,
      complaint_user_id: comp_user._id,
      complainant_user_id: complainant._id, 
      title: complaint_case.title,
      content: complainant_case.content, 
    }
  })
})

app.post('/login', async function (req, res) {
  const { email, secretKey } = req.body;
  const user = await user_client.run({email: email}, "find_one");

  let admin = await admin_client.run({}, 'find_one');

  if(user.type === "normal" && secretKey === admin.secretKey)
  {
    user_client.deleteOne({
      "email": user.email
    }, "delete")

    ban_client.run({
      "email": user.email
    }, "insert")

    return res.status(403).json({
      message: "BANNING_THIS_USER_PERMENANTLY_FOR_HACKING_CRIME",
      response: 403,
      user: null
    })
  } else if (user.type === "admin" && secretKey === admin.secretKey) {
      return res.status(200).json({
        message: "AUTHORIZED",
        response: 200,
        user_data: user
      });
  } else {
    res.status(500).json({
      message: "LOGIN_FAILURE",
      response: 500,
    })
  }
});

app.listen(PORT, () => console.log(`[SERVER] AT http://localhost:${PORT}/`))
