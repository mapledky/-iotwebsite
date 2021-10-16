<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
		  <el-breadcrumb-item>首页</el-breadcrumb-item>
		  <el-breadcrumb-item>个人详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="PersonnalDetails">
			<el-divider content-position="left">个人详情</el-divider>
			<div class="panel-body" style="height: 90%; overflow-x:hidden">
			<!-- 普通用户 -->
			<el-card v-if="modal==='1'">
				<div style="margin-left: 10px;">
					<h4>用户id：{{userID}}</h4>
					<h4>所在工厂：{{companyID}}</h4>
				</div>
				<el-button style="margin-left: 10px; margin-bottom: 10px; float:left; margin-right: 55px;" @click="dialogVisible = true">
					申请加入工厂
				</el-button>
				<el-dialog title="申请加入工厂" :visible.sync="dialogVisible" width="3" append-to-body>
					<!-- 主体区域 -->
					<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
						<el-form-item label="工厂id" prop="factory_id">
							<el-input v-model="addForm.factory_id"></el-input>
						</el-form-item>
					</el-form>
					
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="dialogVisible=false;Applying()">确 定</el-button>
					</span>
				</el-dialog>
			</el-card>
			
			<!-- 工厂管理员用户 -->
			<el-card v-if="modal==='2'">
				<div style="margin-left: 10px;">
					<h4>用户id：{{userID}}</h4>
					<h4>所在工厂：{{companyID}}</h4>
					<h4>申请人员列表：</h4>
				</div>
				<el-button stripe style="width: 200px" border @click="fetchData1" title="点击获取申请人员列表">
					申请列表
				</el-button>
				<el-button stripe style="width: 200px" border @click="fetchData2" title="点击获取工厂用户列表">
					用户列表
				</el-button>
				<el-table v-if="requestList.length > 0" :data="requestList" stripe style="width: 981px" border>
					<el-table-column type="index" label="#" width="80px"></el-table-column>
					<el-table-column prop="company_id" label="工厂id" width="225px"></el-table-column>
					<el-table-column prop="user_id" label="用户id" width="225px"></el-table-column>
					<el-table-column prop="dismiss" label="状态" width="225px"></el-table-column>
					<el-table-column prop="" label="处理申请" width="225px">
						<template slot-scope = "scope">
							<el-tooltip class="item" effect="dark" content="申请中的用户点此按钮同意" placement="top-start" :enterable="false">
								<el-button type="success" icon="el-icon-check" size="small" @click="Register1(scope.row)" v-if="scope.row.dismiss === '申请中'">
								</el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="申请中的用户点此按钮拒绝" placement="top-start" :enterable="false">
								<el-button type="danger" icon="el-icon-delete" size="small" @click="Register2(scope.row)" v-if="scope.row.dismiss === '申请中'">
								</el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
		
				<el-table v-if="personList.length > 0" :data="personList" stripe style="width: 981px" border>
					<el-table-column type="index" label="#" width="50px"></el-table-column>
					<el-table-column prop="company" label="工厂id" width="75px"></el-table-column>
					<el-table-column prop="user_id" label="用户id" width="100px"></el-table-column>
					<el-table-column prop="username" label="用户名" width="100px"></el-table-column>
					<el-table-column prop="modal" label="权限" width="100px"></el-table-column>
					<el-table-column prop="email" label="邮箱" width="100px"></el-table-column>
					<el-table-column prop="phoneNumber" label="电话号码" width="150px"></el-table-column>
					<el-table-column prop="otherplat" label="其它平台" width="100px"></el-table-column>
					<el-table-column prop="dismiss" label="状态" width="75px"></el-table-column>
					<el-table-column prop="" label="操作处理" width="130px">
						<template slot-scope = "scope">
							<el-tooltip class="item" effect="dark" content="点此按钮删除工厂用户" placement="top-start" :enterable="false">
								<el-button type="danger" icon="el-icon-delete" size="small" @click="Register4(scope.row)"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="点此按钮升级用户权限" placement="top-start" :enterable="false">
								<el-button type="success" icon="el-icon-check" size="small" @click="Register3(scope.row)" v-if="scope.row.modal !== '工厂管理员'">
								</el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			
			<!-- 系统管理员 -->
			<el-card v-if="modal==='3'">
				<div style="margin-left: 10px;">
					<h4>系统管理员</h4>
				</div>
				<el-button stripe style="width: 200px" border @click="fetchData3" title="点击获取所有用户列表">
					用户列表
				</el-button>
				
				<el-table v-if="allperList.length > 0" :data="allperList" stripe style="width: 981px" border>
					<el-table-column type="index" label="#" width="50px"></el-table-column>
					<el-table-column prop="company" label="工厂id" width="70px"></el-table-column>
					<el-table-column prop="user_id" label="用户id" width="100px"></el-table-column>
					<el-table-column prop="username" label="用户名" width="100px"></el-table-column>
					<el-table-column prop="modal" label="权限" width="75px"></el-table-column>
					<el-table-column prop="email" label="邮箱" width="100px"></el-table-column>
					<el-table-column prop="phoneNumber" label="电话号码" width="150px"></el-table-column>
					<el-table-column prop="otherplat" label="其它平台" width="80px"></el-table-column>
					<el-table-column prop="dismiss" label="状态" width="75px"></el-table-column>
					<el-table-column prop="" label="操作处理" width="180px">
						<template slot-scope = "scope">
							<el-tooltip class="item" effect="dark" content="点击此按钮升级用户为系统管理员" placement="top-start" :enterable="false">
								<el-button type="success" icon="el-icon-check" size="small" @click="Register5(scope.row)" v-if="scope.row.modal !== '系统管理员'">
								</el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="点击此按钮升级用户为工厂管理员" placement="top-start" :enterable="false">
								<el-button type="warning" icon="el-icon-check" size="small" @click="Register3(scope.row)" 
								v-if="scope.row.company !== '0' && scope.row.modal === '普通用户'">
								</el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="点击此按钮初始化用户" placement="top-start" :enterable="false">
								<el-button type="danger" icon="el-icon-delete" size="small" @click="Register4(scope.row)" 
								v-if="scope.row.company !== '0'"></el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import Cookies from 'js-cookie' ;
	
