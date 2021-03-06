import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import webpack from 'webpack'
import config from '../webpack.config'
import { parseConfig, getEnv } from './config/config'
import task from './routes/task'
import auth from './init/auth'
const app = express()
const compiler = webpack(config)

import template_tasks from './routes/template_tasks'
import mentors from './routes/mentors'
import noob from  './routes/noob'
import users from './routes/users'

if(getEnv() === 'development'){
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    serverSideRender: false,
    stats: {
      color: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }))
  app.use(require('webpack-hot-middleware')(compiler))
}

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/dist')))

auth(app)

app.use('/api/task', task)
app.use('/api/noob', noob)
app.use('/api/mentors', mentors)
app.use('/api/template_tasks', template_tasks)
app.use('/api/users', users)

/* GET home page. */
app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'browser/index.html'))
})


// catch 404 and forward to error handler
app.use( (req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.error(err)
  // render the error page
  res.status(err.status || 500)
  res.json({error:err.stack})
})


export default app
