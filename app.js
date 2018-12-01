const express = require("express");
const bodyParser = require("body-parser");
const engines = require("consolidate");
const stripe = require("stripe")("sk_test_oB6Q69xT1I69IddMLrDDLXGR");

const app = express();

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/pay", (req, res) => {
    const amount = 999;
    stripe.customers
        .create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer =>
            stripe.charges.create({
                amount,
                description: "Web Development Ebook",
                currency: "usd",
                customer: customer.id
            })
        )
        .then(charge => res.render("success"))
        .catch(err => res.render("cancel"));
});

app.listen(3000, () => {
    console.log("Server is running");
});
