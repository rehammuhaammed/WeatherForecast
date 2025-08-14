let searchInput = document.getElementById("searchInput");
let rowData = document.getElementById("row");
let msg = document.getElementById("msg");
let regex = /^[A-Za-z ]{3,}$/;
let forecastData = [];
getWeather(); // 
 function getWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

async function success(position) {
  let lat=position.coords.latitude
  let long=position.coords.longitude
  console.log(`lat= ${lat}, log=${long}`);
  let x = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=10a2f41ca0584e56a0e181338251804&q=${lat},${long}&days=3`
  );
  forcast = await x.json();

  extractdata();
  display();
}

async function error() {
  let x = await fetch(
     `https://api.weatherapi.com/v1/forecast.json?key=10a2f41ca0584e56a0e181338251804&q=Cairo&days=3`
  );
  forcast = await x.json();

  extractdata();
  display();
}



async function search() {
  let value = searchInput.value;
  if (regex.test(value)) {
    msg.classList.add("d-none")
    let x = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=10a2f41ca0584e56a0e181338251804&q=${value}`
    );
    let data = await x.json(); // array has many city start with lon choose first one only

    if (data.length != 0) {
      // if the arr not empty (search may back no counry has this name [])
      msg.classList.add("d-none")
      let y = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=10a2f41ca0584e56a0e181338251804&q=${data[0].name}&days=3`
      );
      forcast = await y.json(); // array of 3 days forecating weather
      extractdata();
      display();
    }
    else{
      msg.classList.remove("d-none")
      msg.textContent = " There is no city with this name. Please enter another city. ";
    }
  } else {
    msg.classList.remove("d-none")
    msg.textContent = " Please enter at least 3 characters to search ";
  
  }
  if(value==""){
    msg.classList.add("d-none")
  }
}

function extractdata() {
  forecastData = [];

  for (let i = 0; i < 3; i++) {
    let Temp = forcast.current.temp_c;
    let day = forcast.forecast.forecastday[i];
    let date = new Date(day.date);
    let options = { weekday: "long", month: "long", day: "numeric" };
    let formattedDate = date
      .toLocaleDateString("en-US", options)
      .replace(",", "")
      .split(" "); //[day ,numday,mounth]

    let dayname = formattedDate[0];
    let month = formattedDate[2] + " " + formattedDate[1]; // April 20
    let Avgtemp = Temp;
    let maxTemp = day.day.maxtemp_c;
    let minTemp = day.day.mintemp_c;
    let icon = day.day.condition.icon;
    let text = day.day.condition.text;
    let country = forcast.location.name;

    forecastData.push({
      dayname,
      month,
      icon,
      text,
      country,
      Avgtemp,
      maxTemp,
      minTemp,
});


  }
  // array has full data for three the  days
  // console.log("hgggg",forecastData);
}

function display() {
  let cartona = "";
  cartona += `
 <div class="col ">
                <div class="inner ">
                  <div
                    class="header d-flex justify-content-between align-items-center"
                    
                  >
                    <span>${forecastData[0].dayname}</span>
                    <span  >${forecastData[0].month}</span>
                  </div>

                  <div class="today-data">
                    <div class="country" >${forecastData[0].country}</div>

                    <div
                      class="degree d-flex justify-content-between align-items-center gap-1"
                    >
                      <h1 class="num">
                        <span id="Avgtemp">${forecastData[0].Avgtemp}</span> <sup>o</sup>C
                        </h1>
                      <div class="icon" id="todayIcon">
                       <img src=${forecastData[0].icon} class="w-100" alt="" />
                      </div>
                    </div>

                    <span id="todayText">${forecastData[0].text}</span>
                    <ul class="d-flex flex-row list-unstyled gap-4 my-4">
                      <li>
                        <span>
                          <img src="images/icon-umberella.png" alt="" />
                          20%
                        </span>
                      </li>
                      <li>
                        <span>
                          <img src="images/icon-wind.png" alt="" />
                          18km/h
                        </span>
                      </li>
                      <li>
                        <span>
                          <img src="images/icon-compass.png" alt="" />
                          East
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

`; // put the first card in cartona because it has a different design
  for (let i = 1; i < forecastData.length; i++) {
    cartona += `
    <div class="col ">
                <div class="inner text-center">
                  <div class="header">
                    <span >${forecastData[i].dayname}</span>
                  </div>
                  <div class="degree d-flex flex-column justify-content-between align-items-center mt-4 gap-1">
                    <div class="icon">
                      <img src="${forecastData[i].icon}" alt="" />
                    </div>
                    
                    <h4 class="num">
                        ${forecastData[i].maxTemp}
                      <sup>o</sup>
                      
                    </h4>
                    
                    <span>
                    ${forecastData[i].minTemp}
                      <sup>o</sup>
                     </span>
                    <span id="text">
                      ${forecastData[i].text}
                    </span>

                  </div>
                </div>
              </div>
   
   `;
    // loop to put anther 2 cards in cartona also
  }
  rowData.innerHTML = cartona;
  // put cartona in html
}
