const express = require('express')
const app = express()

/**
 * Import MongoClient & connexion à la DB
 */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'QCMQUIZ';
let db

MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to server");
    db = client.db(dbName);
});


app.use(express.json())

app.get('/', (req,res) => {
    db.collection('D51.1').aggregate([{"$project": {"_id": 0, "question": 1, "correctOption": 1, "optionA": 1, "optionB": 1,
            "optionC": 1, "optionD": 1, "numero": 1}},
        {"$sample": {"size": 5}}]).toArray(function(err, docs) {
        if (err) {
            console.log(err)
            throw err
        }

        res.status(200).json(docs)
    })
})


app.get('/questionsQCM/:matiere/:nbQuestions', (req,res, next) => {
    db.collection(req.params.matiere).aggregate([{"$project": {"_id": 0, "question": 1, "correctOption": 1, "optionA": 1, "optionB": 1,
            "optionC": 1, "optionD": 1, "numero": 1}},
        {"$sample": {"size": parseInt(req.params.nbQuestions)}}]).toArray(function(err, docs) {
        if (err) {
            console.log(err)
            res.status(500);
            return next(err);
        }


        res.setHeader("Content-Type", "application/json; charset=utf-8");

        res.end(JSON.stringify(docs))
    })
})



//formatted_data
app.get('/questionsQUIZ/:matiere/:nbQuestions', (req,res, next) => {
    db.collection(req.params.matiere).aggregate([{"$project": {"_id": 0, "question": 1, "correctOption": 1, "optionA": 1, "optionB": 1,
            "optionC": 1, "optionD": 1, "numero": 1}},
        {"$sample": {"size": parseInt(req.params.nbQuestions)}}]).toArray(function(err, docs) {
        if (err) {
            console.log(err)
            res.status(500);
            return next(err);
        }

        var dictALL = [];
        var i =-1
        for(item of docs) {
            var dict = {};
            i++
            var questionText = item.question;
            var optiona = {"text": item.optionA}
            var optionb = {"text": item.optionB}
            var optionc = {"text": item.optionC}
            var optiond = {"text": item.optionD}
            if (item.correctOption == 1) {
                var optiona = {"text": item.optionA, "correct": true}
            }
            else if (item.correctOption == 2) {
                var optionb = {"text": item.optionB, "correct": true}
            }
            else if (item.correctOption == 3) {
                var optionc = {"text": item.optionC, "correct": true}
            }
            else if (item.correctOption == 4) {
                var optiond = {"text": item.optionD, "correct": true}
            }


            var options = [optiona, optionb, optionc, optiond]



            dict["questionText"] = questionText
            dict["options"] = options
            dictALL[i] = dict

        }

        console.log(dictALL)
        let dictRes = {"questions":dictALL}



        res.setHeader("Content-Type", "application/json; charset=utf-8");
        //console.log(JSON.stringify(dictRes))
        res.end(JSON.stringify(dictRes))
    })
})


app.listen(8080, () => {
    console.log("Serveur à l'écoute")
})
