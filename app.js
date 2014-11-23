var koa = require('koa.io');
var logger = require('koa-logger');
var router = require('koa-route');
var co = require('co');
var Instagram = require('instagram-node-lib');
var config = require('./config.json');

var app = koa();
var PORT = process.env.PORT || 3700;

// Instagram configuration
for (key in config) {
  var value = config[key];
  console.log('Configuring Instagram with %s: %s', key, value);
  Instagram.set(key, value);
}

Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'selfie',
  aspect: 'media',
  callback_url: config.callback_url,
  type: 'subscription',
  id: '#'
});

app.use(logger());

app.use(router.get('/callback', function *() {
  Instagram.subscriptions.handshake(this.req, this.res);
}));

app.use(router.post('/callback', function *() {
  console.log('\n%j', this.request);
}));

app.use(router.get('/', function *() {
  this.status = 200;
}));

app.listen(PORT, function () {
  console.log('Server listening at port %d', PORT);
});