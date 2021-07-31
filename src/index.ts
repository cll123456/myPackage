import { add, AsyncClass } from "./add";
import './index.css'

const res = add(1,2);
console.log(res,' 同步函数');

new AsyncClass().asyncAdd(10,20).then(res => {
  console.log(res, '------异步加的结果   ');
})

console.log(212);    