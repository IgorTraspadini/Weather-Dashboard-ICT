// Ensures the DOM is fully loaded before run the code.
$(document).ready(function () {

  // Const to access the HTML elements 
  const ElemForm = $("#search-form");
  const Elemhistory = $("#history");
  const ElemInput = $("#search-input");
  const ElemToday = $("#today");
  const ElemForecast = $("#forecast");

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
    // fetch location to LAT and LONG here
    //
    //

    // fetch today weather here
    //
    // 
    ElemToday.empty();
    const today = dayjs().format("D/M/YYYY");
    console.log(`call API ${city}`);
    const ElemH2Day = $("<h2 class='mt-1 ps-2 fs-2'>");
    ElemH2Day.text(`${city} (${today}) icon`);
    const temp = $('<p class="ps-2">').text(`Temp: ${city} °C`);
    const wind = $('<p class="ps-2">').text(`Wind: ${city} KPH`);
    const humidity = $('<p class="ps-2 pb-2">').text(`Humidity: ${city}%`);
    ElemToday.append(ElemH2Day, temp, wind, humidity);
    // fetch forecast weather here
    //
    //
    ElemForecast.empty();
    const ElemH2Fore = $("<h2 class='ps-2 fs-4 fw-bold'>").text("5-Day Forecast:");
    const ElemDivFore = $("<div class='d-flex justify-content-between'>");
    const ElemDay1 = $("<div class='forecast'>").append($("<p class='ps-2 fw-bold'>").text("15/01/2024"));

    const ElemDay2 = $("<div class='forecast'>").text("Day-2");
    const ElemDay3 = $("<div class='forecast'>").text("Day-3");
    const ElemDay4 = $("<div class='forecast'>").text("Day-4");
    const ElemDay5 = $("<div class='forecast'>").text("Day-5");
    ElemDivFore.append(ElemDay1, ElemDay2, ElemDay3, ElemDay4, ElemDay5);
    ElemForecast.append(ElemH2Fore, ElemDivFore);

  }

  // function to perform especific actions regards the listening event.
  // If "submit", it checks if the input value is not empty, call the API function and call the function to add the city to the history. 
  // If not, it just call the API and render the information.
  function searchByCity(e) {
    e.preventDefault();
    if (e.type === "submit") {
      if (ElemInput.val() !== "") {
        console.log(e.type);
        callAPI(ElemInput.val());
        addSHistory(ElemInput.val());
      }
    }
    else {
      console.log(e.type);
      callAPI($(this).attr("data-city"));
    }
  }

  // listening the "submit" event, and "click" event on the elements with the class ".btn"
  Elemhistory.on("click", ".btn", searchByCity);
  ElemForm.on("submit", searchByCity);

  // render the cities on the localStorage when the page is loaded
  renderButtons();

})