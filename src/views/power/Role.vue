<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
			<el-table :data="roleList" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : 'bdbottom', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag>
									{{ item1.authName }}
								</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 渲染二 三级权限 -->
							<el-col :span="19">
								<el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag type="success">{{ item2.authName }}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>

									<el-col :span="18">
										<el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
											{{ item3.authName }}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>

				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="roleName" label="角色名称"></el-table-column>
				<el-table-column prop="roleDesc" label="角色描述"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-edit" @click="editUserInfo(scope.row)">编辑</el-button>
						<el-button type="danger " size="mini" icon="el-icon-delete" @click="delRole(scope.row.id)">删除</el-button>
						<el-button type="warning" size="mini" icon="el-icon-setting" @click="openRoleDia(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 添加用户对话框 -->
		<el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addResetForm()">
			<el-form :model="addRoleForm" status-icon :rules="rules" ref="addRoleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="角色名称" prop="roleName">
					<el-input type="text" v-model="addRoleForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述">
					<el-input type="password" v-model="addRoleForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRole()">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑用户对话框 -->
		<el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%">
			<el-form :model="editRole" status-icon :rules="rules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户角色" prop="roleName">
					<el-input type="text" v-model="editRole.roleName"></el-input>
				</el-form-item>
				<el-form-item label="用户描述">
					<el-input v-model="editRole.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmEdit">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 权限设置对话框 -->
		<el-dialog title="分配角色权限" :visible.sync="powerDialogVisible" width="50%">
			<!-- 树形控件 -->
			<el-tree :data="powerList" show-checkbox default-expand-all node-key="id" :default-checked-keys="keys" ref="tree" highlight-current :props="defaultProps"> </el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="powerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="allotRights">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getRoleList, addRole, delRole, editRole, delRoleById, getRight, getRightById } from "@/api/index";
export default {
	name: "Role",

	data() {
		return {
			roleList: [],
			addRoleForm: {
				roleName: "",
				roleDesc: "",
			},
			editRole: {
				roleName: "",
				roleDesc: "",
				id: "",
			},
			rules: {
				roleName: [{ trigger: "blur", required: true, msg: "角色名称不能为空" }],
			},
			//添加用户对话框关闭控制器
			addDialogVisible: false,
			editDialogVisible: false,
			powerDialogVisible: false,
			//树形控件
			roleId: "",
			powerList: [],
			keys: [],
			defaultProps: {
				label: "authName",
				children: "children",
			},
		};
	},

	created() {
		this.getRole();
	},

	methods: {
		//初始化角色列表
		async getRole() {
			let res = await getRoleList();
			if (res.meta.status == 200) this.roleList = res.data;
		},
		//添加用户
		async addRole() {
			this.$refs.addRoleForm.validate(async valid => {
				if (!valid) return;
				let res = await addRole({ roleName: this.addRoleForm.roleName, roleDesc: this.addRoleForm.roleDesc });
				console.log(res);
				if (res.meta.status == 201) {
					this.$message.success(res.meta.msg);
					this.getRole();
					this.addDialogVisible = false;
				} else {
					this.$message.error(res.meta.msg);
				}
			});
		},
		//关闭对话框清空表单
		addResetForm() {
			this.$refs.addRoleForm.resetFields();
		},
		//编辑
		editUserInfo(info) {
			this.editDialogVisible = true;
			this.editRole.roleName = info.roleName;
			this.editRole.roleDesc = info.roleDesc;
			this.editRole.id = info.id;
		},
		//提交编辑
		async confirmEdit() {
			this.$refs.editRuleForm.validate(async valid => {
				if (!valid) return;
				else {
					let res = await editRole(this.editRole.id, { roleName: this.editRole.roleName, roleDesc: this.editRole.roleDesc });
					if (res.meta.status == 200) {
						this.editDialogVisible = false;
						this.$message.success("编辑用户成功");
						this.getRole();
					} else {
						this.$message.error("编辑用户失败");
					}
				}
			});
		},
		//点击删除用户
		delRole(id) {
			this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(async () => {
					let res = await delRole(id);
					if (res.meta.status == 200) {
						this.$message({
							type: "success",
							message: res.meta.msg,
						});
						this.getRole();
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
		//打开权限对话框
		async openRoleDia(role) {
			this.roleId = role.id;
			this.powerDialogVisible = true;
			let res = await getRight("tree");
			if (res.meta.status == 200) {
				this.powerList = res.data;
			} else {
				this.$message.error("获取权限列表失败");
			}
			// 递归获取三级节点id
			this.getLeafKey(role, this.keys);
		},
		//通过递归的形式,获取角色下所有的三级权限的id
		getLeafKey(node, arr) {
			if (!node.children) {
				return arr.push(node.id);
			}
			node.children.forEach(item => {
				this.getLeafKey(item, arr);
			});
		},
		//点击为角色分配权限
		async allotRights() {
			const keys = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()];
			const idStr = keys.join(",");
			const res = await getRightById(this.roleId, { rids: idStr });
			console.log(res);
			if (res.meta.status !== 200) {
				return this.$message.error("分配权限失败");
			}
			this.$message.success("分配权限成功");
			this.getRole();
			this.powerDialogVisible = false;
		},

		// 根据id删除对应的权限
		async removeRightById(role, rightId) {
			// 弹框提示
			this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(async () => {
					let res = await delRoleById(role.id, rightId);

					if (res.meta.status == 200) {
						this.$message({
							type: "success",
							message: res.meta.msg,
						});
						this.getRole();
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
	},
};
</script>

<style lang="scss" scoped>
.el-tag {
	margin: 7px;
}
.bdtop {
	border-top: 1px solid #eee;
}
.bdbottom {
	border-bottom: 1px solid #eee;
}
.vcenter {
	display: flex;
	align-items: center;
}
</style>
