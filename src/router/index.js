import {createRouter, createWebHistory} from "vue-router";


let routes = [
    {
        path: '/',
        name: 'index',
        component: () => import( '../views/modelView/index.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/test/index.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import( '../views/home/index.vue')
    },
    {
        path: '/login',
        component: () => import('../views/login/login.vue'),
        hidden: false
    },
    {
        path: '/reg',
        name: 'reg',
        component: () => import('../views/login/reg.vue'),
        hidden: false
    },
    {
        path: '/retrieve',
        name: 'retrieve',
        component: () => import('../views/login/retrieve.vue'),
        hidden: false
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
