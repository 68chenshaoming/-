<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row :gutter="20">
				<el-col :span="8"
					><el-input placeholder="请输入内容" v-model="query" clearable> <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button> </el-input
				></el-col>
				<el-col :span="4">
					<el-button type="primary" @click="() => this.$router.push('/goods/add')">添加商品</el-button>
				</el-col>
			</el-row>
			<el-table :data="tableData" border stripe>
				<el-table-column type="index" label="#"> </el-table-column>
				<el-table-column prop="goods_name" label="商品名称" width="800"> </el-table-column>
				<el-table-column prop="goods_price" label="商品价格"> </el-table-column>
				<el-table-column prop="goods_number" label="商品数量"> </el-table-column>
				<el-table-column label="创建时间">
					<template slot-scope="scope">
						{{ scope.row.add_time | getTime }}
					</template></el-table-column
				>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[5, 10, 20, 50]"
				:page-size="pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
import { getGoodsList } from "@/api/index";
export default {
	name: "Goods",

	data() {
		return {
			tableData: [],
			query: "",
			pagenum: 1,
			pagesize: 10,
			total: 0,
			currentPage: 1,
		};
	},
	created() {
		this.getGoodsList();
	},

	methods: {
		async getGoodsList() {
			let res = await getGoodsList({ query: this.query, pagenum: this.pagenum, pagesize: this.pagesize });
			// console.log(res);
			this.tableData = res.data.goods;
			this.total = res.data.total;
		},
		//分页器
		handleSizeChange(val) {
			this.pagesize = val;
			this.getGoodsList();
		},
		handleCurrentChange(val) {
			this.pagenum = val;
			this.getGoodsList();
		},
		//搜索框
		searchGoods() {
			if (this.query == "") this.$message.warning("查询类容不能为空");
			else {
				this.getGoodsList();
			}
		},
	},
	filters: {
		getTime(time) {
			let time1 = new Date(time * 1000);
			let year = time1.getFullYear();
			let month = time1.getMonth() + 1;
			month = month < 10 ? "0" + month : month;
			let date = time1.getDate();
			date = date < 10 ? "0" + date : date;
			let time2 = time1.toLocaleTimeString();
			return `${year}-${month}-${date} ${time2}`;
		},
	},
};
</script>

<style lang="scss" scoped></style>
