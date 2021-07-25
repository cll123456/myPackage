import { delay } from "./utils";

/**
 * 同步加
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
export const add = (a:number, b:number) => a + b;

export class AsyncClass {
  /**
   * 异步加 
   * @param {*} a 
   * @param {*} b 
   * @returns 
   */
  async asyncAdd(a:number, b:number) {
    await delay();
    return a + b;
  }
}