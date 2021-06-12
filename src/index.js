/*
2-3까지
require('dotenv').config(); //.env파일에서 환경변수 받아오기

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//원본
mongoose.connect(process.env.MONGO_URI, {
    useMongoClient: true
}).then(
    (response) => {
        console.log('Successfully connected to mongodb');
    }
    ).catch(e => {
        console.error(e);
    });
    

//참고: https://www.a-mean-blog.com/ko/blog/Archived/%EA%B2%8C%EC%8B%9C%ED%8C%90-%EB%A7%8C%EB%93%A4%EA%B8%B0-2016/%EA%B2%8C%EC%8B%9C%ED%8C%90-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%83%9D%EC%84%B1-%EB%B0%8F-navbar
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI);

var db = mongoose.connection;
db.once("open", function(){
    console.log("DB connected");
});
db.on("error", function(err){
    console.log("DB ERROR : ", err);
});

const port = process.env.PORT || 4000; // PORT 값이 설정되어있지 않다면 4000 을 사용합니다.

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log('heurm server is listening to port ' + port);
});*/

require('dotenv').config(); // .env 파일에서 환경변수 불러오기

const Koa = require('koa');
const Router = require('koa-router');
const { jwtMiddleware } = require('lib/token');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const port = process.env.PORT || 4000; // PORT 값이 설정되어있지 않다면 4000 을 사용합니다.
mongoose.Promise = global.Promise; // Node 의 네이티브 Promise 사용
// mongodb 연결
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI);

var db = mongoose.connection;
db.once("open", function(){
    console.log("DB connected");
});
db.on("error", function(err){
    console.log("DB ERROR : ", err);
});

app.use(bodyParser()); // 바디파서 적용, 라우터 적용코드보다 상단에 있어야합니다.
app.use(jwtMiddleware);
router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정
app.use(router.routes()).use(router.allowedMethods());


app.listen(port, () => {
    console.log('heurm server is listening to port ' + port);
});

const crypto = require('crypto');

const password = 'abc123';
const secret = 'MySecretKey1$1$234';

const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');

console.log(hashed);

const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'secret-key', { expiresIn: '7d' }, (err, token) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log(token);
});

