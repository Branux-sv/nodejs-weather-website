const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const port = process.env.PORT || 3000

//Define paths for express config
const publicDirPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
 
//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
 
//Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, resp) => {
    resp.render('index', {
        title: 'Weather',
        name: 'Brayan Marroquin'
    })
})

app.get('/about', (req, resp) => {
    resp.render('about',{
        title: 'About me',
        name: 'Brayan Marroquin'
    })
})

app.get('/help', (req, resp) => {
    resp.render('help',{
        title: 'Help',
        msg: 'Well Lets Do it!!',
        name: 'Brayan Marroquin'
    })
})

app.get('/weather', (req, resp) => {
    if (!req.query.address){
        return resp.send({ 
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
        if (error){
            return resp.send({ error: error })
        }
        forecast(longitude, latitude, (error, forecastData) => {
            if (error){
                return resp.send({ error: error })
            }
            resp.send({ 
                location: location,
                forecast: forecastData
            })
        })   
    })

})


app.get('/products', (req, resp) => {
    if (!req.query.search){
        return resp.send({ 
            error: 'You must provide a search term'
        })
    }
    resp.send({ 
        products: []
    })
})


app.get('/help/*', (req, resp) => {
    resp.render('404',{
        title: '404',
        errorMsg: 'Help article not found',
        name: 'Brayan Marroquin.'
    })
})

app.get('*', (req, resp) => {
    resp.render('404',{
        title: '404',
        errorMsg: 'Page Not Found :(',
        name: 'Brayan Marroquin.'
    })
})

//Start Web Server 
app.listen(port, () => {
    console.log('Server is up on port' + port)
})
