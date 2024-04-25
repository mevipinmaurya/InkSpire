const mongoose = require("mongoose");
const initData = require("./data.js");
const Blog = require("../models/blogs.js");


const MONGO_URL = 'mongodb://127.0.0.1:27017/inkspire';

main().then(() => {
    console.log("Connection Successfull");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Blog.deleteMany({});
    await Blog.insertMany(initData.data);
    console.log("Data was initialized to the database");
}

initDB();
