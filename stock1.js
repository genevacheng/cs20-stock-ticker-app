var mongo = require("mongodb");
var readline = require("readline");
var fs = require("fs");

// connect to database
var MongoClient = mongo.MongoClient;
var connectionString = "mongodb+srv://genevacheng:Hyperspace12@cluster0.swouo2s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
MongoClient.connect(connectionString, function (err, account) {
    if (err) {
        console.log("connection error: " + err);
        return;
    }

    // select collection from database
    var db = account.db("Stock");
    var collection = db.collection("PublicCompanies");

    // open file stream
    var file = readline.createInterface({
        input: fs.createReadStream("companies-1.csv")
    });

    // read file by line
    var fieldsExtracted = false;
    var field1, field2, field3;
    file.on("line", function (line) {
        var data = line.split(",")
        if (!fieldsExtracted) {
            // extract fields
            field1 = data[0].toLowerCase();
            field2 = data[1].toLowerCase();
            field3 = data[2].toLowerCase();
            fieldsExtracted = true;
        } else {
            // extract values
            var value1 = data[0];
            var value2 = data[1];
            var value3 = parseFloat(data[2]);

            // create document
            var document = {
                [field1]: value1,
                [field2]: value2,
                [field3]: value3
            }

            // insert document
            collection.insertOne(document, function (err, res) {
                if (err) {
                    throw err;
                }
                console.log(document);
            });
        }
    });
});
