const OSS = require('ali-oss')
// import request from '@/api/ali-oss/requestOss'
export const client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI4G2JjjWJL4pBWPoHPdze',
  accessKeySecret: 'v5Da5SqgelBhlLz7QY1aOVunBRsrGP',
  bucket: 'tmsfilesave',
  endpoint: 'https://oss-cn-shenzhen.aliyuncs.com',
  secure: true
})
