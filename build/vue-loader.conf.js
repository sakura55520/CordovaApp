'use strict'
const utils = require('./utils')
const config = require('../config')
var isProduction = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'company_production_test' || process.env.NODE_ENV === 'production_test')
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
