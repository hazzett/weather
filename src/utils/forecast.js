const request = require('request');

const forecast = (longitude, latitude, callback) => {
    const url = 'https://api.darksky.net/forecast/72faca05053378f574da19963b30c9c9/'+longitude+','+latitude+'?units=si';

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body === undefined || body.error) {
            callback('Unable to find forecast for specified location; please try again!', undefined);
        } else {
            callback(undefined, body.daily.data[0].summary +' It is currently '+ body.currently.temperature +' degrees and there is '+ body.currently.precipProbability +'% chance of rains.')
        }
    })
}

module.exports = forecast;