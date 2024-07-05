#! /usr/bin/env node
require('dotenv').config();

console.log(
    'This script populates the database.'
);

// Get arguments passed on command line
const mongoDB = process.env.MONGODB_URI;

const User = require("./models/user");
const Post = require('./models/post');

const users = [];
const posts = [];

const bcrypt = require('bcryptjs');

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createUsers();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function userCreate(index, firstName, lastName, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    users[index] = user;
    console.log(`Added user: ${user.fullname}`);
}

async function createUsers() {
    console.log("Adding Users");
    await Promise.all([
        userCreate(0, 'Alex', 'Delia', 'alex-delia@outlook.com', 'password'),
        userCreate(1, 'John', 'Smith', 'johnsmith@gmail.com', 'helloWorld'),
        userCreate(2, 'Jane', 'Doe', 'janedoberman@hotmail.com', 'dober'),
    ]);
}

async function postCreate(index, author, title, text) {
    const post = new Post({ author, title, text });
    await post.save();
    posts[index] = post;
    console.log(`Added post: ${title}`);
}

async function createPosts() {
    console.log("Adding Posts");
    await Promise.all([
        postCreate(0, users[0], 'NEW AlphaTheta Gear', 'This new DJ controller is amazing'),
    ]);
}
