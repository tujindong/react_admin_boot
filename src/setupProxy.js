const proxy = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        "/ajax",
        proxy({
            target: "http://192.168.1.19:8086/ajax", // 隐号运营商平台测试地址（新）
            changeOrigin: true,
            pathRewrite: {
                "^/ajax": "",
            },
        })
    );
};
