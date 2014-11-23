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
  var handshake = Instagram.subscriptions.handshake(this.request, this.response);
}));

app.use(router.post('/callback', function *() {
  console.log('\n%j', this.body);
}));

app.listen(PORT, function () {
  console.log('Server listening at port %d', PORT);
});