
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// City Aliases for Indian Cities
const cityAliases = {
  "Bangalore": "Bengaluru",
  "Madras": "Chennai",
  "Cochin": "Kochi",
  "Bombay": "Mumbai",    // Alias for Mumbai
  "Calcutta": "Kolkata", // Alias for Kolkata
  "Hyderabad": "Hyderabad",
  "Pune": "Pune",
  "Ahmedabad": "Ahmedabad",
  "Jaipur": "Jaipur",
  "Lucknow": "Lucknow",
  "Chandigarh": "Chandigarh",
  "Patna": "Patna",
  "Indore": "Indore",
  "Vadodara": "Vadodara",
  "Surat": "Surat",
  "Bhopal": "Bhopal",
  "Nagpur": "Nagpur",
  "Varanasi": "Varanasi",
  "Goa": "Panaji",    // Goa city
  "Agra": "Agra",
  "Ranchi": "Ranchi",
  "Mysore": "Mysuru",
  "Coimbatore": "Coimbatore",
  "Kochi": "Kochi",
  "Shillong": "Shillong",
  "Dehradun": "Dehradun",
  "Guwahati": "Guwahati",
  "Vadodara": "Vadodara",
  "Chennai": "Chennai",
  // Add more cities as needed
};

// Webhook for weather requests
app.post("/weather", async (req, res) => {
  let city = req.body.queryResult.parameters.city;

  // If city is not found in request, ask for it
  if (!city) {
    return res.json({
      fulfillmentText: "Please provide a city name to get the weather.",
    });
  }

  // Normalize city using alias map
  const normalizedCity = cityAliases[city] || city; // If city is not in alias map, use as is

  console.log(`Fetching weather data for: ${normalizedCity}`);  // Log the city name

  try {
    // OpenWeatherMap API Key directly in code (ensure you do not expose it publicly)
    const apiKey = "f0b1cd3e0bc4b341ac30307095c488a1";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${normalizedCity},IN&appid=${apiKey}&units=metric`;


    // Fetch weather data
    const response = await axios.get(url);
    console.log("Weather API Response:", response.data); // Log the full response

    const data = response.data;
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    // Return weather info in response
    return res.json({
      fulfillmentText: `The weather in ${normalizedCity} is ${weatherDescription} with a temperature of ${temperature}°C, humidity of ${humidity}%, and wind speed of ${windSpeed} m/s.`,
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    return res.json({
      fulfillmentText: `Sorry, I couldn't get the weather for ${city}. Please try again.`,
    });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
