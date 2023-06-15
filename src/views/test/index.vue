<template>
  <div>counter:{{counter}}</div>
  <div>doubleCount:{{doubleCount}}</div>
  <button @click="main.randomizeCounter()">counter(round)</button>
  <button type="primary" @click="main.increment()">counter++</button>

  <div>{{name}}</div>
  <button @click="amend()">修改</button>
  <button @click="request()">request</button>
</template>
<script setup lang='ts' name="test">

//引入想要的pinia文件 {} 里面就是对应导出的名字
// import { useMain } from '@/store/home/index.ts'
// import { storeToRefs } from 'pinia';

import API from "@/api";
// const main = useMain()
// 解构main里面的state和getters的数据，
// 使用storeToRefs解构才有响应式，响应式可以直接修改数据，不过这我只用来渲染
// const { counter,name ,doubleCount } = storeToRefs(main)

//（常用方法三种）
//常用方法一： 使用数据
// console.log( counter );
//使用方法(方法目前不能解构)
const request = ()=>{
  API.login.login('').then(()=>{

  })
}



// 常用方法二：修改数据
// counter = 9999

//常用方法三：
//进阶使用$patch，多个修改
// const amend=()=>{
//   main.$patch((state) => {
//     state.counter += 10;
//     state.name = '张三'
//   })
// }

</script>
