import { delay } from "./utils";

/**
 * 同步加
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
export const add = (a, b) => a + b;

export class AsyncClass {
  /**
   * 异步加 
   * @param {*} a 
   * @param {*} b 
   * @returns 
   */
  async asyncAdd(a, b) {
    await delay();
    return a + b;
  }
}