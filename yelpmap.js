fs = require('fs')
async = require('async')
yelp = require("yelp").createClient({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    token: process.env.token,
    token_secret: process.env.token_secret
});

var year = process.argv[2] || 2017;
var  RegEx=[], out = [];
RegEx['2015'] = /\d+\.\s(.*)\s–\s(.*)/;
RegEx['2016'] = /\d+\.\s(.*)\,\s(.*\,\s.*)/;
RegEx['2017'] = /(.*)\s\–\s(.*)/;

fs.readFile('top100-'+year+'.txt', 'utf8', function (err, data) {
    if (err) {console.log(err) ; throw(err);}


    async.forEach(data.split("\n"),
        function (data, next) {
            var search_terms = [];
            search_terms = RegEx[year].exec(data);
            if (!search_terms) {console.log("search_terms: ",search_terms) ; throw(err);}
            search_yelp(search_terms, function (resp) {
                out.push(resp);
                next();
            });
        }, function (err) {
            fs.writeFile('yelp-api-output-'+year+'.json', JSON.stringify(out),function (err) {
                  if (err) throw err;

                    console.log('File Saved!');
                    });
            });
});


function search_yelp (search_terms, callback) {
    yelp.search({
        term: search_terms[1],
        location: search_terms[2]
    }, function (err, data) {
         if (err) {console.log(err) ; throw(err);}
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