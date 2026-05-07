const clockContainer = document.querySelector(".time-box");
const clock = document.querySelector(".time-box--clock");
const currentDate = document.querySelector(".time-box--date");
const dateArray = ["일요일", "월요일", "화요일", "수요일" ,"목요일","금요일","토요일"];
const weatherBox = document.querySelector(".weather-box");
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");
const scheduler = document.querySelector("#scheduler");
const logoutBtn = document.querySelector("#logout-btn");

const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username"; 

function onLoginSubmit(event) {
    event.preventDefault(); 
    loginForm.classList.add(HIDDEN_CLASSNAME); // 폼 숨기기
    
    const username = loginInput.value;
    localStorage.setItem(USERNAME_KEY, username); // 🌟 로컬 스토리지에 저장
    paintGreetings(username); // 인사말 보여주기
}

function paintGreetings(username) {
    greeting.innerText = `안녕하세요, ${username}님!`;
    scheduler.classList.remove(HIDDEN_CLASSNAME); // 🌟 메인 화면 나타내기
    logoutBtn.classList.remove(HIDDEN_CLASSNAME);
}
function onLogoutClick() {
    // 1. LocalStorage에서 이름 삭제
    localStorage.removeItem(USERNAME_KEY);
    
    // 2. 페이지를 새로고침해서 초기 상태로 복구 (가장 깔끔한 방법)
    window.location.reload(); 
    
    /* 
       새로고침 없이 하려면 아래처럼 수동으로 바꿔줘야 합니다:
       loginForm.classList.remove(HIDDEN_CLASSNAME);
       scheduler.classList.add(HIDDEN_CLASSNAME);
       clockBox.classList.remove("logged-in");
    */
}

logoutBtn.addEventListener("click", onLogoutClick);
// --- 여기서부터가 "새로고침 유지" 로직 ---

const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername === null) {
    // 1. 저장된 이름이 없으면? 폼을 보여주고 제출 이벤트를 기다림
    loginForm.classList.remove(HIDDEN_CLASSNAME);
    loginForm.addEventListener("submit", onLoginSubmit);
} else {
    // 2. 저장된 이름이 있으면? 폼은 놔두고(이미 CSS나 HTML에서 숨김 처리) 인사말 바로 실행
    loginForm.classList.add(HIDDEN_CLASSNAME);
    clockContainer.classList.add("logged-in");

    paintGreetings(savedUsername);
}
// HTML에 <img> 태그가 있다면 그곳의 src를 바꿔주면 끝!


function randomBackground() {
    // 1~4까지의 랜덤 숫자 생성
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    
    // 이미지 경로 설정 (공백과 괄호 주의!)
    const bgImage = `img/img${randomNumber}.jpg`;
    
    // body의 배경이미지로 지정
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${bgImage}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}

// 스크립트가 로드될 때 바로 실행




function updateDate(){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const dateLabel = dateArray[date.getDay()];

    currentDate.innerText = `${year}년 ${month}월 ${day}일 ${dateLabel}`;
};
function updateClock(){
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    clock.innerText = `${hours}:${minutes}:${seconds}`;
    if (hours === "00" && minutes ==="00" && seconds === "00")
    {
        updateDate();
    }
};


function weatherConfirmed(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const API_KEY = "e911be0b97e6dfb14fdef812b8255d47";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&`;

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
            iconImage.onload = function() 
            {iconImage.style.opacity = "1"; };
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

randomBackground();
updateClock();
updateDate();
setInterval(updateClock,1000);

