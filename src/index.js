const temp = document.getElementById("temp");
const SunRise = document.getElementById("SunRise");
const SunSet = document.getElementById("SunSet");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const wind = document.getElementById("wind");
const max_temp = document.getElementById("max-temp");
const min_temp = document.getElementById("min-temp");
const visibility = document.getElementById("visibility");
const feelslike = document.getElementById("feelslike");
const weatherDesc = document.getElementById("weatherDesc");
const date = document.getElementById("date");
const location1 = document.getElementById("location");
const forecast5days = document.getElementById("forecast5days");

const API_KEY = "8a9726b8904e79e01949aa5196bf126f";

// search button
const searchButton = document.getElementById("searchbutton");
searchButton.addEventListener("click", () => {
  const searchInput = document.getElementById("searchinput").value;
  geocoding(searchInput);
});

//location button
const locationButton = document.getElementById("locationbutton");
locationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    reverseGeocode(lat, lon);
    weatherdata(lat, lon);
    forecast(lat, lon);
  });
});

//functions for weather and place

async function geocoding(city) {
  location1.textContent = city;
  try {
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;
    const res = await fetch(URL);
    const data = await res.json();
    let lat = data[0].lat;
    let lon = data[0].lon;
    let state = data[0].state;
    console.log(lat, lon, state);
    forecast(lat, lon);
    return weatherdata(lat, lon);
  } catch (err) {
    console.log(err);
  }
}

async function weatherdata(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  if (document.getElementById("image_icon")) {
    const child = document.getElementById("image_icon");
    document.getElementById("image_container").removeChild(child);
  }
  try {
    const res = await fetch(URL);
    const data = await res.json();
    console.log(data);
    temp.textContent = data.main.temp;
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;
    min_temp.textContent = data.main.temp_min;
    max_temp.textContent = data.main.temp_max;
    visibility.textContent = data.visibility;
    feelslike.textContent = data.main.feels_like;
    wind.textContent = data.wind.speed;
    weatherDesc.textContent = data.weather[0].description;
    date.textContent = dateAndTime(data.dt, data.timezone);
    SunRise.textContent = time(data.sys.sunrise, data.timezone);
    SunSet.textContent = time(data.sys.sunset, data.timezone);
    const image = document.createElement("img");
    image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    image.alt = "weather icon";
    image.width = 150;
    image.id = "image_icon";
    document.getElementById("image_container").appendChild(image);
    changeBackground(data.weather[0].icon, data.weather[0].main);
  } catch (err) {
    console.log(err.message);
  }
}

function reverseGeocode(lat, lon) {
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  )
    .then((response) => response.json())
    .then((data) => {
      location1.textContent = `${data.address.city},${data.address.state},${data.address.country}`;
      console.log("Location:", data.display_name);
    });
}

async function forecast(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const res = await fetch(URL);
    const data = await res.json();
    console.log("forecast", data);
    const filterdata = data.list.filter((ele) =>
      ele.dt_txt.includes("12:00:00")
    );

    forecast5days.innerHTML = "";
    for (let i = 0; i < filterdata.length; i++) {
      console.log("hi");
      forecast5days.innerHTML += `
      <div id=" forcast_item" class="border-1 border-black bg-white/10 shadow-2xl/30 backdrop-blur-xs w-[50%] mx-auto rounded-2xl flex flex-col justify-center items-center py-2 capitalize">
            <h2>${filterdata[i].dt_txt.split(" ")[0]}</h2>
            <p>${filterdata[i].weather[0].description}</p>
            <span><img src="https://openweathermap.org/img/wn/${
              filterdata[i].weather[0].icon
            }@2x.png" class="w-[80px] mt-[-10px]" alt="weather"/></span>
            <p class="mt-[-20px]"><span>temp :</span>  <span>${
              filterdata[i].main.temp
            }</span></p>
            <p><span>wind :</span>  <span>${filterdata[i].wind.speed}</span></p>
            <p><span>humidity :</span>  <span>${
              filterdata[i].main.humidity
            }</span></p>
          </div>`;
    }
  } catch (err) {
    console.log(err);
  }
}

// change timestamp to human readable time
function dateAndTime(unixTimestamp, timezone) {
  const date = new Date(unixTimestamp * 1000 + timezone * 1000); // Convert to milliseconds
  return date.toUTCString() + formatOffset(timezone);

  // Helper to format offset like "+05:30"
  function formatOffset(seconds) {
    const sign = seconds >= 0 ? "+" : "-";
    const abs = Math.abs(seconds);
    const hours = Math.floor(abs / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((abs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
  }
}

function time(timee, timezone) {
  const date = new Date(timee * 1000 + timezone * 1000);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  // Convert to 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 -> 12 for midnight

  return `${hours.toString().padStart(2, "0")}:${minutes} ${period}`;
}

// background images change
function changeBackground(icon, main) {
  if (main === "Clouds" || main === "Clear") {
    console.log("hellllllllllllo");
  } else {
    const path = `/public/background_images/${main}.jpg`;

    hero.style.backgroundImage = `url(${path})`;
  }
}

const hero = document.getElementById("hero");
hero.style.backgroundImage = "url(/public/background_images/background2.jpg)";
