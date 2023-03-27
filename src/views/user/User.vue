<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row :gutter="20">
				<el-col :span="8"
					><el-input placeholder="请输入内容" v-model="query" clearable> <el-button slot="append" icon="el-icon-search" @click="searchContent"></el-button> </el-input
				></el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<el-table :data="user" border stripe>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="username" label="姓名"></el-table-column>
				<el-table-column prop="email" label="邮箱"></el-table-column>
				<el-table-column prop="mobile" label="电话"></el-table-column>
				<el-table-column prop="role_name" label="角色"></el-table-column>
				<el-table-column prop="mg_state" label="状态">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="changeSwitch(scope.row.id, scope.row.mg_state)"> </el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-edit" @click="editUserInfo(scope.row)"></el-button>
						<el-button type="danger " size="mini" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
						<el-button type="warning" size="mini" icon="el-icon-setting" @click="openRoleDia(scope.row)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页器 -->
			<div class="block">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-sizes="[2, 5, 10]"
					:page-size="pagesize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				>
				</el-pagination>
			</div>
		</el-card>
		<!-- 添加用户对话框 -->
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addResetForm()">
			<el-form :model="addRuleForm" status-icon :rules="rules" ref="addRuleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户" prop="username">
					<el-input type="text" v-model="addRuleForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<!-- 防止暴露数据autocomplete="off" -->
					<el-input type="password" v-model="addRuleForm.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addRuleForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="addRuleForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="add('addRuleForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑用户对话框 -->
		<el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%">
			<el-form :model="editUser" status-icon :rules="rules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名" prop="username">
					<el-input type="text" v-model="editUser.username" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editUser.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editUser.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmEdit">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 分配角色权限 -->
		<el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="50%" @close="clearRole()">
			<span>当前的用户：{{ roleUser.username }}</span
			><br />
			<span>当前的角色：{{ roleUser.role_name }}</span>
			<br />
			分配新角色：
			<el-select v-model="roleValue" placeholder="请选择">
				<el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button @click="roleDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="putRoleInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getUserList, addUsers, changeState, editUserInfo, delUserInfo, getRoleList, putRole } from "@/api/index";
