// accessing all elements
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

//------------------------------------------------------------------

//functions to get  latiitude and lognitude of entered city

async function geocoding(city) {
  try {
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;
    const res = await fetch(URL);
    const data = await res.json();
    if (data.length === 0) {
      alert("Please enter valid city");

      throw new Error("Please enter valid city");
    }
    location1.textContent = `${data[0].name}, ${data[0].state}`;

    storeUniqueCity(city);

    let lat = data[0].lat;
    let lon = data[0].lon;
    let state = data[0].state;

    forecast(lat, lon);
    return weatherdata(lat, lon);
  } catch (err) {
    console.log(err);
  }
}

// To get city name based on location

function reverseGeocode(lat, lon) {
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  )
    .then((response) => response.json())
    .then((data) => {
      location1.textContent = `${data.address.city},${data.address.state},${data.address.country}`;
    });
}

//To get weather data

async function weatherdata(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  if (document.getElementById("image_icon")) {
    const child = document.getElementById("image_icon");
    document.getElementById("image_container").removeChild(child);
  }
  try {
    const res = await fetch(URL);
    const data = await res.json();

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

//To get forcast Data

async function forecast(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  try {
    const res = await fetch(URL);
    const data = await res.json();

    const filterdata = data.list.filter((ele) =>
      ele.dt_txt.includes("12:00:00")
    );

    forecast5days.innerHTML = "";
    for (let i = 0; i < filterdata.length; i++) {
      forecast5days.innerHTML += `
      <div id=" forcast_item" class="border-1 border-black bg-white/10 shadow-2xl/30 backdrop-blur-[30px] w-[45%] sm:w-[50%]  ml-2 mr-auto sm:mx-auto rounded-2xl flex flex-col justify-center items-center py-2 capitalize">
            <h2>${filterdata[i].dt_txt.split(" ")[0]}</h2>
            <p>${filterdata[i].weather[0].description}</p>
            <span><img src="https://openweathermap.org/img/wn/${
              filterdata[i].weather[0].icon
            }@2x.png" class="w-[80px] mt-[-10px]" alt="weather"/></span>
            <p class="mt-[-20px]"><span>temp :</span>  <span>${
              filterdata[i].main.temp
            } &deg;C</span></p>
            <p><span>wind :</span>  <span>${
              filterdata[i].wind.speed
            }</span><span class="normal-case">m/s</span?</p>
            <p><span>humidity :</span>  <span>${
              filterdata[i].main.humidity
            }%</span></p>
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

//change timestamp according to timezone and also in 12-hours format
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

//-----------------------------------------------------------------------------

//store searched citites and dropdown suggestions from local storage

const inputelement = document.getElementById("searchinput");
const dropdown = document.getElementById("dropdown");

function getSavedCitites() {
  return JSON.parse(localStorage.getItem("searchCities"));
}

function storeUniqueCity(city) {
  let cities = getSavedCitites();
  city = city.trim();
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("searchCities", JSON.stringify(cities));
  }
}

function showDropdown(cities) {
  dropdown.innerHTML = "";

  if (cities.length === 0) {
    dropdown.style.display = "none";
    return;
  }
  cities.forEach((city) => {
    const item = document.createElement("div");
    item.className = "";
    item.textContent = city;
    item.onclick = () => {
      inputelement.value = city;
      dropdown.style.display = "none";
    };
    dropdown.appendChild(item);
  });

  dropdown.style.display = "block";
}

//adding  event listerner to input  and show dropdown with stored data

inputelement.addEventListener("input", () => {
  let savedCities = getSavedCitites();
  showDropdown(savedCities);
});

// if new enter save ciy on enter
inputelement.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const city = inputelement.value.trim();
    if (city.length === 0) {
      alert("Enter the city name");
    }
    if (city) {
      geocoding(city);
      dropdown.style.display = "none";
      inputelement.value = ""; // Optional: clear input
    }
  }
});

//if clicked outside input dropdown closes
document.addEventListener("click", (e) => {
  if (!inputelement.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

//-------------------------------------------------------------------------------------------

//To change background image according to weather condition

function changeBackground(icon, main) {
  if (main === "Clouds" || main === "Clear") {
    hero.style.backgroundImage = `url(/public/background_images/${icon}.jpg)`;
  } else {
    const path = `/public/background_images/${main}.jpg`;

    hero.style.backgroundImage = `url(${path})`;
  }
}

const hero = document.getElementById("hero");

//default background on mount
hero.style.backgroundImage = "url(/public/background_images/background1.jpg)";
