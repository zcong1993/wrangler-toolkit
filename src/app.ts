import { IncomingMessage } from 'http'
import {
  router,
  get,
  post,
  patch,
  put,
  options,
  del,
  head,
  AugmentedRequestHandler,
  ServerRequest,
  ServerResponse
} from 'microrouter'
import { Res } from './res'

export type RequestHandler = (req: IncomingMessage, res: ServerResponse) => any

type Middleware = (handler: AugmentedRequestHandler) => AugmentedRequestHandler

export const defaultHandler: AugmentedRequestHandler = async (req, res) => {
  const r = (res as any) as Res
  r.setStatus(404)
  r.end()
}

export class App {
  private middlewares: Middleware[] = []
  private routes: RequestHandler[] = []
  private defaultRoutes: RequestHandler[] = []
  private handler: RequestHandler

  use(mw: Middleware) {
    if (typeof mw !== 'function') {
      throw new Error('middleware should be a function')
    }
    this.middlewares.push(mw)
    return this
  }

  get(path: string, handler: AugmentedRequestHandler) {
    this.routes.push(get(path, handler))
    return this
  }

  post(path: string, handler: AugmentedRequestHandler) {
    this.routes.push(post(path, handler))
    return this
  }

  patch(path: string, handler: AugmentedRequestHandler) {
    this.routes.push(patch(path, handler))
    return this
  }

  del(path: string, handler: AugmentedRequestHandler) {
    this.routes.push(del(path, handler))
    return this
  }

  options(path: string, handler: AugmentedRequestHandler) {
    this.routes.push(options(path, handler))
    return this
  }

  head(path: string, handler: AugmentedRequestHandler) {
    this.routes.push(head(path, handler))
    return this
  }

  put(path: string, handler: AugmentedRequestHandler) {
    this.routes.push(put(path, handler))
    return this
  }

  setDefaultHandler(handler: AugmentedRequestHandler = defaultHandler) {
    // already setted
    if (this.defaultRoutes.length > 0) {
      return this
    }
    this.defaultRoutes = [
      get('/*', handler),
      post('/*', handler),
      put('/*', handler),
      del('/*', handler),
      head('/*', handler),
      options('/*', handler),
      patch('/*', handler)
    ]
    return this
  }

  async handleRequest(request: Request) {
    const res = new Res()
    await this.build()(
      (request as any) as IncomingMessage,
      (res as any) as ServerResponse
    )
    return res.build()
  }

  private build() {
    if (this.handler) {
      return this.handler
    }
    this.handler = this.wrapper(router(...this.routes, ...this.defaultRoutes))
    return this.handler
  }

  private wrapper(handler: AugmentedRequestHandler): RequestHandler {
    let h = handler
    return async (req: ServerRequest, res: ServerResponse) => {
      for (let i = this.middlewares.length - 1; i >= 0; i -= 1) {
        h = this.middlewares[i](h)
      }
      return h(req, res)
    }
  }
}
