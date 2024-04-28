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

const initDB = async () => {
    await Blog.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        author: "662d5a374cedd19673d35617",
    }))
    await Blog.insertMany(initData.data);
    console.log("Data was initialized to the database");
}

initDB();
