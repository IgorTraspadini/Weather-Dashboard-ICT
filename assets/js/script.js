// Ensures the DOM is fully loaded before run the code.
$(document).ready(function () {

  // Const to access the HTML elements 
  const ElemForm = $("#search-form");
  const Elemhistory = $("#history");
  const ElemInput = $("#search-input");
  const ElemToday = $("#today");
  const ElemForecast = $("#forecast");
  const APIKey = "2f52d4fdc5a729796a58922bcf59f241";
  const pr = process.env.APIKey;
  console.log(pr);
  console.log(process.env);

  // Function to render the buttons on the history section.
  // If called with parameter, it render just a new button
  // If called without parameter, it render a new button for each city in the history array     
  function renderButtons(city) {
    if (city === undefined) {
      historyStorage = JSON.parse(localStorage.getItem("history"));
      if (historyStorage !== null) {
        $.each(historyStorage, function (i, v) {
          const ElemButton = $("<button class='btn btn-secondary text-dark mb-3'>").attr("type", "button");
          ElemButton.attr("data-city", v);
          ElemButton.text(v);
          Elemhistory.prepend(ElemButton);
        })
      }
    }
    else {
      const ElemButton = $("<button class='btn btn-secondary text-dark mb-3'>").attr("type", "button");
      ElemButton.attr("data-city", city);
      ElemButton.text(city);
      Elemhistory.prepend(ElemButton);
    }
  }

  // function to add a new city to the history Object in the localStorage.
  // If the localStorage is empty, it create a new array with the city passed to the function and add it to the localStorage
  // If not, it push a new city to the localStorage only in case that it doesn't exist.
  function addSHistory(city) {
    ElemInput.val('');
    historyStorage = JSON.parse(localStorage.getItem("history"));
    if (historyStorage === null) {
      historyStorage = [city];
      localStorage.setItem("history", JSON.stringify(historyStorage));
      renderButtons(city);
    }
    else if (!historyStorage.includes(city)) {
      historyStorage.push(city);
      localStorage.setItem("history", JSON.stringify(historyStorage));
      renderButtons(city);
    }
  }

  // function to call the API with the city passed to the function, and render the information on the today and forecast elements.
  function callAPI(city) {
    // fetch location to LAT and LONG, and today weather.
    const queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`;
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const newQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${APIKey}`
        fetch(newQueryUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            ElemToday.empty();
            const today = dayjs().format("D/M/YYYY");
            const ElemH2Day = $("<h2 class='mt-1 ps-2 fs-3 fw-bold'>");
            const ico = $("<img>").attr("src", `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
            ElemH2Day.text(`${city} (${today})`);
            ElemH2Day.append(ico);
            const temp = $('<p class="ps-2">').text(`Temp: ${parseInt(data.main.temp - 273.15)} °C`);
            const wind = $('<p class="ps-2">').text(`Wind: ${data.wind.speed}  KPH`);
            const humidity = $('<p class="ps-2 pb-2">').text(`Humidity: ${data.main.humidity}%`);
            ElemToday.append(ElemH2Day, temp, wind, humidity);
          })
      })

    // fetch forecast weather here
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const newQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${APIKey}`
        fetch(newQueryUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            ElemForecast.empty();
            const ElemDivFore = $("<div class='d-flex justify-content-between'>");
            const ElemH2Fore = $("<h2 class='ps-2 fs-4 fw-bold'>").text("5-Day Forecast:");
            for (let i = 1; i < 6; i++) {
              const dayForecast = dayjs().add(i, 'day').format("D/M/YYYY");
              // Looking for the forecast date into the JSON data.list
              for (let j = 0; j < data.list.length; j++) {
                const dayFore5 = dayjs.unix(data.list[j].dt).format("D/M/YYYY");
                // Take the first occurrence of the forecast date, render the elements and go for other forecast date.
                if (dayFore5 === dayForecast) {
                  const ElemDay = $("<div class='forecast'>").append($("<p class='ps-2 fw-bold'>").text(dayForecast));
                  const ico = $("<img class='ps-2'>").attr("src", `https://openweathermap.org/img/w/${data.list[j].weather[0].icon}.png`);
                  const temp = $('<p class="ps-2">').text(`Temp: ${parseInt(data.list[j].main.temp - 273.15)} °C`);
                  const wind = $('<p class="ps-2">').text(`Wind: ${data.list[j].wind.speed} KPH`);
                  const humidity = $('<p class="ps-2 pb-2">').text(`Humidity: ${data.list[j].main.humidity}%`);
                  ElemDay.append(ico, temp, wind, humidity);
                  ElemDivFore.append(ElemDay);
                  break;
                }
              }
            }
            ElemForecast.append(ElemH2Fore, ElemDivFore);
          })
      })
  }

  // function to perform especific actions regards the listening event.
  // If "submit", it checks if the input value is not empty, call the API function and call the function to add the city to the history. 
  // If not, it just call the API and render the information.
  function searchByCity(e) {
    e.preventDefault();
    if (e.type === "submit") {
      if (ElemInput.val() !== "") {
        callAPI(ElemInput.val());
        addSHistory(ElemInput.val());
      }
    }
    else {
      callAPI($(this).attr("data-city"));
    }
  }

  // listening the "submit" event, and "click" event on the elements with the class ".btn"
  Elemhistory.on("click", ".btn", searchByCity);
  ElemForm.on("submit", searchByCity);

  // render the cities on the localStorage when the page is loaded
  renderButtons();

})
