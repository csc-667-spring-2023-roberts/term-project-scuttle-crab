const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../db/users");
const router = express.Router();

const SALT_ROUNDS = 10;

router.get("/register", (request, response) => {
    response.render("register", { title: "Gin Rummy" });

});

router.get("/login", (request, response) => {
    response.render("login", { title: "Gin Rummy" });

});

router.post("/register", async (request, response) => {
    const {username, email, password } = request.body;

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    try {
        const {id} = await Users.create(username, email, hash);

        response.redirect("/login")
    } catch(error) {
        console.log(error)
        response.render("register", { title: "Gin Rummy", username, email})
    }
   // response.render("signup", { title: "Gin Rummy" });

});

router.post("/login", async (request, response) => {
    const { email, password} = request.body;
    console.log("In the post request with ", email, password)

    try {
        const {password: hash} = await Users.findByEmail(email);

        const isValidUser = await bcrypt.compare(password, hash);
        if(isValidUser) {
            console.log("\n\nValid\n\n")
            response.redirect("/lobby");
        } else {
            console.log("\n\n***Not valid user\n\n")
            throw "User did not provide valid credentials";
        }
    } catch(error) {
        console.log(error)
        response.render("login", { title: "Gin Rummy", email, message: "error" });
    }
});

module.exports = router;