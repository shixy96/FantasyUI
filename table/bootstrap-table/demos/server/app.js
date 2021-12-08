const express = require('express')
const app = express()

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
app.get('/examples/:project/:func', require('./examples'))
app.post('/examples/:project/:func', require('./examples'))
const server = app.listen(3000, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Examples app listening at http://%s:%s', host, port)
})
