var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Place       = require("../models/place"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Place.findById(req.params.id, function(err, place){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {place: place});
        }
    });
});

//create comment
router.post("/", middleware.isLoggedIn, function(req, res){
    Place.findById(req.params.id, function(err, place) {
        if(err){
            console.log(err);
            res.redirect("/places");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    place.comments.push(comment);
                    place.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/places/" + place._id);
                }
            });
        }
    });
});

//edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Place.findById(req.params.id, function(err, foundPlace){
        if(err || !foundPlace){
            req.flash("error", "Cannot find that place");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {place_id: req.params.id, comment: foundComment});
            }
        });
    });    
});

//update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/places/" + req.params.id);
        }
    });
});

//destroy comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/places/" + req.params.id);
        }
    });
});

module.exports = router;