const express = require("express");
const app =express();
const Listing = require("./models/listing");
const mongoose = require('mongoose');
const path= require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js")

main()
    .then((res)=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log("Caught Some err");
    })

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WonderLust');
}

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const validate=(req,res,next)=>{
    let {error} = listingSchema.validate( req.body);
    if(error){
        throw new ExpressError(404, error);
    }
    else{
        next();
    }
};

app.get("/" , (req,res)=>{
    res.send("I am root ");
});

// Index Route
app.get("/listing" , wrapAsync(async(req,res)=>{
   const Alllisting = await Listing.find();
   res.render("./listing/index.ejs" , {Alllisting});
}));
// New Route
app.get("/listing/new" , (req,res)=>{
    res.render("./listing/new.ejs");
});

// Show Route
app.get("/listing/:id" , wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const list = await Listing.findById(id);
    res.render("./listing/show.ejs" , {list});
}));

// Create Route
app.post("/listing" ,validate,wrapAsync( async (req,res)=>{
    const newlisting = new Listing(req.body.listing);
    newlisting.save();
    res.redirect("/listing");
}));

// Edit Route
app.get("/listing/:id/edit" , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("./listing/edit.ejs" , {list});
}));

// update Route
app.put("/listing/:id" ,validate , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listing");
}));

// DELETE Route
app.delete("/listing/:id" , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
     res.redirect("/listing");
}));

app.get("/listing/new" , (req,res)=>{
    res.render("./listing/new.ejs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, `Can't find ${req.originalUrl} on this server!`));
});

// or Handling
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { err });
});

app.listen(3000 , ()=>{
    console.log("server is listening at port 3000");
});