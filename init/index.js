const mongoose = require('mongoose');
const initdata =require("./data.js");
const Listing = require("../models/listing"); 

main()
    .then((res)=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log("Caught Some err", err);
    })

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WonderLust');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data Was Initialized");
};

initDB();