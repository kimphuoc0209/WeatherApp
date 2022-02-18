const inputCity = document.getElementById("city-input");
const weatherBtn = document.getElementById("weather-btn");
const errorMsg = document.getElementById("error-msg");
const weatherCard = document.getElementById("weather-card");
const forecastBtn = document.getElementById("forecast-btn");
const forecastSection = document.querySelector(".bottom-section");

//thêm số 0 nếu giờ là một số nhỏ hơn 10
function addZero(j) {
  if (j < 10) {
    j = "0" + j;
  }
  return j;
}
//hiển thị thời tiết khi nhấn vào nút Show weather
weatherBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //kiểm tra người dùng đã nhập tên thành phố chưa
  if (inputCity.value == "") {
    errorMsg.innerHTML = "*Please enter a city!";
    return;
  }
  //nếu đã nhập thì tìm kiếm thông tin
  else {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=" +
      inputCity.value
    )
    .then((response) => response.json())
    .then((data) => {
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0].icon}.svg`;
        //tạo ngày và giờ ở thời điểm hiện tại
        let date = new Date().toDateString();
        let newDate = new Date();
        let h = addZero(newDate.getHours());
        let m = addZero(newDate.getMinutes());
        let hour = h + ":" + m;

        //tạo thẻ thời tiết
        let output = `
                        <div class="card">
                            <h3 class="city-name">${inputCity.value}, 
                            ${data.sys.country}</h3>
                            <p class="date">${date}, ${hour}</p>
                            <h1 class="temperature">${Math.round(
          data.main.temp
        )}<span>°C</span></h1>
                            <img class="weather-icon" src="${icon}"/>
                            <p class="weahter-description">${data.weather[0].description
          }</p>
                            <p class="detailed-temp">Min. temp: ${Math.round(
            data.main.temp_min
          )}°C</p>
                            <p class="detailed-temp">Max. temp: ${Math.round(
            data.main.temp_max
          )}°C</p>
                            <p class="detailed-temp">Humidity: ${data.main.humidity
          }%</p>
                            <p class="detailed-temp">Pressure: ${data.main.pressure
          } hPa</p>
                        </div>
                    `;
        weatherCard.innerHTML = output;
        errorMsg.innerHTML = "";
      });
  }
});

//hiển thị thời tiết 6 ngày tiếp theo khi click vào '6 Day forecast'
forecastBtn.addEventListener("click", (e) => {
  e.preventDefault();

  forecastSection.innerHTML = "";
  if (inputCity.value == "") {
    errorMsg.innerHTML = "*Please enter a city!";
    return;
  } else {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=" +
      inputCity.value
    )
      .then((response) => response.json())
      .then((data) => {

        //tạo thẻ thời tiết 6 ngày tiếp theo
        for (let i = 0; i <= data.list.length - 1; i++) {
          const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;
          //tạo định dạng ngày và giờ cho dự báo thời tiết
          let month = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          let d = new Date(data.list[i].dt * 1000);
          let cardMonth = month[d.getMonth()];
          let cardDay = addZero(d.getDate());
          let cardHour = addZero(d.getHours());
          let output = document.createElement("div");//tạo một thẻ div nơi các thẻ thời tiết sẽ được chèn vào
          output.classList.add("card", "forecast-card");//thêm các class vào thẻ div
          //tạo thẻ thời tiết đầu ra
          output.innerHTML = `
                        <p class="forecast-date">${cardMonth}, ${cardDay}</p>
                        <p class="forecast-date">${cardHour}:00</p>
                        <h3 class="city-name">${inputCity.value}</h3>
                        <h1 class="temperature">${Math.round(
            data.list[i].main.temp
          )}<span>°C</span></h1>
                        <img class="weather-icon" src="${icon}"/>
                        <p class="weahter-description">${data.list[i].weather[0].description
            }</p>
                    `;

          let today = new Date(data.list[0].dt * 1000).getDate();
            //so sánh ngày của thẻ thời tiết với hôm nay và hiển thị các ngày dự báo trên các hàng riêng biệt
          if (cardDay == today) {
            output.style.gridRow = "1";
          } else if (cardDay == today + 1) {
            output.style.gridRow = "2";
          } else if (cardDay == today + 2) {
            output.style.gridRow = "3";
          } else if (cardDay == today + 3) {
            output.style.gridRow = "4";
          } else if (cardDay == today + 4) {
            output.style.gridRow = "5";
          } else if (cardDay == today + 5) {
            output.style.gridRow = "6";
          }

          forecastSection.appendChild(output);
          errorMsg.innerHTML = "";
        }
      });
  }
});


