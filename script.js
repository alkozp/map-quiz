import {worldMap, startTimerIcon, pauseTimerIcon} from './svglib.js'

let countryList = [];
let trueCountries = 0;
let timerPaused = false;
let timerStarted = false;
let firstRun = true;



function initCountryList(event){
    const worldMapList = document.querySelectorAll('#world-map path');
    worldMapList.forEach((country)=>{
        //countryList[country.getAttribute('title').toLowerCase()] = false;
        countryList.push({
            title: country.getAttribute('title').toLowerCase(),
            id: country.getAttribute('id'),
            status: false,
        });
    });
    console.log(countryList);
    document.querySelector('#goal').textContent = countryList.length+"]";
}

function findCountry (list, search) {
    const index = list.findIndex ((country, index)=>{
        return country.title.toLowerCase() === String(search).toLowerCase().trim();
    });
    return index;
}

function checkInput(event) {
    event.preventDefault();
    if (timerPaused || !timerStarted) return false;
    let inputPhrase = event.target.value;
    const foundCountryIndex = findCountry(countryList, inputPhrase); 
    if (foundCountryIndex >= 0 && countryList[foundCountryIndex].status === false){
        //console.log(findCountry(countryList, inputPhrase));
        countryList[foundCountryIndex].status = true;
        trueCountries++;
        const svg = document.querySelector(`path[id=${countryList[foundCountryIndex].id}]`);
        svg.classList.add('checked-country');
        event.target.value = '';
        document.querySelector('#counter').textContent = trueCountries;
    }
}

function endGame(){
    //timerStarted = false;
    timerPaused = true;
    const score = document.querySelector('#score');
    const scoreList = document.querySelector('#score-list');
    //fill score list
    let listScoreHTML ='';
    countryList.forEach((country)=>{
        listScoreHTML += `<span ${country.status ? 'class="checked"': 'class="no"'}>${country.title}</span>`;
    });
    scoreList.innerHTML = listScoreHTML;
    const detailScore = document.querySelector('#detail-score span');
    detailScore.textContent = `SCORE: ${trueCountries} from ${countryList.length} [${trueCountries*100/countryList.length}%]`;
    score.showModal();
}

function timerStart() {
    let timer = document.querySelector('#timer');
    //console.log(timer.textContent);
    // start count
    setInterval (() => {
        //check time end
        if (String(timer.textContent) === '00:00') {
            console.log('00:00');
            if (timerStarted){ endGame(); }
            return;
        }
        if (!timerPaused){
            let time = String(timer.textContent).split(':');
            //sec
            if ( Number(time[1]) !== 0 ) {
                let newSec = Number(time[1])-1;
                time[1] = newSec<10 ? '0'+String(newSec) : String(newSec);
            //min
            } else {
                let newSec = '59';
                let newMin = Number(time[0])-1;
                time = [newMin<10 ? '0'+String(newMin) : String(newMin), newSec];
            }
            timer.textContent = `${time[0]}:${time[1]}`;
            //console.log(time[0],time[1]);
        }
    }, 1000)
}

function changeIcon(state) {
    if (state === 'pause'){
        document.querySelector('#start-timer').innerHTML = startTimerIcon;
    } else {
        document.querySelector('#start-timer').innerHTML = pauseTimerIcon;
    }
}

function timerCheckStatus() {
    if (!timerStarted && firstRun){
        firstRun = false;
        timerStarted = true;
        timerPaused = false;
        changeIcon('pause');
        timerStart();
    }
    else {
        timerPaused = !timerPaused ? true : false;
        changeIcon(timerPaused ? 'start' : 'pause')
    }
}

document.querySelector('#input-country').addEventListener('input', checkInput);
document.querySelector('#start-timer').addEventListener('click', timerCheckStatus);
document.addEventListener('DOMContentLoaded', initCountryList);
document.querySelector('form').addEventListener('submit',(event)=>{event.preventDefault();})
document.querySelector('#close-modal').addEventListener('click', ()=>{
    document.querySelector('#score').close();
    // reset game to start again
    countryList = [];
    trueCountries = 0;
    timerPaused = true;
    initCountryList();
    document.querySelector('#start-timer').innerHTML = startTimerIcon;
    document.querySelector('#timer').textContent = '01:00';
    document.querySelector('#world-map').outerHTML = worldMap;
    changeIcon('start');
})

