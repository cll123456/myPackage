import { add, AsyncClass } from "./add";
import { reduce } from "./reduce";
import './index.css';

const arr1 = ['a', 'b', 'c'];
const arr2 = [4, 5, 6];

const result = [...arr1, ...arr2];


console.log(result);
const a = 1, b = 2;

const res = add(a, b);

const d = reduce(a, b);
console.log(res);

new AsyncClass().asyncAdd(10, 20).then(res => {
  console.log(res, '异步加结果')
 })
