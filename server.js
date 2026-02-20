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
  maplink: String,
  address: String
});

app.post("/whatsapp", async (req, res) => {
  const twiml = new MessagingResponse();
  const message = req.body.Body.toLowerCase();

  const results = await Location.find({ keyword: message });

  if (results.length > 0) {
    results.forEach(loc => {
      twiml.message(
        `📍 ${loc.name}\n${loc.address}\n${loc.maplink}`
      );
    });
  } else {
    twiml.message("No location found.");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// ✅ ADD ADMIN ROUTES HERE 👇

app.get("/admin", (req, res) => {
  res.send(`
    <h2>Add Location</h2>
    <form method="POST" action="/add-location">
      <input name="name" placeholder="Name" required /><br/><br/>
      <input name="keyword" placeholder="Keyword" required /><br/><br/>
      <input name="maplink" placeholder="Google Maps Link" required /><br/><br/>
      <input name="address" placeholder="Address" required /><br/><br/>
      <button type="submit">Add Location</button>
    </form>
  `);
});

app.post("/add-location", async (req, res) => {
  const { name, keyword, maplink, address } = req.body;

  await Location.create({
    name,
    keyword: keyword.toLowerCase(),
    maplink,
    address
  });

  res.send("Location Added Successfully ✅ <br><a href='/admin'>Add Another</a>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));