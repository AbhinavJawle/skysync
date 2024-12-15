const WeatherApp = (function () {
  // Private variables
  const API_KEY = "V8FHX6DGF8AZ4HHSYYFG69Q4K";
  const BASE_URL =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

  // Cached DOM elements
  const domElements = {
    locationInput: document.querySelector(".locationInput"),
    submitButton: document.getElementById("submitButton"),
    weatherContainer: document.getElementById("weather-container"),
    errorContainer: document.getElementById("error-container"),
    locationName: document.getElementById("location-name"),
    currentConditions: document.getElementById("current-conditions"),
    weatherIcon: document.getElementById("weather-icon"),
    currentTemp: document.getElementById("current-temp"),
    feelsLike: document.getElementById("feels-like"),
    humidity: document.getElementById("humidity-value"),
    description: document.getElementById("description-value"),
    errorMessage: document.getElementById("error-message"),
  };

  // Private weather icons mapping
  const weatherIcons = {
    "clear-day": "☀️",
    "clear-night": "🌙",
    "partly-cloudy-day": "🌤️",
    "partly-cloudy-night": "🌥️",
    cloudy: "☁️",
    rain: "🌧️",
    thunderstorm: "⛈️",
    snow: "❄️",
    wind: "💨",
    fog: "🌫️",
  };

  // Private methods
  function sanitizeInput(input) {
    // Basic input sanitization
    return input.trim().replace(/[<>]/g, "");
  }

  async function fetchWeatherData(location) {
    try {
      const sanitizedLocation = sanitizeInput(location);
      const url = `${BASE_URL}${encodeURIComponent(
        sanitizedLocation
      )}?key=${API_KEY}`;

      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return processData(data);
    } catch (error) {
      console.error("Weather fetch error:", error);
      throw error;
    }
  }

  function processData(data) {
    // Validate data structure
    if (!data || !data.currentConditions) {
      throw new Error("Invalid weather data");
    }

    return {
      resolvedAddress: data.resolvedAddress || "Unknown Location",
      icon: data.currentConditions.icon || "unknown",
      temp: Math.round(data.currentConditions.temp || 0),
      feelsLike: Math.round(data.currentConditions.feelslike || 0),
      conditions: data.currentConditions.conditions || "No conditions data",
      humidity: data.currentConditions.humidity || 0,
      description: data.description || "No description available",
    };
  }

  function displayWeather(weather) {
    // Reset containers
    domElements.weatherContainer.classList.remove("hidden");
    domElements.errorContainer.classList.add("hidden");

    // Update location details
    domElements.locationName.textContent = weather.resolvedAddress;
    domElements.currentConditions.textContent = weather.conditions;

    // Update temperature
    domElements.currentTemp.textContent = `${weather.temp}° F`; //add celcius and f converter
    domElements.feelsLike.textContent = `Feels like: ${weather.feelsLike}° F`;

    // Update weather icon
    domElements.weatherIcon.textContent = weatherIcons[weather.icon] || "❓";

    // Update additional details
    domElements.humidity.textContent = `${weather.humidity}%`;
    domElements.description.textContent = weather.description;
  }

  function showError(message) {
    domElements.weatherContainer.classList.add("hidden");
    domElements.errorContainer.classList.remove("hidden");
    domElements.errorMessage.textContent = message;
  }

  // Event Handlers
  function handleWeatherSearch() {
    const location = domElements.locationInput.value;

    if (!location) {
      showError("Please enter a location");
      return;
    }

    fetchWeatherData(location)
      .then(displayWeather)
      .catch((error) => {
        showError("Unable to fetch weather data. Please try again.");
      });
  }

  // Public methods (Revealing Module Pattern)
  function init() {
    // Add event listeners
    domElements.submitButton.addEventListener("click", handleWeatherSearch);
    domElements.locationInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleWeatherSearch();
      }
    });
  }

  // Expose public methods
  return {
    init: init,
  };
})();

// Initialize the app when DOM is fully loaded
document.addEventListener("DOMContentLoaded", WeatherApp.init);
