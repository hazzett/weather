const request = require('request');

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1Ijoic2FtYW1lcyIsImEiOiJjanZzN3FhZzAxMWdjNGFvejFrNzcyNnpyIn0.WqRkJG06QJ_pMuSbGX03uQ&limit=1';

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined);
        } else if (body.features === undefined || body.features.length == 0) {
            callback('Unable to find specified location; please check address!', undefined);
        } else {
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                location: body.features[0].place_name

            })
        }
    })
}
const reverseGeocode = (lon , lat , callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + lon + "," + lat + ".json?types=place&access_token=pk.eyJ1Ijoic2FtYW1lcyIsImEiOiJjanZzN3FhZzAxMWdjNGFvejFrNzcyNnpyIn0.WqRkJG06QJ_pMuSbGX03uQ&limit=1";

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined);
        } else if (body.features === undefined || body.features.length == 0) {
            callback('Unable to find specified location; please check address!', undefined);
        } else {
            callback(undefined, {
                location: body.features[0].place_name

            })
        }
    })
}

module.exports = { reverseGeocode, geocode };