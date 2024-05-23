"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
// on load reset the inputType back to running
inputType.value = "running";

//GLOBAL VARIABLES
let map;
let mapEvent;
let workouts = []; // Task 4.4 array to store all workouts

//CLASSES
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration); // from WORKOUT class
    this.cadence = cadence; // in steps/min
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration); // from WORKOUT class
    this.elevationGain = elevationGain; // in meters
  }
}
// end of classes

// //testing the classes
// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycle1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycle1);

//navigator code
navigator.geolocation.getCurrentPosition(
  function (position) {
    // console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);

    // add LEAFLET SAMPLE CODE here
    const coords = [latitude, longitude];
    map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", function (mapE) {
      mapEvent = mapE;

      form.classList.remove("hidden");
      inputDistance.focus();

      // console.log(mapEvent);
    });
  },
  function () {
    alert("Could not get position.");
  }
);

// form event listener to check if submitted/completed
form.addEventListener("submit", function (e) {
  e.preventDefault(); // code for adding map marker...

  //Task 4.4 - get data from form
  const type = inputType.value;
  const distance = Number(inputDistance.value);
  const duration = Number(inputDuration.value);
  const lat = mapEvent.latlng.lat;
  const lng = mapEvent.latlng.lng;
  let workout;

  // Create a new Workout Instance
  if (type === "running") {
    const cadence = Number(inputCadence.value);
    //validate form later

    workout = new Running([lat, lng], distance, duration, cadence);
  }
  if (type === "cycling") {
    const elevation = Number(inputElevation.value);
    //validate form later
    workout = new Cycling([lat, lng], distance, duration, elevation);
  }

  workouts.push(workout);
  //task 4.4 testing the workouts array
  console.log(workouts);

  //Display marker on map
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();

  //reset the form
  if (inputType.value == "cycling") {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }
  form.reset();

  // form.classList.add("hidden");
});

//Event Listener Toggle form input type change.
inputType.addEventListener("change", function () {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});
