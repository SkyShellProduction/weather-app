const APIKEY = '';
const host = 'https://api.openweathermap.org';
const lat = 41.30108557176432;
const long = 69.26905977506551;
const imgs = [
    {
        main: 'clear',
        bgday: 'images/backgrounds/sunny-day.png',
        bgnight: 'images/backgrounds/sunny-night.png',
    },
    {
        main: 'rain',
        bgday: 'images/backgrounds/rain-day.png',
        bgnight: 'images/backgrounds/rain-night.png',
    },
    {
        main: 'snow',
        bgday: 'images/backgrounds/snow-day.png',
        bgnight: 'images/backgrounds/snow-night.png',
    },
    {
        main: 'clouds',
        bgday: 'images/backgrounds/clouds-day.png',
        bgnight: 'images/backgrounds/clouds-night.png',
    },
    {
        main: 'fog',
        bgday: 'images/backgrounds/fog-day.png',
        bgnight: 'images/backgrounds/fog-night.png',
    },
]
const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const app = document.querySelector('.app'),
    hello = document.querySelector('.hello'),
    appAdd = app.querySelector('.app__add'),
    appBack = app.querySelector('.app__back'),
    appSearch = app.querySelector('.app__search'),
    appTime = app.querySelector('.app__city-time'),
    appCity = app.querySelector('.app__location span'),
    appForecast = app.querySelector('.app__forecast span'),
    appTemperature = app.querySelector('.app__temperature'),
    appTemperatureMax = app.querySelector('.app__changes-max span'),
    appTemperatureMin = app.querySelector('.app__changes-min span'),
    appWindSpeed = app.querySelector('.app__wind-speed h3'),
    appTemperatureFeel = app.querySelector('.app__temperature-feel h3'),
    appHumidity = app.querySelector('.app__humidity h3'),
    appVisibility = app.querySelector('.app__visibility h3'),
    appSunrise = app.querySelector('.app__sunrise span'),
    appSunset = app.querySelector('.app__sunset span'),
    appDates = app.querySelector('.app__dates'),
    appForm = app.querySelector('.app__form'),
    appInput = app.querySelector('.app__input'),
    appUndefined = app.querySelector('.undefined'),
    appList = app.querySelector('.app__list'),
    deg = '℃';
function openClose(bool = true){
    app.style.overflow = bool ? 'hidden' : '';
    appSearch.classList[bool ? 'add' : 'remove']('active');
}
function fromUnix(time){
    let d = new Date(time * 1000);
    let hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
    let minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
    return `${hours}:${minutes}`;
}
appAdd.addEventListener('click', function(e){
    e.preventDefault();
    openClose();
});
appBack.addEventListener('click', function(e){
    e.preventDefault();
    openClose(false);
});
function clock(){
    let date = new Date();
    let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    let day = days[date.getDay()];
    let limit = hours > 12 ? 'PM' : 'AM';
    appTime.textContent = `${day} ${hours}:${minutes}:${seconds} ${limit}`;
    setTimeout(clock, 1000);
};
function setWeather(res, weekly){
    appCity.textContent = res.name;
    appForecast.textContent = res.weather[0].description;
    appTemperature.textContent = res.main.temp + deg;
    appTemperatureMax.textContent = res.main.temp_max + deg;
    appTemperatureMin.textContent = res.main.temp_min + deg;
    appTemperatureFeel.textContent = res.main.feels_like + deg;
    appWindSpeed.textContent = res.wind.speed + ' км/ч';
    appHumidity.textContent = res.main.humidity +'%';
    appVisibility.textContent = res.visibility/1000 + ' км';
    appSunrise.textContent = fromUnix(res.sys.sunrise);
    appSunset.textContent = fromUnix(res.sys.sunset);
    let index = imgs.findIndex(item => item.main == res.weather[0].main.toLowerCase());
    if(index != -1) {
        let bg = new Date().getHours() < 17 ? imgs[index].bgday : imgs[index].bgnight;
        app.style.backgroundImage = `url(${bg})`;
    }
    let d = new Date().getDay();
    let arr = days.slice(d);
    let arr2 = days.slice(0, d);
    let con = arr.concat(arr2);
    con.length = 5;
    appDates.innerHTML = '';
    if(new Date().getHours() > 17) {
        app.style.color = '#fff';
        appAdd.style.backgroundColor = '#fff';
    }
    con.forEach((item, i) => {
        let div = document.createElement('div');
        div.classList.add('app__item');
        div.innerHTML = `
            <div class="app__day">${item}</div>
            <img src="images/icons/weather.svg" alt="" class="app__weather-icon">
            <div class="app__temp">
                <p>${weekly.list[i].main.temp_max}℃</p>
                <p>${weekly.list[i].main.temp_min}℃</p>
            </div>
        `;
        appDates.append(div);
    });
}
clock();
async function fOPen(url) {
    let res = await fetch(url);
    if(res.ok) return res.json();
    else {
        alert('Oops something get wrong');
        throw new Error(`Cannot connect to ${url}`);
    }
}
let url = `${host}/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&lang=ru&APPID=${APIKEY}`;
let url2 = `${host}/data/2.5/forecast?lat=${lat}&lon=${long}&cnt=5&lang=ru&units=metric&appid=${APIKEY}`;
async function weatherData(link1, link2){
    const [daily, weekly] = await Promise.all([
        fOPen(link1),
        fOPen(link2),
    ])
    return { daily, weekly};
}
weatherData(url, url2).then(res => {
    setWeather(res.daily, res.weekly);
    hello.classList.remove('active');
});
function chooseCity(btn){
    event.preventDefault();
    let lat = btn.getAttribute('data-lat');
    let lon = btn.getAttribute('data-lon');
    let url = `${host}/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&lang=ru&APPID=${APIKEY}`;
    let url2 = `${host}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&lang=ru&units=metric&appid=${APIKEY}`;
    weatherData(url, url2).then(res => {
        setWeather(res.daily, res.weekly);
        openClose(false);
    });
}
function createFavorite(text, lat, lon){
    let li = document.createElement('li');
    li.innerHTML = `<a href="#" class="app__list-link" data-lat="${lat}" data-lon="${lon}" onclick="chooseCity(this)">${text}</a>`;
    appList.append(li);
}
appForm.addEventListener('submit', function(e){
    e.preventDefault();
    let url3 = `${host}/geo/1.0/direct?q=${appInput.value}&appid=${APIKEY}`;
    this.reset();
    const links = [...appList.querySelectorAll('.app__list-link')];
    fOPen(url3)
    .then(res => {
        if(res.length > 0){
            appUndefined.textContent = '';
            if(links.length > 0) {
                if(links.every(item => item.textContent.toLowerCase() != res[0].name.toLowerCase() ? item : false)){
                    createFavorite(res[0].name, res[0].lat, res[0].lon);
                }
            }
            else {
                createFavorite(res[0].name, res[0].lat, res[0].lon);
            }
        }
        else appUndefined.textContent = 'Ничего не найдено';
    })
})
