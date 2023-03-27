import VueRouter from "vue-router";
import Vue from "vue";
Vue.use(VueRouter);
const routes = [
	{
		path: "/",
		redirect: "/login",
		component: () => import("@/views/Login.vue"),
	},
	{
		path: "/login",
		component: () => import("@/views/Login.vue"),
	},
	{
		path: "/home",
		component: () => import("@/views/Home.vue"),
		children: [
			{
				path: "/user",
				component: () => import("@/views/user/User.vue"),
			},
			{
				path: "/role",
				component: () => import("@/views/power/Role.vue"),
			},
			{
				path: "/right",
				component: () => import("@/views/power/Right.vue"),
			},
			{
				path: "/goods",
				component: () => import("@/views/goods/Goods.vue"),
			},
			{
				path: "/goods/add",
				component: () => import("@/views/goods/Add.vue"),
			},
			{
				path: "/params",
				component: () => import("@/views/goods/Params.vue"),
			},
		],
	},
];

//路由重复点击会报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err);
};
const router = new VueRouter({
	mode: "history",
	routes,
});
router.beforeEach((to, from, next) => {
	if (to.path === "/login") return next();
	const token = window.sessionStorage.getItem("token");
	if (!token) return next("/login");
	next();
});
export default router;
