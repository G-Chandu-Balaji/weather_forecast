const temp = document.getElementById("temp");
const SunRise = document.getElementById("SunRise");
const SunSet = document.getElementById("SunSet");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const wind = document.getElementById("wind");
const max_temp = document.getElementById("max-temp");
const min_temp = document.getElementById("min-temp");
const visibility = document.getElementById("visibility");
const weatherDesc = document.getElementById("weatherDesc");
const date = document.getElementById("date");
const location1 = document.getElementById("location");
const forecast5days = document.getElementById("forecast5days");
console.log("forecast element", forecast5days);
console.log("wind", wind);

const API_KEY = "8a9726b8904e79e01949aa5196bf126f";

const searchButton = document.getElementById("searchbutton");
searchButton.addEventListener("click", () => {
  const searchInput = document.getElementById("searchinput").value;
  console.log(searchInput);
  geocoding(searchInput);
});

const locationButton = document.getElementById("locationbutton");
locationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(lat, lon);
    reverseGeocode(lat, lon);
    weatherdata(lat, lon);
    forecast(lat, lon);
  });
});

async function geocoding(city) {
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
    // forecast5days.innerHTML = "";
    for (let i = 0; i < 2; i++) {
      console.log("hi");
      forecast5days.innerHTML += `
      <div id=" forcast_item" class="border-2 border-black bg-gray-600 w-[50%] mx-auto rounded-2xl flex flex-col justify-center items-center py-2 capitalize">
            <h2>date</h2>
            <span><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" class="w-[80px] mt-[-10px]" alt="weather"/></span>
            <p class="mt-[-20px]"><span>temp :</span>  <span>${data.list[i].main.temp}</span></p>
            <p><span>wind :</span>  <span>${data.list[i].wind.speed}</span></p>
            <p><span>humidity :</span>  <span>${data.list[i].main.humidity}</span></p>
          </div>`;
    }
  } catch (err) {
    console.log(err);
  }
}

function dateAndTime(unixTimestamp, timezone) {
  const date = new Date(unixTimestamp * 1000 + timezone * 1000); // Convert to milliseconds

  // return date.toUTCString(); // Example: "Wed, 16 Apr 2025 12:00:00 GMT"
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

const condition = true; // or some logic
const hero = document.getElementById("hero");

const path = "/public/background_images/mist.jpg";

if (condition) {
  hero.style.backgroundImage = `url(${path})`;
} else {
  hero.style.backgroundImage = "none";
}
