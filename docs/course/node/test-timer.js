let i = 0;
console.time('timer');
function test() {
  i++;
  if (i === 10000) {
    console.timeEnd('timer');
  } else {
    setTimeout(test, 0); // timer: 11.787s
    // setImmediate(test); // timer: 143.624ms
  }
}
test();