const addBtn = document.getElementById("addDb");
const inputCity = document.getElementById("choose-city")
const main = document.getElementById("main");
const history = document.getElementById("history");
const historyBtn = document.getElementById("history-btn");
const count = document.getElementById("count");

let datab = {"history":[{"location":{"name":"Moscow","region":"Moscow City","country":"Russia","lat":55.75,"lon":37.62,"tz_id":"Europe/Moscow","localtime_epoch":1671428838,"localtime":"2022-12-19 8:47"},"current":{"last_updated_epoch":1671428700,"last_updated":"2022-12-19 08:45","temp_c":-9,"temp_f":15.8,"is_day":0,"condition":{"text":"Light snow","icon":"//cdn.weatherapi.com/weather/64x64/night/326.png","code":1213},"wind_mph":13.6,"wind_kph":22,"wind_degree":230,"wind_dir":"SW","pressure_mb":1024,"pressure_in":30.24,"precip_mm":0,"precip_in":0,"humidity":92,"cloud":100,"feelslike_c":-15.4,"feelslike_f":4.4,"vis_km":10,"vis_miles":6,"uv":1,"gust_mph":17.2,"gust_kph":27.7}}]};

const addDashBoard = function (content) {
    const dashboard = `<section class="dashboard border">
    <div id="location">
        <div>Страна: <span id="country">${content.location.country}</span></div>
        <div>Город: <span id="city">${content.location.name}</span></div>
        <div>Время обновления: <span id="time">${content.location.localtime}</span></div>
    </div>
    <div id="wheather">
        <div class="d-flex flex-column">
            <div class="d-flex flex-row">
                <div class="d-flex align-items-center">
                    <span id="temp_c">C<sup>o</sup>${content.current.temp_c}</span>
                </div>
                <div>
                    <img id="wheather-icon" src="https:${content.current.condition.icon}" alt="wheather" />
                </div>
                <div class="d-flex flex-column">
                    <div>
                        <span id="wheather-name">${content.current.condition.text}</span>
                    </div>
                    <div>
                        <span id="feeling-temp">По ощущениям ${content.current.feelslike_c}</span>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row justify-content-between mb-2">
                <div>
                    <span id="wing-speed">Ветер км/ч ${content.current.wind_mph}</span>
                </div>
                <div>
                    <span id="humidity">Влажность ${content.current.humidity}</span>
                </div>
                <div>
                    <span></span>
                </div>
                <div>
                    <span></span>
                </div>
            </div>
            <div>
                <button id="save" type="button" class="btn btn-success" onclick='saveWheather("${content.location.name}", "${content.location.localtime}")'>Сохранить</button>
            </div>
        </div>

    </section>`;

    main.innerHTML = main.innerHTML + dashboard;
};

const httpGet = function (theUrl, value) {
    let xmlHttp = new XMLHttpRequest();
    if(value){
        xmlHttp.open("GET", theUrl + `?location=${value}`, false); 
    } else {
        xmlHttp.open("GET");
    }
    xmlHttp.send(null);
    return xmlHttp.responseText;
};

const httpPost = function (theUrl) {
    fetch(theUrl, {
        method: "POST",
        body: JSON.stringify({ data: datab }),
        headers: {
            "content-type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            datab = json;
            updateHistory(json);
        });
};

const getWheather = function (value) {
    const url = "https://functions.yandexcloud.net/d4eeumslir2vnb8hg4jo";

    content = JSON.parse(httpGet(url, value));
    datab = content;
    addDashBoard(content);
};

const updateHistory = function (data) {
    history.innerHTML = "";
    for (i = 0; i < data.history.length; i++) {
        history.innerHTML += `<option value="${i}">${data.history[i].location.name}; ${data.history[i].location.localtime}</option>`;
    }
};

const saveWheather = function () {
    const url = "http://localhost:3000/save";

    httpPost(url);

    count.innerHTML = Number.parseInt(count.innerHTML) + 1;
};

const wheatherFromHistory = function () {
    let index = history.value;
    let content = datab.history[index];

    const dashboard = `<section class="dashboard border old">
    <div id="location">
        <div>Страна: <span id="country">${content.location.country}</span></div>
        <div>Город: <span id="city">${content.location.name}</span></div>
        <div>Время обновления: <span id="time">${content.location.localtime}</span></div>
    </div>
    <div id="wheather">
        <div class="d-flex flex-column">
            <div class="d-flex flex-row">
                <div class="d-flex align-items-center">
                    <span id="temp_c">C<sup>0</sup> ${content.current.temp_c}</span>
                </div>
                <div>
                    <img id="wheather-icon" src="https:${content.current.condition.icon}" alt="wheather" />
                </div>
                <div class="d-flex flex-column">
                    <div>
                        <span id="wheather-name">${content.current.condition.text}</span>
                    </div>
                    <div>
                        <span id="feeling-temp">По ощущениям ${content.current.feelslike_c}</span>
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row justify-content-between mb-2">
                <div>
                    <span id="wing-speed">Ветер км/ч ${content.current.wind_mph}</span>
                </div>
                <div>
                    <span id="humidity">Влажность ${content.current.humidity}</span>
                </div>
                <div>
                    <span></span>
                </div>
                <div>
                    <span></span>
                </div>
            </div>
            <div>
                <button id="save" type="button" class="btn btn-success" onclick='saveWheather("${content.location.name}", "${content.location.localtime}")'>Сохранить</button>
            </div>
        </div>

    </section>`;

    main.innerHTML = main.innerHTML + dashboard;
};

const updateCount = function(value){
    count.innerHTML = value
    console.log(value)
}

const getCountForWeek = function(theUrl = "http://localhost:3000/count"){
    fetch(theUrl, {
        method: "GET",
        headers: {
            "content-type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((json) => {
            updateCount(json);
        });
}

addBtn.onclick = () => {
    getWheather(inputCity.value);
};

historyBtn.onclick = () => {
    wheatherFromHistory();
};

getCountForWeek();
updateHistory(datab);