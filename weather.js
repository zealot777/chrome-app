function weatherConfirmed(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const API_KEY = "e911be0b97e6dfb14fdef812b8255d47";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const name = data.name; 
            const weather = data.weather[0].main;
            const temp = Math.round(data.main.temp); 
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const iconImage = document.querySelector("#weather-icon");
            iconImage.src=iconUrl;
            
            weatherBox.querySelector("#weather-location").innerText = name;
            weatherBox.querySelector("#weather-temp").innerText = `${temp}\u00B0C`;

            
            console.log(`${name}의 날씨는 ${weather}, 온도는 ${temp}도입니다.`);
        });
}
function weatherError(error)
{
    console.warn("에러 발생:", error.message);
    alert("위치 정보를 가져올 수 없습니다: " + error.message);
    alert("Out of Service");
}

navigator.geolocation.getCurrentPosition(weatherConfirmed,weatherError);