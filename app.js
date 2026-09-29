const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// API Key milikmu dari screenshot
const apiKey = "7kkBpCsRiyHvOVl9nxaS"; 

app.use(express.static(path.join(__dirname, "public")));
