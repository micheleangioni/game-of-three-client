'use strict'

const url = process.env.API_URL ? `'${process.env.API_URL}'` : '"http://localhost:3000/"'

module.exports = {
  NODE_ENV: '"production"',
  API_URL: url
}
