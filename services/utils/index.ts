export const cookieParse = (cookie?: string): { [key: string]: string } => {
  if (!cookie) return {}
  let result: any = {}
  const split = cookie.split('; ')
  split.forEach((str) => {
    const parse = str.split('=')
    result[parse[0]] = parse[1]
  })
  return result
}
