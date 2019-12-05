const Oss = require('./oss');
const WebpackAliyunOss = require('webpack-aliyun-oss');
module.exports = {
    //publicPath: 'https://picker.grasswort.com',
    assetsDir: 'static',
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    'primary-color': '#1DA57A',
                    'link-color': '#1DA57A',
                    'border-radius-base': '2px',
                },
                javascriptEnabled: true
            }
        }
    },
    devServer:{
        proxy: "https://picker.grasswort.com"
    },
    configureWebpack: config => {
        let webpackAliyunOss = [
            new WebpackAliyunOss({
                from: "./dist/**", // 上传那个文件或文件夹  可以是字符串或数组
                region: Oss.region,
                accessKeyId: Oss.accessKeyId,
                accessKeySecret: Oss.accessKeySecret,
                bucket: Oss.bucket,
                test: true,
                setOssPath(filePath) {
                    // some operations to filePath
                    let index = filePath.lastIndexOf("dist");
                    let Path = filePath.substring(index + 4, filePath.length);
                    return Path.replace(/\\/g, "/");
                },
                // eslint-disable-next-line no-unused-vars
                setHeaders(filePath) {
                    // some operations to filePath
                    // return false to use default header
                    return {
                        "Cache-Control": "max-age=31536000"
                    };
                }
            })
        ];
        config.plugins = [...config.plugins, ...webpackAliyunOss ];
    }
}
