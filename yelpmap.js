fs = require('fs')
async = require('async')
yelp = require("yelp").createClient({
    consumer_key: "xx",
    consumer_secret: "xx",
    token: "xx",
    token_secret: "xx"
});

fs.readFile('top100.txt', 'utf8', function (err, data) {
    if (err) throw(err);

    out = [];
    async.forEach(data.split("\n"),
        function (data, next) {
            search_yelp(data, function (resp) {
                out.push(resp);
                next();
            });
        }, function (err) {
            fs.writeFile('yelp-api-output.json', JSON.stringify(out),function (err) {
                  if (err) throw err;
                   
                    console.log('File Saved!');
                    });
            });
});


function search_yelp (data, callback) {

    search_terms = [];
    RegEx = /\d+\.\s(.*)\s–\s(.*)/
    search_terms = RegEx.exec(data);

    yelp.search({
        term: search_terms[1],
        location: search_terms[2]
    }, function (error, data) {
        if (error)  throw error;
        //let's just get what we need.
        var a = {};
        a.name = data.businesses[0].name;
        a.coordinates = data.businesses[0].location.coordinate;
        a.url = data.businesses[0].url;
        a.address = data.businesses[0].location.display_address;
        a.rating_img_url = data.businesses[0].rating_img_url
        callback(a);
    });

}
