const express = require("express");
const mongoose = require("mongoose");
const { MessagingResponse } = require("twilio").twiml;

const app = express();
app.use(express.urlencoded({ extended: false }));

// Connect MongoDB (we will create next step)
mongoose.connect("mongodb+srv://waran8774_db_user:vign2004@cluster0.nsnaiix.mongodb.net/bot?retryWrites=true&w=majority");

const Location = mongoose.model("Location", {
  name: String,
  keyword: String,
  latitude: Number,
  longitude: Number,
  address: String
});

app.post("/whatsapp", async (req, res) => {
  const twiml = new MessagingResponse();
  const message = req.body.Body.toLowerCase();

  const results = await Location.find({ keyword: message });

  if (results.length > 0) {
    results.forEach(loc => {
      twiml.message(
        `📍 ${loc.name}\n${loc.address}\nhttps://maps.google.com/?q=${loc.latitude},${loc.longitude}`
      );
    });
  } else {
    twiml.message("No location found.");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));