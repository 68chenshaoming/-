<template>
	<el-container>
		<el-header><h1 class="animate__animated animate__fadeInLeft">后台管理系统</h1></el-header>
		<el-container>
			<el-aside width="object-content">
				<el-row class="tac">
					<el-col :span="12">
						<el-menu default-active="2" class="el-menu-vertical-demo" background-color="unset" unique-opened>
							<el-submenu index="1">
								<template slot="title">
									<i class="el-icon-s-check"></i>
									<span>用户管理</span>
								</template>
								<el-menu-item-group>
									<el-menu-item index="1-1" @click="() => this.$router.push('/user')">用户列表</el-menu-item>
								</el-menu-item-group>
							</el-submenu>
							<el-submenu index="2">
								<template slot="title">
									<i class="el-icon-lock"></i>
									<span>权限管理</span>
								</template>
								<el-menu-item-group>
									<el-menu-item index="2-1" @click="() => this.$router.push('/role')">角色列表</el-menu-item>
									<el-menu-item index="2-2" @click="() => this.$router.push('/right')">权限列表</el-menu-item>
								</el-menu-item-group>
							</el-submenu>
							<el-submenu index="3">
								<template slot="title">
									<i class="el-icon-suitcase-1"></i>
									<span>商品管理</span>
								</template>
								<el-menu-item-group>
									<el-menu-item index="3-1" @click="() => this.$router.push('/goods')">商品列表</el-menu-item>
									<el-menu-item index="3-2" @click="() => this.$router.push('/params')">分类参数</el-menu-item>
									<el-menu-item index="3-3" @click="() => this.$router.push('/categories')">商品分类</el-menu-item>
								</el-menu-item-group>
							</el-submenu>
							<el-submenu index="4">
								<template slot="title">
									<i class="el-icon-notebook-2"></i>
									<span>订单管理</span>
								</template>
								<el-menu-item-group>
									<el-menu-item index="4-1">订单管列表</el-menu-item>
								</el-menu-item-group>
							</el-submenu>
						</el-menu>
					</el-col>
				</el-row>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	name: "Home",

	data() {
		return {};
	},

	mounted() {},
};
</script>

<style lang="scss" scoped>
.el-header {
	background-color: #b3c0d1;
	color: #333;
	text-align: center;
	line-height: 60px;
}

.el-aside {
	background-color: #d3dce6;
	color: #333;
	text-align: center;
	height: calc(100vh - 60px);
}

.el-main {
	background-color: #e9eef3;
	color: #333;
}

.el-menu {
	border: none !important;
}

.el-col-12 {
	width: 100% !important;
}
</style>
