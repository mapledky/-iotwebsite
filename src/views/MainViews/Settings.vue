<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
		  <el-breadcrumb-item>首页</el-breadcrumb-item>
		  <el-breadcrumb-item>设置</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="Settings">
			<!-- 普通用户 -->
				<el-divider content-position="left">设置</el-divider>
			<el-card>
				<el-button style="margin-left: 10px; margin-bottom: 10px;" @click="dialogVisible = true">
					修改StreamSets密码
				</el-button>
				<el-dialog title="修改StreamSets密码" :visible.sync="dialogVisible" width="3" append-to-body>
					<!-- 主体区域 -->
					<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
						<el-form-item label="新密码" prop="password">
							<el-input v-model="addForm.password"></el-input>
						</el-form-item>
					</el-form>
					
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="dialogVisible=false;Changepassword()">确 定</el-button>
					</span>
				</el-dialog>				
				<br>
				<el-button style="margin-left: 10px; margin-bottom: 10px; margin-top: 10px;" @click="gotolink8">
					修改用户密码
				</el-button>								
				<br>
				<el-button style="margin-left: 10px; margin-bottom: 10px; margin-top: 10px;" @click="dialogVisible1 = true">
					修改用户名
				</el-button>
				<el-dialog title="修改用户名" :visible.sync="dialogVisible1" width="3" append-to-body>
					<!-- 主体区域 -->
					<el-form :model="addForm1" :rules="addFormRules1" ref="addFormRef1" label-width="100px">
						<el-form-item label="新用户名" prop="username">
							<el-input v-model="addForm1.username"></el-input>
						</el-form-item>
					</el-form>
					
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible1 = false">取 消</el-button>
						<el-button type="primary" @click="dialogVisible1=false;Changeusername()">确 定</el-button>
					</span>
				</el-dialog>		
				
				<br>
				<el-button style="margin-top: 10px; margin-bottom: 10px; margin-left: 10px;" @click="gotolink6">
					退出登录
				</el-button>
			</el-card>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import Cookies from 'js-cookie' ;
	
export default{
	name: 'Settings',
	data() {
		return {
			token: '',
			userID: '',
			modal: '',
			companyID: '',
			dialogVisible: false,
			dialogVisible1: false,
			//添加用户的表单数据
			addForm: {
				password: ''
			},
			//添加表单的验证规则对象
			addFormRules: {
				password: [{
					required: true,
					message: '请输入新的StreamSets密码',
					trigger: 'blur'}, { 
					min: 6, 
					max: 18, 
					message: 'StreamSets密码的长度在6~18个字符区间', 
					trigger: 'blur'
				}]
			},
			addForm1: {
				username: ''
			},
			addFormRules1: {
				username: [{
					required: true,
					message: '请输入新的用户名',
					trigger: 'blur'}, { 
					min: 1, 
					max: 40, 
					message: '用户名的长度在1~40个字符区间', 
					trigger: 'blur'
				}]
			}
		}
	},
	created(){
		this.token = Cookies.get("token");
		this.userID = Cookies.get("user_id");
		this.modal = Cookies.get("modal");
		this.companyID = Cookies.get("company_id");
	},
	methods:{
		Changeusername(){
			var that = this
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '033',
						user_id: that.userID,
						token: that.token,
						username: that.addForm1.username
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
		},
		Changepassword(){
			var that = this
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '023',
						user_id: that.userID,
						token: that.token,
						password: that.addForm.password
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
		},
		gotolink6(){
			Cookies.remove('token');
			Cookies.remove('user_id');
			Cookies.remove('modal');
			Cookies.remove('company_id');
			this.$router.push({name: "Loading"})
		},
		gotolink8(){
			alert("即将进行页面跳转\n请前往登陆页面进行密码修改。")
			Cookies.remove('token');
			Cookies.remove('user_id');
			Cookies.remove('modal');
			Cookies.remove('company_id');
			this.$router.push({name: "Loading"})
		}
	}
}	
</script>

<style scoped>
.Settings{/* 原workspack */
	width: 100%;
	height: 96%;
	/* background-color: antiquewhite;
	border: black;
	border-width: 1px;
	border-style: solid; */
}
.el-card{
	margin-top: 20px;
	margin-left: 20px;
	margin-right: 20px;
}
</style>

