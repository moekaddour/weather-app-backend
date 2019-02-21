const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.post;

app.get("/", (req, res, next) => {
  res.send("");
});

app.post("/weather", (req, res, next) => {
  let address = req.body.address;
  let encodedURL = encodeURIComponent(address);
  axios
    .get(
      `http://www.mapquestapi.com/geocoding/v1/address?key=type-key=${encodedURL}`
    )
    .then(response => {
      console.log(response.data.results[0].locations[0].latLng);

      let latitude = response.data.results[0].locations[0].latLng.lat;
      let longitude = response.data.results[0].locations[0].latLng.lng;

      axios.get(
        `https://api.darksky.net/forecast/type-key/${latitude},${longitude}`
      ).then(response=>{
          console.log(response.data.currently.temperature)
          res.send(JSON.stringify({
            city: response.data.timezone,
              summary: response.data.currently.summary,
            temperature: Math.round((response.data.currently.temperature -32)*5/9),
            apparentTemperature: Math.round((response.data.currently.apparentTemperature-32)*5/9),
            humidity: response.data.currently.humidity,
            pressure: response.data.currently.pressure,
            windSpeed: response.data.currently.windSpeed,
            visibility: response.data.currently.visibility
          }))
      })
    })
    .catch(err => {
      console.log(err);
    });
});

//Error handling
app.use((req, res, next) => {
  let error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status = error.status || 500;
  res.send(
    JSON.stringify({
      message: error.message
    })
  );
});
app.listen(4000, () => {
  console.log("listening on port 4000");
});