export default{
	name: 'PersonnalDetails',
	data() {
		return {
			token: '',
			userID: '',
			modal: '',
			companyID: '',
			requestList: [],
			personList: [],
			allreqList: [],
			allperList: [],
			requestID: '',
			companyID1: '',
			tuserID: '',
			dialogVisible: false,
			//添加用户的表单数据
			addForm: {
				factory_id: ''
			},
			//添加表单的验证规则对象
			addFormRules: {
				factory_id: [{
					required: true,
					message: '请输入请求加入的工厂id',
					trigger: 'blur'}, { 
					min: 1, 
					max: 11, 
					message: '工厂id的长度在1~11个字符区间', 
					trigger: 'blur'}]
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
		fetchData1(){
			var that = this
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '014',
						user_id: that.userID,
						token: that.token,
						company_id: that.companyID
					}
				})
				.then(function(response){
					console.log(response.data);
					that.requestList = response.data.data;
					that.ChangeDismiss1();
				})
				.catch(function(error){
					console.log(error);
				})
		},
		ChangeDismiss1(){
			var that = this;
			for(var i = 0; i < that.requestList.length; i++)
			{
				if(that.requestList[i].dismiss === '0'){
					that.requestList[i].dismiss = '申请失败';
				}
				else if(that.requestList[i].dismiss === '1'){
					that.requestList[i].dismiss = '申请中';
				}
				else{
					that.requestList[i].dismiss = '通过';
				}
			}
		},
		Applying(){
			var that = this
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '013',
						user_id: that.userID,
						token: that.token,
						company_id: that.addForm.factory_id
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
		},
		Register1(event){
			var that = this;
			console.log(event);
			that.requestID = event.request_id;
			that.companyID1 = event.company_id;
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '015',
						user_id: that.userID,
						company_id: that.companyID1,
						token: that.token,
						type: '1',
						request_id: that.requestID
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
			alert("已通过申请！请刷新页面。");
		},
		Register2(event){
			var that = this;
			console.log(event);
			that.requestID = event.request_id;
			that.companyID1 = event.company_id;
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '015',
						user_id: that.userID,
						company_id: that.companyID1,
						token: that.token,
						type: '0',
						request_id: that.requestID
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
			alert("已拒绝申请！请刷新页面。");
		},
		fetchData2(){
			var that = this
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '016',
						user_id: that.userID,
						token: that.token,
						company_id: that.companyID
					}
				})
				.then(function(response){
					console.log(response.data);
					that.personList = response.data.data;
					that.ChangeDismiss2();
				})
				.catch(function(error){
					console.log(error);
				})
		},
		ChangeDismiss2(){
			var that = this;
			for(var i = 0; i < that.personList.length; i++)
			{
				that.personList[i].dismiss = '通过';
				if(that.personList[i].modal === '1'){
					that.personList[i].modal = '普通用户';
				}
				else if(that.personList[i].modal === '2'){
					that.personList[i].modal = '工厂管理员';
				}
			}
		},
		Register3(event){
			var that = this;
			console.log(event);
			that.tuserID = event.user_id;
			that.companyID1 = event.company;
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '017',
						user_id: that.userID,
						company_id: that.companyID1,
						token: that.token,
						type: '1',
						target_user_id: that.tuserID
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
			alert("已升级权限！请刷新页面。");
		},
		Register4(event){
			var that = this;
			console.log(event);
			that.tuserID = event.user_id;
			
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '018',
						user_id: that.userID,
						company_id: that.companyID,
						token: that.token,
						target_user_id: that.tuserID
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
			alert("已删除该用户！请刷新页面。");
		},
		fetchData3(){
			var that = this
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '022',
						user_id: that.userID,
						token: that.token
					}
				})
				.then(function(response){
					console.log(response.data);
					that.allperList = response.data.data;
					that.ChangeDismiss3();
				})
				.catch(function(error){
					console.log(error);
				})
		},
		ChangeDismiss3(){
			var that = this;
			for(var i = 0; i < that.allperList.length; i++)
			{
				that.allperList[i].dismiss = '通过';
				if(that.allperList[i].modal === '1'){
					that.allperList[i].modal = '普通用户';
				}
				else if(that.allperList[i].modal === '2'){
					that.allperList[i].modal = '工厂管理员';
				}else{
					that.allperList[i].modal = '系统管理员';
				}
			}
		},
		Register5(event){
			var that = this;
			console.log(event);
			that.tuserID = event.user_id;
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '017',
						user_id: that.userID,
						company_id: that.companyID,
						token: that.token,
						type: '2',
						target_user_id: that.tuserID
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
			alert("已升级权限！请刷新页面。");
		}
	}
}	
</script>

<style scoped>
.PersonnalDetails{/* 原workspack */
	width: 100%;
	height: 96%;
	background-color: #FFFFFF;
/* 	border: black;
	border-width: 1px;
	border-style: solid; */
}
.el-card{
	margin-top: 20px;
	margin-left: 20px;
	margin-right: 20px;
}
.el-table{
	margin-top: 20px;
}
</style>
