const express = require('express')
const app = express()
const mongoose = require('mongoose');
const {request} = require("express");

/**
 * Import MongoClient & connexion à la DB
 */

const username = "bmlaghui";
const password = "bmlaghui";
const cluster = "cluster0.9nhto";
const dbname = "QCMQUIZ";

mongoose.connect(
    "mongodb+srv://"+username+":"+password+"@"+cluster+".mongodb.net/"+dbname,
    {
    }
);
app.use(express.json())

const mydb = mongoose.connection;
mydb.on("error", console.error.bind(console, "connection error: "));
mydb.once("open", function () {
    console.log("Connected successfully");
});

app.get('/', (req,res) => {

})



app.get('/questionsQCM/:matiere/:nbQuestions', (req,res, next) => {

// @type {AggregationCursor}

    mydb.collection(req.params.matiere).aggregate([{"$project": {"_id": 0, "question": 1, "correctOption": 1, "optionA": 1, "optionB": 1,
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

app.get('/questionsExam/:matiere/:nbQuestions', (req,res, next) => {
    mydb.collection(req.params.matiere).aggregate([{"$project": {"_id": 1, "question": 1, "correctOption": 1, "optionA": 1, "optionB": 1,
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
            var id = item._id;
            var questionText = item.question;
            var optiona = {"text": item.optionA}
            var optionb = {"text": item.optionB}
            var optionc = {"text": item.optionC}
            var optiond = {"text": item.optionD}
            var options = [optiona, optionb, optionc, optiond]



            dict["questionText"] = questionText
            dict["options"] = options
            dict["id"] = id
            dictALL[i] = dict

        }

        console.log(dictALL)
        let dictRes = {"questions":dictALL}



        res.setHeader("Content-Type", "application/json; charset=utf-8");
        //console.log(JSON.stringify(dictRes))
        res.end(JSON.stringify(dictRes))
    })
})

//formatted_data
app.get('/questionsQUIZ/:matiere/:nbQuestions', (req,res, next) => {
    mydb.collection(req.params.matiere).aggregate([{"$project": {"_id": 0, "question": 1, "correctOption": 1, "optionA": 1, "optionB": 1,
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


//formatted_data
app.get('/correction/:matiere/:idQuestion', (req,res, next) => {

    var id = new require('mongodb').ObjectID(req.params.idQuestion);//req.params.id
    const options = {
        // sort matched documents in descending order by rating
        // Include only the `title` and `imdb` fields in the returned document
        projection: { _id: 0, question: 0, correctOption: 1, optionA: 0, optionB: 0,
            optionC: 0, optionD: 0, numero: 0 }
    };
    mydb.collection(req.params.matiere).findOne({'_id':id}, { projection: { _id: 0, question: 0, optionA: 0,  optionB: 0, optionC: 0, optionD: 0, numero: 0   } })
        .then(function(doc) {
            if(!doc)
                throw new Error('No record found.');
            console.log(doc);//else case
        });

})


app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
    console.log("Server is running.");
});


