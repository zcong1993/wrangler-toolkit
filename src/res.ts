import { headers2Obj } from './utils'

export class Res {
  private body: BodyInit | null = null
  private status: number = 200
  private headers: Headers = new Headers()
  private statusText?: string
  private isEnd: boolean = false
  private res: Response

  setBody(body: BodyInit | null) {
    if (this.isEnd) {
      return this
    }
    this.body = body
    return this
  }

  setStatus(status: number) {
    if (this.isEnd) {
      return this
    }
    this.status = status
    return this
  }

  setHeaders(headers: Headers) {
    if (this.isEnd) {
      return this
    }
    this.headers = headers
    return this
  }

  setHeader(key: string, val: string) {
    if (this.isEnd) {
      return this
    }
    this.headers.set(key, val)
    return this
  }

  setStatusText(statusText: string) {
    if (this.isEnd) {
      return this
    }
    this.statusText = statusText
    return this
  }

  json(body: any) {
    if (this.isEnd) {
      return this
    }
    this.body = typeof body !== 'string' ? JSON.stringify(body) : body
    this.setHeader('Content-Type', 'application/json')
    this.end()
    return this
  }

  end() {
    this.isEnd = true
    return this
  }

  setRes(res: Response) {
    if (this.isEnd) {
      return this
    }
    this.res = res
    this.end()
    return this
  }

  build(): Response {
    if (this.res) {
      return new Response(this.res.body, {
        status: this.res.status,
        headers: {
          ...this.res.headers,
          ...headers2Obj(this.headers)
        },
        statusText: this.res.statusText
      })
    }
    return new Response(this.body, {
      status: this.status,
      headers: this.headers,
      statusText: this.statusText
    })
  }
}