export default {
	name: "User",
	data() {
		var validateUsername = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("用户名不能为空"));
			} else {
				let reg = /^(?=(?![0-9])[A-Za-z0-9]+[._-]?[A-Za-z0-9]+).{3,20}/;
				if (reg.test(value)) {
					this.addRuleForm.username = value;
					callback();
				} else {
					callback(new Error("用户名格式错误！"));
				}
			}
		};
		var validatePassword = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入密码"));
			} else {
				// 1.密码规则：长度6-18位  字符串类型：数字 英文 特殊符号且必须包含数字及英文

				let reg = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/;
				if (reg.test(value)) {
					callback();
					this.addRuleForm.password = value;
				} else {
					callback(new Error("密码格式错误！"));
				}
			}
		};
		var validateEmail = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入email"));
			} else {
				let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
				if (reg.test(value)) {
					callback();
					this.addRuleForm.email = value;
				} else {
					callback(new Error("email格式错误！"));
				}
			}
		};
		var validateMobile = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入手机号"));
			} else {
				let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
				if (reg.test(value)) {
					callback();
					this.addRuleForm.mobile = value;
				} else {
					callback(new Error("手机格式错误！"));
				}
			}
		};
		return {
			user: [],
			pagenum: 1,
			pagesize: 2,
			//搜索框关键字
			query: "",
			//添加用户对话框关闭控制器
			addDialogVisible: false,
			editDialogVisible: false,
			roleDialogVisible: false,
			addRuleForm: {
				username: "",
				password: "",
				email: "",
				mobile: "",
			},
			editUser: {
				username: "",
				email: "",
				mobile: "",
				id: 0,
			},
			roleUser: {
				username: "",
				role_name: "",
			},
			rules: {
				username: [{ validator: validateUsername, trigger: "blur", required: true }],
				password: [{ validator: validatePassword, trigger: "blur", required: true }],
				email: [{ validator: validateEmail, trigger: "blur", required: true }],
				mobile: [{ validator: validateMobile, trigger: "blur", required: true }],
			},
			//分页器
			currentPage: 1,
			total: 0,
			//角色权限
			roleValue: "",
			roleList: [],
			roleId: "",
		};
	},
	created() {
		this.getUserList();
	},
	methods: {
		//初始化列表
		async getUserList() {
			const res = await getUserList({ query: this.query, pagenum: this.pagenum, pagesize: this.pagesize });
			if (res.meta.status == 200) {
				this.user = res.data.users;
				this.total = res.data.total;
			} else console.log("获取用户列表失败");
		},
		//关闭对话框
		handleClose(done) {
			this.$confirm("确认关闭？")
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},

		//分页器
		handleSizeChange(val) {
			this.pagesize = val;
			this.getUserList();
		},
		handleCurrentChange(val) {
			this.pagenum = val;
			this.getUserList();
		},
		//添加用户
		add(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) return;
				else {
					// console.log(this.addRuleForm);
					let res = await addUsers({ username: this.addRuleForm.username, password: this.addRuleForm.password, email: this.addRuleForm.email, mobile: this.addRuleForm.mobile });
					// console.log(res);
					if (res.meta.status == 201) {
						this.$message.success(res.meta.msg);
						this.addDialogVisible = false;
					} else {
						this.$message.error(res.meta.msg);
					}
				}
			});
		},
		//关闭对话框清空表单
		addResetForm() {
			this.$refs.addRuleForm.resetFields();
		},
		//状态栏的改变
		async changeSwitch(id, state) {
			let res = await changeState(id, state);
			if (res.meta.status == 200) this.$message.success("更新状态成功");
			else this.$message.success("更新状态失败");
		},
		//搜索框
		searchContent() {
			this.getUserList();
		},
		//编辑
		editUserInfo(info) {
			this.editDialogVisible = true;
			this.editUser.username = info.username;
			this.editUser.email = info.email;
			this.editUser.mobile = info.mobile;
			this.editUser.id = info.id;
		},
		//提交编辑
		async confirmEdit() {
			this.$refs.editRuleForm.validate(async valid => {
				if (!valid) return;
				else {
					let res = await editUserInfo(this.editUser.id, { email: this.editUser.email, mobile: this.editUser.mobile });
					if (res.meta.status == 200) {
						this.editDialogVisible = false;
						this.$message.success("编辑用户成功");
						this.getUserList();
					} else {
						this.$message.error("编辑用户失败");
					}
				}
			});
		},
		//点击删除用户
		delUser(id) {
			this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(async () => {
					let res = await delUserInfo(id);
					if (res.meta.status == 200) {
						this.$message({
							type: "success",
							message: res.meta.msg,
						});
						this.getUserList();
					} else {
						this.$message({
							type: "error",
							message: res.meta.msg,
						});
					}
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除",
					});
				});
		},
		//打开分配就是对话框
		async openRoleDia(info) {
			this.roleDialogVisible = true;
			this.roleUser.username = info.username;
			this.roleUser.role_name = info.role_name;
			this.roleId = info.id;
			let res = await getRoleList();
			if (res.meta.status == 200) {
				this.roleList = res.data;
			}
		},
		//确定更改
		async putRoleInfo() {
			if (this.roleValue == "") {
				this.$message.warning("请选择要分配的角色");
			} else {
				this.roleDialogVisible = false;
				let res = await putRole(this.roleId, { rid: this.roleValue });
				if (res.meta.status == 200) {
					this.$message.success("更改角色权限成功");
					this.getUserList();
				} else this.$message.error("更改角色权限失败");
			}
		},
		clearRole() {
			this.roleValue = "";
			this.roleList = "";
		},
	},
};
</script>

<style lang="scss" scoped></style>
