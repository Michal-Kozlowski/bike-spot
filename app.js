var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user");
    
var indexRoutes     = require("./routes/index"),
    placeRoutes     = require("./routes/places"),
    commentRoutes   = require("./routes/comments");

var url = process.env.DATABASEURL || "mongodb://localhost/bikespot";
mongoose.connect(url, {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Secret secrets are no fun, secret secrets hurt someone",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/places", placeRoutes);
app.use("/places/:id/comments", commentRoutes);

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});