/**
 * 延迟函数，返回一个 promise
 * @param {*} duration 
 * @returns 
 */
export function delay(duration =  3000) {
  return new Promise((resolve,  reject) => {
    setTimeout(() => {
      resolve('')
    }, duration);
  })
}