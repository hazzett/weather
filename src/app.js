const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

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
        title: 'title',
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
    if (!req.query.address) {
        return res.send({
            error: 'address is a requirement; please fix this and retry.'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) { return res.send({ error }) }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) { return res.send({ error: error }) }
            res.send({
                location: location,
                forecast: forecastData
            })
        })
    })
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

app.listen(3000, () => {
    console.log('port 3000 (Y)');
})