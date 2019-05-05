const log4js = require('log4js')
    , Koa = require('koa')
    , ALY = require("aliyun-sdk")
    , URL = require("url").URL
    ;
const sls_uri = new URL(process.env["SLS_URL"]);
const slsConfig = {
    accessKeyId: sls_uri.username,
    secretAccessKey: sls_uri.password,
    endpoint: sls_uri.origin,
    apiVersion: '2015-06-01'
}
var sls = new ALY.SLS(slsConfig);
var logger = log4js.getLogger("apibus-log-aliyun");
logger.level = process.env["LOG_LEVEL"] || "TRACE";
var app = new Koa();
var bodyParser = require('koa-bodyparser');
app.use(bodyParser());
app.use(async function (ctx, next) {
    ctx.body={
        success:true
    };
    var body = ctx.request.body;
    logger.info(body.request.appkey,body.request.method,body.request.version);
    var content=[{
        key:"version",
        value:""+body.request.version
    },{
        key:"appkey",
        value:""+body.request.appkey
    },{
        key:"method",
        value:""+body.request.method
    },{
        key:"time",
        value:""+body.request.time
    },{
        key:"user_ip",
        value:body.user_ip
    },{
        key:"request_id",
        value:body.request_id
    },{
        key:"content",
        value:JSON.stringify(body)
    }];
    sls.putLogs({
        //必选字段
        projectName: sls_uri.searchParams.get("projectName"),
        logStoreName: sls_uri.searchParams.get("logStoreName"),
        logGroup: {
            logs: [{
                time: Math.floor(new Date().getTime() / 1000),
                contents: content
            }],
            topic: sls_uri.searchParams.get("topic"),
            source: sls_uri.searchParams.get("source")
        }
    }, function (err, data) {

        if (err) {
            logger.error("日志上报错误",err,data);
            return;
        }

        //console.log('success:', data);

    });
    
});

app.listen(3000, function (err) {
    if (err) {
        logger.error('开启端口失败', err);
        process.exit(1);
    }
    else {
        logger.info('启动成功。')
    }
});