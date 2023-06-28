const express = require('express')
const mongoose = require('mongoose') //mongoose library
const ShortUrl = require('./models/shortUrl')
const app = express()

//connecting the server to mongoose 
mongoose.connect('mongodb://127.0.0.1:27017/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (requir, respons) => {
  const shortUrls = await ShortUrl.find()
  respons.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (requir, respons) => {
  await ShortUrl.create({ full: requir.body.fullUrl })

  respons.redirect('/')
})

app.get('/:shortUrl', async (requir, respons) => {
  const shortUrl = await ShortUrl.findOne({ short: requir.params.shortUrl })
  if (shortUrl == null) return respons.sendStatus(404)

  shortUrl.clicks++ //increment of no. of clicks whenever the shrink button is tapped
  shortUrl.save()

  respons.redirect(shortUrl.full) //redirect to fullUrl when tapped on the shortUrl 
})

app.listen(process.env.PORT || 4000); //visit the site -> localhost:4000 to use it
