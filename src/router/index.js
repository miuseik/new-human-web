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
        path: '/demo',
        name: 'demo',
        component: () => import(/* webpackChunkName: "about" */ '../views/test/demo.vue')
    },
    {
        path: '/three',
        name: 'three',
        component: () => import(/* webpackChunkName: "about" */ '../views/test/three.vue')
    },
    {
        path: '/bone',
        name: 'bone',
        component: () => import(/* webpackChunkName: "about" */ '../views/test/bone.vue')
    },
    {
        path: '/guo',
        name: 'guo',
        component: () => import(/* webpackChunkName: "about" */ '../views/test/guo.vue')
    },
    {
        path: '/three_tpl',
        name: 'threeTpl',
        component: () => import(/* webpackChunkName: "about" */ '../views/test/threeTpl.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "about" */ '../views/home/index.vue')
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
