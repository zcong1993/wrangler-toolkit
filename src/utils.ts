export const headers2Obj = (mp: Headers): { [key: string]: string } => {
  const res: { [key: string]: string } = {}
  for (const [k, v] of mp.entries()) {
    res[k] = v
  }
  return res
}
