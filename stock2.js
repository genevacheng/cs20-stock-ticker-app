var http = require("http");
var fs = require("fs");
var url = require("url");
var mongo = require("mongodb");

var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
    var page = url.parse(req.url).pathname;

    if (page == "/") {
        res.writeHead(200, {"Content-Type": "text/html"});
        var file = "home.html";
        fs.readFile(file, function (err, txt) {
            res.write(txt);
            res.end();
        });
    } else if (page == "/process") {
        res.writeHead(200, {"Content-Type": "text/html"});
        var qobj = url.parse(req.url, true).query;

        var MongoClient = mongo.MongoClient;
        var connectionString = "mongodb+srv://genevacheng:Hyperspace12@cluster0.swouo2s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        MongoClient.connect(connectionString, function (err, account) {
            if (err) {
                console.log("connection error: " + err);
                return;
            }

            var db = account.db("Stock");
            var collection = db.collection("PublicCompanies");

            var query = {[qobj.type]: qobj.query};
            res.write("<script>");
            collection.find(query).toArray().forEach((result) => {
                res.write("console.log(" + result.company + ", " + result.ticker + ", " + result.price);
            });
            res.write("</script>");
            res.end();
        });
    }
}).listen(port);
