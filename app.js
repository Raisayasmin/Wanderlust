// if(process.env.NODE_ENV != "production"){
//     require("dotenv").config();
// }


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require('method-override');
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");
// const userRoute = require("./routes/user.js");


// // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
// const dbUrl = process.env.ATLASDB_URL;


// main().then(() => {
//     console.log("connected to DB");
// })
// .catch((err) => {
//     console.log(err);
// })

// async function main() {
//     await mongoose.connect(dbUrl);
// }

// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"/views"));
// app.use(express.urlencoded({extended : true}));
// app.use(methodOverride('_method'));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));

// const store = MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto: {
//         secret: "mysupersecretcode"
//     },
//     touchAfter: 24 * 3600,
// });

// store.on("error",(err) => {
//     console.log("Error in Mongo SESSION store",err);
// })

// const sessionOption = {
//     store,
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now()+ 7*24*60*60*1000,
//         maxAge: 7*24*60*60*1000,
//         httpOnly: true, //the browser blocks JavaScript from reading cookies.
// },
// }

// app.use(session(sessionOption));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// app.use((req,res,next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// })

// app.use("/listings",listingRouter);
// app.use("/listings/:id/reviews",reviewRouter);
// app.use("/",userRoute)

// app.use((req,res,next) => {
//     next(new ExpressError(404, "Page Not Found"));
// })

// app.use((err,req,res,next) => {
//     let {statusCode = 500,message = "Something went Wrong"} = err;
//     res.status(statusCode).render("error.ejs",{message});
// })

// app.listen(8080,() => {
//     console.log("App is listening");
// })

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoute = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
const sessionSecret = process.env.SESSION_SECRET;


async function main() {
try {
        await mongoose.connect(dbUrl);
        console.log("✅ Connected to DB");
    }
     catch (err) {
        console.error("❌ Database connection error:", err.message);
        // Don't crash the app immediately, but show clear message
    }
}

main().catch(err => console.error("❌ DB Connection Failed:", err.message));



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Session Store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: sessionSecret
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo SESSION store", err);
});

const sessionOption = {
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});
// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRoute);

// Error Handling
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("🚀 App is listening on port 8080");
});