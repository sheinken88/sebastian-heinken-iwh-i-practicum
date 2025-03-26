const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJ_TYPE = process.env.CUSTOM_OBJ_TYPE;

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route 1: Homepage - list all custom object records
app.get("/", async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJ_TYPE}?properties=name,publisher,price`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data.results;
    res.render("homepage", {
      title: "Video Game Table | Integrating With HubSpot I Practicum",
      data,
    });
  } catch (error) {
    console.error(
      "Error fetching custom objects:",
      error.response?.data || error.message
    );
    res.status(500).send("Error fetching custom object data");
  }
});

// Route 2: Show form to create a new custom object
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// Route 3: Handle form submission and create new custom object
app.post("/update-cobj", async (req, res) => {
  const { name, publisher, price } = req.body;

  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJ_TYPE}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  const newRecord = {
    properties: {
      name,
      publisher,
      price,
    },
  };

  try {
    await axios.post(url, newRecord, { headers });
    res.redirect("/");
  } catch (error) {
    console.error(
      "Error creating custom object:",
      error.response?.data || error.message
    );
    res.status(500).send("Error creating record");
  }
});

// Start local server
app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
