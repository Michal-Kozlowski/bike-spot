var express     = require("express"),
    router      = express.Router(),
    Place       = require("../models/place"),
    middleware  = require("../middleware"),
    geocoder = require("geocoder");

//index route
router.get("/", function(req, res){
    Place.find({}, function(err, allPlaces){
        if(err){
            console.log(err);
        } else {
            res.render("places/index", {places: allPlaces});
        }
    });
});

//create route
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newPlace = {name: name, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
        Place.create(newPlace, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                res.redirect("/places");
            }
        });
    });
});

//new route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("places/new");
});

//show route
router.get("/:id", function(req, res){
    Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace){
        if(err || !foundPlace){
            req.flash("error", "Place not found");
            console.log(err);
        } else {
            console.log(foundPlace);
            res.render("places/show", {place: foundPlace});
        }
    });
});

//image route
router.get("/:id/image", function(req, res){
    Place.findById(req.params.id, req.body.place, function(err, foundPlace){
        if(err){
            res.redirect("back");
        } else {
        res.render("places/image", {place: foundPlace});
        }
    });
});

//edit route
router.get("/:id/edit", middleware.checkPlaceOwnership, function(req, res) {
    Place.findById(req.params.id, req.body.place, function(err, foundPlace){
        if(err){
            res.redirect("back");
        } else {
            res.render("places/edit", {place: foundPlace});
        }
    });
});

//update route
router.put("/:id", middleware.checkPlaceOwnership, function(req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if(err){
            res.redirect("back");
        } else {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newData = {name: req.body.place.name, image: req.body.place.image, description: req.body.place.description, location: location, lat: lat, lng: lng};
            Place.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedPlace){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("/places");
                } else {
                    req.flash("success", "Successfully Updated!");
                    res.redirect("/places/" + req.params.id);
                }
            });
        }
    });
});

//destroy
router.delete("/:id", middleware.checkPlaceOwnership, function(req, res) {
    Place.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/places");
        } else {
            res.redirect("/places");
        }
    });
});

module.exports = router;