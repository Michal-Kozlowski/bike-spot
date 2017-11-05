var mongoose    = require("mongoose"),
    Place       = require("./models/place"),
    Comment     = require("./models/comment");

var data = [
        {
            name: "Las Strachociński",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Wie%C5%BCa_widokowa_Kotowice_Utrata_1.jpg",
            description: "blah blah blah blah"
        },
        {
            name: "Jaz Opatowicki",
            image: "https://upload.wikimedia.org/wikipedia/commons/3/38/JazOpatowicki%26kladka_na_wyspe_Opatowicka.jpg",
            description: "blah blah blah blah"
        },
        {
            name: "Las Rędziński",
            image: "https://upload.wikimedia.org/wikipedia/commons/0/07/Wroc%C5%82aw%2C_Las_Osobowicki_-_fotopolska.eu_%28299550%29.jpg",
            description: "blah blah blah blah"
        }
    ];
    
function seedDB(){
    //Remove all places
    Place.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed places!");
        //add a few places
        data.forEach(function(seed){
            Place.create(seed, function(err, place){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a place");
                    //create a comment
                    Comment.create({
                        text: "This place is great, but I wish there was internet",
                        author: "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else {
                            place.comments.push(comment);
                            place.save();
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;