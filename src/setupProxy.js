const proxy = require('http-proxy-middleware')//引入http-proxy-middleware，react脚手架已经安装

module.exports = (app) => {
    app.use(
        proxy.createProxyMiddleware('/api', { //遇见/api1前缀的请求，就会触发该代理配置
            target: 'http://124.221.192.10:7529', //请求转发给谁
            // changeOrigin: true,//控制服务器收到的请求头中Host的值
            // pathRewrite: {'^/api': ''} //重写请求路径，下面有示例解释
        }),

        (_, res, next) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            next();
        });
};
