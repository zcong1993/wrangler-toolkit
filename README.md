# wrangler-toolkit

[![NPM version](https://img.shields.io/npm/v/@zcong/wrangler-toolkit.svg?style=flat)](https://npmjs.com/package/@zcong/wrangler-toolkit) [![NPM downloads](https://img.shields.io/npm/dm/@zcong/wrangler-toolkit.svg?style=flat)](https://npmjs.com/package/@zcong/wrangler-toolkit) [![CircleCI](https://circleci.com/gh/zcong1993/wrangler-toolkit/tree/master.svg?style=shield)](https://circleci.com/gh/zcong1993/wrangler-toolkit/tree/master) [![codecov](https://codecov.io/gh/zcong1993/wrangler-toolkit/branch/master/graph/badge.svg)](https://codecov.io/gh/zcong1993/wrangler-toolkit)

> toolkit for [cloudflare/wrangler](https://github.com/cloudflare/wrangler)

## Why ?

### Before

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return new Response('Hello worker!', { status: 200 })
}
```

### After

```js
const { App } = require('@zcong/wrangler-toolkit')

// support middleware
const middleware = handler => async (req, res) => {
  console.log('middleware 1')
  return handler(req, res)
}

// global error handler middleware
const errorMiddleware = handler => async (req, res) => {
  try {
    await handler(req, res)
  } catch (err) {
    console.log(err)
    res.status = 500
    res.json({
      message: err.message
    })
  }
}

// router handler
const indexHandler = async (req, res) => {
  res.json({
    data: 'hello world!'
  })
}

const postHandler = async (req, res) => {
  const body = await req.json()
  res.json(body)
}

const app = new App()
const r = app
  .setDefaultHandler() // set default handler, if all router not match, default is 404 response
  .use(middleware) // use middleware
  .use(errorMiddleware) // use global error middleware
  .get('/', indexHandler) // add router, support get, post...
  .post('/', postHandler) // post router
  .get('/err', () => {
    throw new Error('err test')
  }) // global error handler test

addEventListener('fetch', event => {
  // use r.handleRequest
  event.respondWith(r.handleRequest(event.request))
})
```

more complex example is here [wrangler-pipe](https://github.com/zcong1993/wrangler-pipe)

## License

MIT &copy; zcong1993
