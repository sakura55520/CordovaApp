'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.60.120.34:90/MES_SERVER"',
  BASE_API_FILEHOST: '"http://10.60.120.34:90/MES_SERVER"',
  BASE_API_FILEPREVIEW:'"http://47.99.105.168:8888/"',
  MQ_PASS: '"admin"'
})
