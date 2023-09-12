// https://openweathermap.org/current
// https://home.openweathermap.org/api_keys

const yourWeatherTab = document.querySelector('.your-weather-tab');
const searchWeatherTab = document.querySelector('.search-weather-tab');
const tab = document.querySelectorAll('.tab');

const grantLocationAccess = document.querySelector('.grant-location-access');
const loading = document.querySelector('.loading');
const searchForm = document.querySelector('.search-form');
const info = document.querySelector('.info');

const grantAccessBtn = document.querySelector('.grant-access-btn');

const API_KEY = 'd743cd389f791d52185d5e3c94e449c6';

const notFound = document.querySelector('.notFound');

const city = document.querySelector('.city');
const countryIcon = document.querySelector('.country-icon');
const descName = document.querySelector('.desc-name');
const descIcon = document.querySelector('.desc-icon');
const temperature = document.querySelector('.temperature');
const windspeedValue = document.querySelector('.windspeed-value');
const humidityValue = document.querySelector('.humidity-value');
const cloudValue = document.querySelector('.cloud-value');

const formInput = document.querySelector('.form-input');
const formSubmitBtn = document.querySelector('.form-submit-btn');

// initialisation
let currentTab = yourWeatherTab;
currentTab.classList.add('current-tab');


// let coordinates = {};
// localStorage.setItem("coordinates", coordinates);

updateCurrTabProps();


tab.forEach((clickedTab)=>{
    clickedTab.addEventListener('click', ()=>{
        if(clickedTab!=currentTab){
            currentTab.classList.remove('current-tab');
            clickedTab.classList.add('current-tab');
            currentTab = clickedTab;
            updateCurrTabProps()
        }
    });
})

function updateCurrTabProps(){
    if(currentTab==yourWeatherTab){
        let coords = JSON.parse(localStorage.getItem("coordinates"));
        // console.log("coords - ",localStorage.getItem("coordinates"), typeof coords)
        if(!coords.latitude){
            grantLocationAccess.classList.add('active');
            loading.classList.remove('active');
            searchForm.classList.remove('active');
            info.classList.remove('active');
            notFound.classList.remove('active');
        }
        else{
            loading.classList.add('active');
            grantLocationAccess.classList.remove('active');
            searchForm.classList.remove('active');
            info.classList.remove('active');
            notFound.classList.remove('active');

            fetchUserWeatherDetails();
        }
    }
    else{
        searchForm.classList.add('active');
        grantLocationAccess.classList.remove('active');
        loading.classList.remove('active');
        info.classList.remove('active');
        notFound.classList.remove('active');
    }
}

grantAccessBtn.addEventListener('click', getLocation);

function getLocation(){
    if( navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            let coordinates = {
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
            };
            console.log(coordinates, typeof coordinates)
            localStorage.setItem("coordinates",JSON.stringify(coordinates));
            // console.log("updated coords - ", coordinates, typeof coordinates)
            // console.log("updated coords - ", localStorage.getItem("coordinates"), typeof coordinates)
            fetchUserWeatherDetails();      // WHY CANT PUT OUTSIDE CALLBACK FUNCTION
        });
    }
    else{
        console.log('Navigator Geolocation Not Found');
    }
}

async function fetchUserWeatherDetails(){
    loading.classList.add('active');
    grantLocationAccess.classList.remove('active');
    searchForm.classList.remove('active');
    info.classList.remove('active');
    notFound.classList.remove('active');
    let coords = JSON.parse(localStorage.getItem("coordinates"));
    // console.log("inside fetch - ", coords);
    // console.log("inside fetch - ", coords.latitude);
    // console.log("inside fetch - ", coords.longitude);


    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`);
        const data = await response.json();
        renderWeatherDetails(data);
    }
    catch(e){
        loading.classList.remove('active');
        notFound.classList.add('active');
    }
}

async function renderWeatherDetails(data){
    try{
        city.innerText = data?.name;
        let code = data?.sys?.country;
        countryIcon.src = `https://flagcdn.com/144x108/${code.toLowerCase()}.png`;
        descName.innerText = data?.weather?.[0]?.description;
        descIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
        temperature.innerText = `${(data?.main?.temp - 273.15).toFixed(2)} °C`;        windspeedValue.innerText = `${data?.wind?.speed} m/s`;
        humidityValue.innerText = `${data?.main?.humidity} %`;
        cloudValue.innerText = `${data?.clouds?.all} %`;
        
        loading.classList.remove('active');
        info.classList.add('active');
    }
    catch (e){       // is wale se catch ho rha hai
        loading.classList.remove('active');
        notFound.classList.add('active');
    }
}

formSubmitBtn.addEventListener('click', (btn)=>{
    btn.preventDefault();
    if(formInput.value.length!=0)
        fetchSearchWeatherInfo(formInput.value);
});

async function fetchSearchWeatherInfo(cityName){
    loading.classList.add('active');
    grantLocationAccess.classList.remove('active');
    info.classList.remove('active');
    notFound.classList.remove('active');
    
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data = await response.json();
        renderWeatherDetails(data);
    }
    catch(e){       // is wale se catch nhi ho rha hai
        loading.classList.remove('active');
        notFound.classList.add('active');
    }
}
