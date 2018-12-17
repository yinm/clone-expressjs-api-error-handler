const error = require('http-errors')
const request = require('supertest')
const express = require('express')
const assert = require('assert')

const handler = require('..')

describe('API Error Handler', () => {
  it('5xx', (done) => {
    const app = express()
    app.use((req, res, next) => {
      next(error(501, 'lol'))
    })
    app.use(handler())

    request(app.listen())
      .get('/')
      .expect(501)
      .end((err, res) => {
        assert.ifError(err)

        const body = res.body
        assert.equal(body.message, 'Not Implemented')
        assert.equal(body.status, 501)
        done()
      })
  })

  it('4xx', (done) => {
    const app = express()
    app.use((req, res, next) => {
      next(error(401, 'lol', {
        type: 'a',
        code: 'b'
      }))
    })
    app.use(handler())

    request(app.listen())
      .get('/')
      .expect(401)
      .end((err, res) => {
        assert.ifError(err)

        const body = res.body
        assert.equal(body.message, 'lol')
        assert.equal(body.status, 401)
        assert.equal(body.type, 'a')
        assert.equal(body.code, 'b')
        done()
      })
  })
})
