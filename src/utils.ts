export const mergeHeaders = (h1: Headers, h2: Headers): Headers => {
  const res = new Headers()
  for (const [key, val] of h1.entries()) {
    res.set(key, val)
  }
  for (const [key, val] of h2.entries()) {
    res.set(key, val)
  }
  return h1
}
