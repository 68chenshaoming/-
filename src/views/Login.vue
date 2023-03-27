<template>
	<div class="login_box">
		<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="40px" class="demo-ruleForm login-form">
			<el-form-item label="账号" prop="username" class="form-item">
				<el-input type="text" v-model="ruleForm.username" autocomplete="off" placeholder="请输入账号"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" class="form-item">
				<el-input type="password" v-model="ruleForm.password" autocomplete="off" show-password placeholder="请输入密码"></el-input>
			</el-form-item>
			<el-form-item class="form-item">
				<el-button type="primary" @click="submitForm('ruleForm')" class="btn-submit">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { login } from "@/api/index";
export default {
	name: "login",

	data() {
		var username = (rule, value, callback) => {
			//用户名正则，4到16位（字母，数字，下划线，减号）
			let reg = /^[a-zA-Z0-9_-]{4,16}$/;

			if (value === "") {
				callback(new Error("账号不能为空"));
			} else if (!reg.test(value)) {
				callback(new Error("账号格式不正确"));
			} else {
				this.username = value;
				callback();
			}
		};
		var password = (rule, value, callback) => {
			//密码智能有英文和数字组成
			let reg = /^[a-z0-9]+$/i;
			if (value === "") {
				callback(new Error("密码不能为空"));
			} else if (!reg.test(value)) {
				callback(new Error("密码格式不正确"));
			} else {
				this.password = value;
				callback();
			}
		};
		return {
			ruleForm: {
				username: "",
				password: "",
			},
			rules: {
				username: [{ validator: username, trigger: "blur" }],
				password: [
					{ validator: password, trigger: "blur" },
					{ min: 6, max: 18, message: "长度在 6 到 18个字符", trigger: "blur" },
				],
			},
		};
	},

	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					let res = await login({ username: this.username, password: this.password });
					if (res.meta.status == 200) {
						this.$message.success("登录成功");
						//存token
						window.sessionStorage.setItem("token", res.data.token);
						this.$router.push("/home");
						this.$refs.ruleForm.resetFields();
					} else {
						this.$message.error("登录失败");
						this.$refs.ruleForm.resetFields();
					}
				} else {
					this.$message.error("登录失败");
					this.$refs.ruleForm.resetFields();
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
	},
};
</script>

<style lang="scss" scoped>
.login_box {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-image: linear-gradient(135deg, #bbd2c5, #536976);
	.login-form {
		width: 600px;
		height: 400px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		padding: 70px 0;
		color: black;
		.form-item {
			width: 70%;
			text-align: center;
			.btn-submit {
				width: 80%;
				color: black;
			}
		}
	}
}
</style>
