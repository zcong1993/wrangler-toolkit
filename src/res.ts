export class Res {
  private body: BodyInit | null = null
  private status: number = 200
  private headers: Headers = new Headers()
  private statusText?: string

  setBody(body: BodyInit | null) {
    this.body = body
    return this
  }

  setStatus(status: number) {
    this.status = status
    return this
  }

  setHeaders(headers: Headers) {
    this.headers = headers
    return this
  }

  setHeader(key: string, val: string) {
    this.headers.set(key, val)
    return this
  }

  setStatusText(statusText: string) {
    this.statusText = statusText
    return this
  }

  build(): Response {
    return new Response(this.body, {
      status: this.status,
      headers: this.headers,
      statusText: this.statusText
    })
  }
}
