'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  // Network API Configuration
  NETWORK_AREAS_API: '"http://localhost:8811/api/v1/areas/"',
  NETWORK_SYSTEMS_API: '"http://localhost:8811/api/v1/systems/"',
  NETWORK_API_AUTH: {
    username: '"admin"',
    password: '"admin"'
  }
})
