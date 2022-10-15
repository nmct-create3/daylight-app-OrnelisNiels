const getData = (endpoint) => {
  return fetch(endpoint)
    .then((r) => r.json())
    .catch((e) => console.error(e));
};

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
let updateSun = (percentage, time) => {
  const sun = document.querySelector('.js-sun');
  if (percentage >= 50 && percentage < 100) {
    test = 100 - (percentage % 50) * 2;
  } else if (percentage >= 100) {
    percentage = 0;
    test = 0;
  } else {
    test = percentage * 2;
  }
  sun.style.left = `${percentage}%`;
  sun.style.bottom = `${test}%`;
  sun.setAttribute('data-time', _parseMillisecondsIntoReadableTime(time));
};
// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  // Bepaal het aantal minuten dat de zon al op is.
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  // Vergeet niet om het resterende aantal minuten in te vullen.
  // Nu maken we een functie die de zon elke minuut zal updaten
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
  console.log(totalMinutes + ' ' + sunrise);
  const minutesLeft = document.querySelector('.js-time-left');
  const now = new Date();
  const nowInUnix = Math.floor(now.getTime() / 1000);
  const secondSunUp = nowInUnix - sunrise;
  console.log(secondSunUp);
  const percentage = (secondSunUp / totalMinutes) * 100;
  //   const percentage = 1;
  updateSun(percentage, nowInUnix);
  document.body.classList.add('is-loaded');
  minutesLeft.textContent = Math.round((totalMinutes - secondSunUp) / 60, 0);
  const interval = setInterval(() => {
    const now = new Date();
    const nowInUnix = Math.floor(now.getTime() / 1000);
    const secondSunUp = nowInUnix - sunrise;
    const percentage = (secondSunUp / totalMinutes) * 100;
    // const percentage = 1;
    updateSun(percentage, nowInUnix);
    minutesLeft.textContent = Math.round((totalMinutes - secondSunUp) / 60, 0);
  }, 60);
  if (percentage >= 100 || percentage <= 0) {
    clearInterval(interval);
    document.querySelector('.js-html').classList.add('is-night');
    minutesLeft.textContent = 0;
  }
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = (queryResponse) => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.

  const location = document.querySelector('.js-location');
  const sunrise = document.querySelector('.js-sunrise');
  const sunset = document.querySelector('.js-sunset');
  location.textContent =
    queryResponse.city.name + ' ' + queryResponse.city.country;
  sunrise.textContent = _parseMillisecondsIntoReadableTime(
    queryResponse.city.sunrise
  );
  sunset.textContent = _parseMillisecondsIntoReadableTime(
    queryResponse.city.sunset
  );
  totalMinutes = queryResponse.city.sunset - queryResponse.city.sunrise;
  console.log(totalMinutes);
  placeSunAndStartMoving(totalMinutes, queryResponse.city.sunrise);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=55ae2470e6091819b01835b71a57dfd8&units=metric&lang=nl&cnt=1`;
  const data = await getData(url);
  console.log(url);
  console.log(data);
  showResult(data);
};

document.addEventListener('DOMContentLoaded', function () {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
  console.info('loaded');
});
