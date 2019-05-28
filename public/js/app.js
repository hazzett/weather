console.log('Connected to client-side program')

const weatherform = document.querySelector('form');
const search = document.querySelector('input');
const message1 = document.querySelector('#message-1');
const message2 = document.querySelector('#message-2');
// message1.textContent = 'from js';

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            fetch("/weather?lat=" + position.coords.latitude+"&lon="+ position.coords.longitude).then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        message1.textContent = data.error;
                    } else {
                        message1.textContent = data.location.location
                        message2.textContent = data.forecast
                    }
                })
            })
        });
    } else{
        message1.textContent = "Sorry, your browser does not support HTML5 geolocation.";
        message2.textContent = "Try a search, instead!"
    }
});

weatherform.addEventListener('submit', (e) => {
    e.preventDefault();

    message1.textContent = 'Loading...';
    message2.textContent = '';
    const location = search.value
    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                message1.textContent = data.error;
            } else {
                message1.textContent = data.location
                message2.textContent = data.forecast
            }
        })
    })
});
