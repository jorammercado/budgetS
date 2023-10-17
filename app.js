const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("Welcome To Budget App")
})

const transactionsController = require("./controllers/transactions.controller.js")
app.use("/transactions", transactionsController)

app.get("*", (req,res) => {
    res.status(404).json({error: "Sorry, no page found!"})
})

module.exports = app