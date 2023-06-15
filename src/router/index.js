import { createRouter, createWebHistory } from "vue-router";


let routes= [
    {
        path: '/',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '../views/index/index.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import(/* webpackChunkName: "about" */ '../views/test/index.vue')
    },
    {
        path: '/serialPort',
        name: 'serialPort',
        component: () => import(/* webpackChunkName: "about" */ '../views/serialPort/index.vue')
    }
    //{
    //配置404页面
    //path: '/:catchAll(.*)',
    //name: '404',
    //component: () => import(''),
    //}
]
// 路由
const router = createRouter({
    history: createWebHistory(),
    routes
})
// 导出
export default router
