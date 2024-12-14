const locationInput = document.querySelector(".locationInput");
const submitButton = document.getElementById("submitButton");
let locationValue = "";

locationInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    console.log("enter");
    locationValue = locationInput.value;
    getApiData();
  }
});

async function getApiData() {
  const API_URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationValue}?key=V8FHX6DGF8AZ4HHSYYFG69Q4K`;
  const data = await fetch(API_URL, { mode: "cors" });
  console.log(data.json());
}
