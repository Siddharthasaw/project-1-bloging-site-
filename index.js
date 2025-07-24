require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const route = require("./src/routes/route");
const app = express();

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MONGO_URI is not defined. Check your .env file and its location.");
    process.exit(1);
}

mongoose.connect(MONGO_URI, {
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB is connected"))
.catch(err => console.log(err));

app.use("/", route);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("Express app running on port " + PORT);
});




