const express = require("express");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;

const locations = {};

app.use(express.json());
app.use(express.static("public"));

// Create location link
app.post("/api/create-link", (req, res) => {

    const shareId = crypto.randomBytes(8).toString("hex");

    locations[shareId] = {
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null
    };

    res.json({
        shareId,
        link: `/share/${shareId}`
    });
});

// IMPORTANT: Handle /share/:shareId
app.get("/share/:shareId", (req, res) => {

    res.sendFile(
        __dirname + "/public/share.html"
    );

});

// Receive location
app.post("/api/location/:shareId", (req, res) => {

    const { shareId } = req.params;

    if (!locations[shareId]) {
        return res.status(404).json({
            error: "Invalid link"
        });
    }

    const {
        latitude,
        longitude,
        accuracy,
        timestamp
    } = req.body;

    locations[shareId] = {
        latitude,
        longitude,
        accuracy,
        timestamp
    };

    console.log("Location received:", locations[shareId]);

    res.json({
        success: true
    });

});

// Get location
app.get("/api/location/:shareId", (req, res) => {

    const { shareId } = req.params;

    if (!locations[shareId]) {
        return res.status(404).json({
            error: "Invalid link"
        });
    }

    res.json(locations[shareId]);

});

// Start server
app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on port ${PORT}`
    );

});