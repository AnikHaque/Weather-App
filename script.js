// State
let units = "metric";

// Selectors
const city = document.querySelector(".weather__city");
const datetime = document.querySelector(".weather__datetime");
const weather__forecast = document.querySelector(".weather__forecast");
const weather__temperature = document.querySelector(".weather__temperature");
const weather__icon = document.querySelector(".weather__icon");
const weather__minmax = document.querySelector(".weather__minmax");
const weather__realfeel = document.querySelector(".weather__realfeel");
const weather__humidity = document.querySelector(".weather__humidity");
const weather__wind = document.querySelector(".weather__wind");
const weather__pressure = document.querySelector(".weather__pressure");

// Search
document.querySelector(".weather__search").addEventListener("submit", (e) => {
  e.preventDefault();
  const search = document.querySelector(".weather__searchform");
  const location = search.value.trim();
  if (location !== "") {
    getWeatherData(location);
    search.value = "";
  }
});

// Units
document.querySelector(".weather_unit_celsius").addEventListener("click", () => {
  if (units !== "metric") {
    units = "metric";
    const search = document.querySelector(".weather__searchform");
    const location = search.value.trim();
    if (location !== "") {
      getWeatherData(location);
    }
  }
});

document.querySelector(".weather_unit_farenheit").addEventListener("click", () => {
  if (units !== "imperial") {
    units = "imperial";
    const search = document.querySelector(".weather__searchform");
    const location = search.value.trim();
    if (location !== "") {
      getWeatherData(location);
    }
  }
});

// Convert timestamp to formatted date
const convertTimeStamp = (timestamp, timezone) => {
  const convertTimezone = timezone / 3600;
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(
      convertTimezone
    )}`,
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

// Convert country code to name
const convertCountryCode = (country) => {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(country);
};

// Display error message
const displayError = () => {
  city.textContent = "Error";
  datetime.textContent = "";
  weather__forecast.textContent = "";
  weather__temperature.textContent = "";
  weather__icon.innerHTML = "";
  weather__minmax.innerHTML = "";
  weather__realfeel.textContent = "";
  weather__humidity.textContent = "";
  weather__wind.textContent = "";
  weather__pressure.textContent = "";
};

// Get weather data from API
const getWeatherData = (location) => {
  const API_KEY = "64f60853740a1ee3ba20d0fb595c97d5"; 

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=${units}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Unable to fetch weather data. Please try again.");
      }
      return res.json();
    })
    .then((data) => {
      city.textContent = `${data.name}, ${convertCountryCode(data.sys.country)}`;
      datetime.textContent = convertTimeStamp(data.dt, data.timezone);
      weather__forecast.textContent = `${data.weather[0].main}`;
      weather__temperature.textContent = `${data.main.temp.toFixed()}°`;
      weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
      weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}°</p><p>Max: ${data.main.temp_max.toFixed()}°</p>`;
      weather__realfeel.textContent = `${data.main.feels_like.toFixed()}°`;
      weather__humidity.textContent = `${data.main.humidity}%`;
      weather__wind.textContent = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
      weather__pressure.textContent = `${data.main.pressure} hPa`;
    })
    .catch((error) => {
      console.log("Error:", error);
      displayError();
    });
};
