var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var user = require('./routes/user');
var auth = require('./routes/auth');
var item = require('./routes/item');
var community = require('./routes/community');
var item_category = require('./routes/item_category');
var api = require('./api/index')

var authMiddleware = require('./auth/middleware');
var Shared = require('./shared.js')

var app = express();
const Item = require('./models/itemModel')

require('dotenv-safe').config();
console.log(process.env.DATABASE_URL)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//Use pug to generate views
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  credentials: true,
}));

app.use('/auth', auth);
app.use('/', index);
app.use('/api', api);
app.use('/user', authMiddleware.ensureLoggedIn, user); // authMiddleware.ensureLoggedIn,
app.use('/item', authMiddleware.ensureLoggedIn, item); // authMiddleware.ensureLoggedIn,
app.use('/community', authMiddleware.ensureLoggedIn, community); // authMiddleware.ensureLoggedIn,
app.use('/item_category', authMiddleware.ensureLoggedIn, item_category); // authMiddleware.ensureLoggedIn,

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  Shared.allowOrigin(res, req);
  var err = new Error('Address Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
 
  // res.render('error');
  Shared.allowOrigin(res, req);
  res.status(err.status || res.statusCode || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err: {}
  })
});


//Listen for message queue jobs
const amqp = require('amqplib/callback_api');
const connString = 'amqp://hcktxhys:nfHt2kNtc8dImNkmrMJSYEuI9Noaw8ug@cat.rmq.cloudamqp.com/hcktxhys'

amqp.connect(connString, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
          let msgObj = JSON.parse(msg.content)
          console.log(" [x] Received %s", msgObj.action);
          switch(msgObj.action) {
            case "loadItemFields":
              console.log('about to upd cust field ',msgObj.item_fields)
              Item
                .updateCustomFields(msgObj.item_fields)
              channel.ack(msg)
              break;
            case 'updateItemField':
              console.log('updateItemField msg received: ', msgObj.itemtypefield)
              Item
              .countAllOfType(msgObj.itemtypefield.fielditemtype_id)      
              .then(result => {
                const itemFieldUpdateLimit = 5
                records = parseInt(result[0].count);
                chunks = Math.ceil(records / itemFieldUpdateLimit)
                console.log('results, records, chunks: ',result, records, chunks)
                for (i = 0; i < chunks; i++) {
                  const smsgObj = {action: 'itemFieldChunkUpdate'};
                  const smsg = JSON.stringify(smsgObj)
                  console.log('create s message', smsg)
          
                  channel.assertQueue(queue, {
                      durable: true
                  });
                  channel.sendToQueue(queue, Buffer.from(smsg), {
                    persistent: true
                  });
          
                  console.log(" [x] Sent %s", smsg);
                }
                console.log('all items w type: ', result)
                channel.ack(msg)
              })    
              
              break; 
            default:
              console.log(' [x] Action %s not defined', msgObj.action)
              channel.ack(msg)
          }
        }, {
            noAck: false
        });
    });
});

module.exports = app;
