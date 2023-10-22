const express = require("express")
const transactions = express.Router()
const transactionsArray = require("../models/transaction.js")

transactions.get("/", (req,res) => {
    if(req.query.order){
        transactionsArray.sort((a,b) => {
            if(a.item_name.toLowerCase() < b.item_name.toLowerCase())
                return -1
            else if (a.item_name.toLowerCase() > b.item_name.toLowerCase())
                return 1
            else
                return 0
        })
        if(req.query.order==="asc")
            res.json(transactionsArray)
        else if(req.query.order==="desc")
            res.json(transactionsArray.reverse())    
        else
            res.redirect('/9001')
    }
    else if(req.query.inOrOut){
        if(req.query.inOrOut==="true")
            res.json(transactionsArray.filter(current => { 
                return current.inOrOut === true
            }))
        else if(req.query.inOrOut==="false")
            res.json(transactionsArray.filter(current => { 
                return current.inOrOut === false
            }))
        else
            res.redirect('/9001')
    }
    else if(req.query.from){
        if(req.query.from==="gt100")
            res.json(transactionsArray.filter(current => { 
                return current.daysSincefrom > 100 
            }))
        else if(req.query.from==="gte200")
            res.json(transactionsArray.filter(current => { 
                return current.daysSincefrom >= 200 
            }))
        else if(req.query.from==="lte0")
            res.json(transactionsArray.filter(current => { 
                return current.daysSincefrom <= 0 
            }))
        else
            res.redirect('/9001')
    }
    else
        res.json(transactionsArray)
})

transactions.get("/:arrayIndex", (req,res) => {
   if(transactionsArray[req.params.arrayIndex])
        res.json(transactionsArray[req.params.arrayIndex])
    else
        res.redirect('/9001')
})

transactions.post("/", (req,res) => {
    transactionsArray.push(req.body)
    res.status(200).json({status: "OK", payload: transactionsArray[transactionsArray.length-1]})
})

const checkForValidUpdate = (req, res, next) => {
    if (typeof req.body.item_name === "string"&&
        typeof req.body.amount === "number"&&
        typeof req.body.date === "string"&&
        typeof req.body.from === "string"&&
        typeof req.body.category === "string"&&
        typeof req.body.inOrOut === "boolean") 
    {
        return next();
    } else {
      res.send("Object type values must be corrected")
    }
}

transactions.put("/:arrayIndex", checkForValidUpdate, (req,res) => {
    if(transactionsArray[req.params.arrayIndex]){
        transactionsArray[req.params.arrayIndex] = req.body
        res.status(200).json(transactionsArray[req.params.arrayIndex])
    }
    else
        res.status(404).json({error: "Not Found"})
})

transactions.delete("/:arrayIndex", (req,res) => {
    if(transactionsArray[req.params.arrayIndex]){
        const deletedtransaction = transactionsArray.splice(req.params.arrayIndex, 1)
        //res.status(200).json(deletedtransaction[0])
        res.redirect("/transactions")
    }
    else
        res.status(404).json({error: "Not Found"})
})

module.exports = transactions