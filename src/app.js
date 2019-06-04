const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '16mb'}));

// paths for express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup publi dir
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
    res.render('index', {
        name: 'sam',
        title: 'Weather man Sam',
    });
})
app.get('/about', (req, res) => {
    res.render('about', {
        name: 'sam',
        title: 'thank you habibi',
    });
})
app.get('/help', (req, res) => {
    res.render('help', {
        name: 'sam',
        title: 'HELP!!!!!',
    });
})

app.get('/weather', (req, res) => {
    if (!req.query.address && (!req.query.lon || !req.query.lat)) {
        return res.send({
            error: 'address is a requirement; please fix this and retry.'
        })
    }

    if (req.query.address) {
        console.log("loading with address...")

        geocode.geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) { return res.send({ error }) }
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) { return res.send({ error: error }) }
                res.send({
                    location: location,
                    forecast: forecastData
                })
            })
        });

    } else if (req.query.lon && req.query.lat) {
        console.log("loading with lon and lat...")
        geocode.reverseGeocode(req.query.lon, req.query.lat, (error, geolocation) => {
            if (error) { return res.send({ error }) }
            forecast(req.query.lat, req.query.lon, (error, forecastData) => {
                if (error) { return res.send({ error: error }) }
                res.send({
                    location: geolocation,
                    forecast: forecastData
                })
            })
        });
    }
});

app.post('/recv', (req, res) => {
    console.log('new post at /recv!')
    if (!req.body.img) {
        return console.log('the request body had null img attribute!')
    }
    var matches = req.body.img.match(/^data:.+\/(.+);base64,(.*)$/);
    var buffer = new Buffer.from(matches[2], 'base64');
    var savePath = path.resolve(__dirname + '/../public/uploads/'
        + Math.floor(Math.random() * 1000000) + '.png');
    fs.writeFileSync(savePath, buffer);
    console.log(savePath + ' lat:'+ req.body.lat + " long: "+ req.body.long);
    res.sendStatus(200);
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        name: 'sam',
        title: 'HELP PNF: 404!!!!!',
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        name: 'sam',
        title: 'PNF : 404',
    });
});

app.listen(port, () => {
    console.log('Serving to port ' + port + ' (Y)');
})