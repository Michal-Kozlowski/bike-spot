var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Place       = require("./models/place"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/bikespot", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/places", function(req, res){
    Place.find({}, function(err, allPlaces){
        if(err){
            console.log(err);
        } else {
            res.render("places/index", {places: allPlaces});
        }
    });
});

app.post("/places", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newPlace = {name: name, image: image, description: desc};
    Place.create(newPlace, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/places");
        }
    });
});

app.get("/places/new", function(req, res){
    res.render("places/new");
});

app.get("/places/:id", function(req, res){
    Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace){
        if(err){
            console.log(err);
        } else {
            console.log(foundPlace);
            res.render("places/show", {place: foundPlace});
        }
    });
});

//COMMENTS ROUTES
app.get("/places/:id/comments/new", function(req, res){
    Place.findById(req.params.id, function(err, place){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {place: place});
        }
    });
});

app.post("/places/:id/comments", function(req, res){
    Place.findById(req.params.id, function(err, place) {
        if(err){
            console.log(err);
            res.redirect("/places");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    place.comments.push(comment);
                    place.save();
                    res.redirect("/places/" + place._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});