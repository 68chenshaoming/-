<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-table :data="tableData" border stripe>
				<el-table-column type="index" label="#"> </el-table-column>
				<el-table-column prop="authName" label="权限名称"> </el-table-column>
				<el-table-column prop="path" label="路径"> </el-table-column>
				<el-table-column label="权限等级">
					<template slot-scope="scope">
						<el-tag v-show="scope.row.level == 0">一级权限</el-tag>
						<el-tag type="success" v-show="scope.row.level == 1">二级权限</el-tag>
						<el-tag type="warning" v-show="scope.row.level == 2">三级权限</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
import { getRight } from "@/api/index";
export default {
	name: "Right",

	data() {
		return {
			tableData: [],
		};
	},
	created() {
		this.getRightList();
	},
	mounted() {},

	methods: {
		async getRightList() {
			let res = await getRight("list");
			this.tableData = res.data;
			// console.log(this.tableData);
		},
	},
};
</script>

<style lang="scss" scoped></style>
