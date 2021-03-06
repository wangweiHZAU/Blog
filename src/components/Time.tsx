export function NumToStr(num: number) {
  const date = new Date(num)
  const Y = date.getFullYear() + '-'
  const M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  const D = date.getDate() + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()
  return Y + M + D
}

export function StrToNum(str: string) {
  const date = new Date(str)
  return date.getTime()
}
