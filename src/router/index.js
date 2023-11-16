import { createRouter, createWebHistory } from "vue-router";


let routes= [
    {
        path: '/',
        name: 'index',
        component: () => import(/* webpackChunkName: "about" */ '../views/modelView/index.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import(/* webpackChunkName: "about" */ '../views/test/index.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "about" */ '../views/home/index.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "about" */ '../views/login/login.vue')
    },
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
