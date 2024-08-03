import express from 'express'
import type http from 'http'

import { init } from '../index'
import { _support } from '../src/utils/global'

const port = 7889
let server: http.Server

describe('err', () => {
  beforeAll(() => {
    init({
      dsn: 'http://unit-test.com',
      appName: 'unit-test',
      error: true,
      recordScreen: false,
      performance: {
        core: false,
        server: true,
      },
    })

    const app = express()
    app.all('*', function (_, req, next) {
      req.header('Access-Control-Allow-Origin', '*')
      req.header('Access-Control-Allow-Headers', 'Content-Type')
      req.header('Access-Control-Allow-Methods', '*')
      req.header('Content-Type', 'application/json;charset=utf-8')
      next()
    })
    app.post('/setList', (req, res) => {
      res.send({
        code: 200,
        meaage: '设置成功',
      })
    })
    server && server.close()
    server = app.listen(port)
  })

  afterAll(() => {
    server.close()
  })

  function proxyEmit() {
    const testResult: any = { info: [], spy: vi.fn() }
    _support.sendData.emit = (e: any) => {
      testResult.spy()
      testResult.info.push(e)
    }
    return testResult
  }

  function sendRequest(url: string, type: 'xhr' | 'fetch' = 'xhr') {
    const body = { username: 'example', password: '123456' }
    return type === 'xhr'
      ? new Promise(resolve => {
          const xhr = new XMLHttpRequest()
          xhr.open('post', url)
          xhr.setRequestHeader('content-type', 'application/json')
          xhr.send(JSON.stringify(body))
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              resolve(xhr.responseText)
            }
          }
        })
      : fetch(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })
  }

  it('xhr error should be captured correctly', async () => {
    const testResult = proxyEmit()
    await sendRequest(`http://localhost:${port}/invalid-url`)
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.info).toMatchObject([
      {
        errMessage: 'Not Found',
        eventId: 'server',
        eventType: 'error',
        params: '{"username":"example","password":"123456"}',
        recordscreen: null,
        requestMethod: 'post',
        requestType: 'xhr',
        responseStatus: 404,
      },
    ])
  })

  it('xhr performance should be captured correctly', async () => {
    const testResult = proxyEmit()
    await sendRequest(`http://localhost:${port}/setList`)
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.info).toMatchObject([
      {
        eventId: 'server',
        eventType: 'performance',
        params: '{"username":"example","password":"123456"}',
        requestMethod: 'post',
        requestType: 'xhr',
        responseStatus: 200,
      },
    ])
  })

  it('fetch error should be captured correctly', async () => {
    const testResult = proxyEmit()
    await sendRequest(`http://localhost:${port}/invalid-url`, 'fetch')
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.info).toMatchObject([
      {
        errMessage: 'Not Found',
        eventId: 'server',
        eventType: 'error',
        params: '{"username":"example","password":"123456"}',
        recordscreen: null,
        requestMethod: 'post',
        requestType: 'fetch',
        responseStatus: 404,
      },
    ])
  })

  it('fetch performance should be captured correctly', async () => {
    const testResult = proxyEmit()
    await sendRequest(`http://localhost:${port}/setList`, 'fetch')
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.info).toMatchObject([
      {
        eventId: 'server',
        eventType: 'performance',
        params: '{"username":"example","password":"123456"}',
        requestMethod: 'post',
        requestType: 'fetch',
        responseStatus: 200,
      },
    ])
  })
})
