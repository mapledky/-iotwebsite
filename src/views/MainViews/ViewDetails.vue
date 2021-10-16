<template>
	<div>
		<!-- 面包屑导航区域 --><!-- 记得登录！！！！ -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
		  <el-breadcrumb-item>首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{name:'DataInformation'}">数据概览</el-breadcrumb-item>
		  <el-breadcrumb-item>网关概览详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="ViewDetails">
			<el-divider content-position="left">网关概览详情</el-divider>
			<div class="panel-body" style="height: 90%; overflow-x:hidden">
			<!-- 系统管理员卡片视图区域 -->
			<el-card v-if="modal==='3'">
				<!-- 总工厂列表 -->
				<el-table  @row-click="GetCompany" :data="companyList" stripe style="width: 981px" border title="点击获取该公司网关列表">
					<el-table-column type="index" label="#" width="280px"></el-table-column>
					<el-table-column prop="company_name" label="公司名称" width="700px" >
					</el-table-column>
				</el-table>
				<!-- 某工厂网关概览列表 -->
				<el-table v-if="gatewayList.length > 0" @row-click="GetChart" :data="gatewayList" stripe style="width: 981px" border title="点击获取该网关的时序设备数据">  
					<el-table-column type="index" label="#" width="60px"></el-table-column>
				    <el-table-column prop="device_name" label="设备名称" width="200px"></el-table-column>
				    <el-table-column prop="device_id" label="设备id" width="200px"></el-table-column>
					<el-table-column prop="dismiss" label="设备状态" width="200px"></el-table-column>
					<el-table-column prop="company" label="设备工厂" width="200px"></el-table-column>
					<el-table-column label="注册网关" width="120px">
						<template slot-scope = "scope">
							<el-tooltip class="item" effect="dark" content="未注册网关可点击此按钮注册" placement="top-start" :enterable="false">
								<el-button type="primary" icon="el-icon-edit" size="small" @click="Register(scope.row)"
								v-if="scope.row.dismiss==='待注册'">
								</el-button>								
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<div id="EchartsView" style="width: 800px; height:300px; padding-left: 80px; margin-top: 50px;"></div>
			</el-card>
			<!-- 工厂管理员卡片视图区域 -->
			<el-card v-if="modal==='2'">
				<el-button style="margin-left: 10px; margin-bottom: 10px; float:right; margin-right: 55px;" @click="dialogVisible = true">
					添加网关
				</el-button>
				<el-dialog title="添加网关" :visible.sync="dialogVisible" width="3" append-to-body>
					<!-- 主体区域 -->
					<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
						<el-form-item label="网关名称" prop="device_name">
							<el-input v-model="addForm.device_name"></el-input>
						</el-form-item>
					</el-form>
					<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
						<el-form-item label="网关密码" prop="password">
							<el-input v-model="addForm.password"></el-input>
						</el-form-item>
					</el-form>
					
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="dialogVisible=false;Adding()">确 定</el-button>
					</span>
				</el-dialog>
				<!-- 某工厂网关概览列表 -->
				<el-table @row-click="GetChart" :data="gatewayList" stripe style="width: 981px" border title="点击获取该网关的时序设备数据">  
					<el-table-column type="index" label="#" width="80px"></el-table-column>
				    <el-table-column prop="device_name" label="设备名称" width="225px"></el-table-column>
				    <el-table-column prop="device_id" label="设备id" width="225px"></el-table-column>
					<el-table-column prop="dismiss" label="设备状态" width="225px"></el-table-column>
					<el-table-column prop="company" label="设备工厂" width="225px"></el-table-column>
				</el-table>
				<div id="EchartsView" style="width: 800px; height:300px; padding-left: 80px; margin-top: 50px;"></div>
			</el-card>
			<!-- 工厂用户卡片视图区域 -->
			<el-card v-if="modal==='1'">
				<!-- 某工厂网关概览列表 -->
				<el-table @row-click="GetChart" :data="gatewayList" stripe style="width: 981px" border title="点击获取该网关的时序设备数据">  
					<el-table-column type="index" label="#" width="80px"></el-table-column>
				    <el-table-column prop="device_name" label="设备名称" width="225px"></el-table-column>
				    <el-table-column prop="device_id" label="设备id" width="225px"></el-table-column>
					<el-table-column prop="dismiss" label="设备状态" width="225px"></el-table-column>
					<el-table-column prop="company" label="设备工厂" width="225px"></el-table-column>
				</el-table>
				<div id="EchartsView" style="width: 800px; height:300px; padding-left: 80px; margin-top: 50px;"></div>
			</el-card>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie' ;
import sha256 from 'js-sha256';
import * as echarts from 'echarts';
export default{
	name: 'ViewDetails',
	data() {
		return {
			//获取用户列表的参数对象
			gatewayList: [],
			companyList: [],
			dataList: [],
			deviceidList: [],
			datanumList: [],
			deviceID: '',
			userID: '',
			token: '',
			companyID: '',
			modal: '',
			deviceid: '',
			tag: '0',
			companyID1: '',	//系统管理员注册网关所用
			dialogVisible: false,
			//添加用户的表单数据
			addForm: {
				device_name: '',
				password: ''
			},
			//添加表单的验证规则对象
			addFormRules: {
				device_name: [{
					required: true,
					message: '请输入网关名称',
					trigger: 'blur'}, { 
					min: 1, 
					max: 40, 
					message: '网关名称的长度在1~40个字符区间', 
					trigger: 'blur'}],
				password: [{
					required: true,
					message: '请输入网关密码',
					trigger: 'blur'}, { 
					min: 1, 
					max: 10, 
					message: '网关密码的长度在1~10个字符区间', 
					trigger: 'blur'
				}]
			}
			// addFormRef: {}
		}
	},
	created(){
		this.token = Cookies.get("token");
		this.userID = Cookies.get("user_id");
		this.modal = Cookies.get("modal");
		this.companyID = Cookies.get("company_id");
		if(this.modal === '3'){
			this.fetchCData();//获取工厂列表
		}else{
			this.fetchGData();//获取某工厂的设备列表
		}
		// this.fetchGData();
	},
	methods:{
		GetChart(e){
			var that = this;
			that.deviceID = e.device_id;
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '028',
						user_id: that.userID,
						company_id: that.companyID,
						token: that.token
					}
				})
				.then(function(response){
					console.log(response.data);
					that.dataList = response.data.data;
					for(var i = 0 ; i < that.dataList.length; i++){
						if(that.dataList[i].net_id === that.deviceID){
							that.deviceidList.push(that.dataList[i].device_id);
							that.datanumList.push(that.dataList[i].dataNumber);
							that.tag = '1';
						}
					}
					if(that.tag === '0'){
						// that.deviceidList.splice(0,that.deviceidList.length);
						// that.datanumList.splice(0,that.datanumList.length);
						that.deviceidList = [];
						that.datanumList = [];
						alert("该网关下没有设备");
					}else{
						let myChart = that.$echarts.init(document.getElementById("EchartsView"));
						// 指定图表的配置项和数据
						let option = {
							title: {
								text: "最近24小时"
							},
							tooltip: {},
							legend: {
									data: ["数据量"]
								},
							xAxis: {
								name: '设备id',
								data: that.deviceidList
							},
							yAxis: {
								
							},
							series: [{
								name: "数据量",
								type: "bar",
								data: that.datanumList
							}]
						};
						// 使用刚指定的配置项和数据显示图表。
						myChart.setOption(option);
						that.tag = '0';
						that.Gotohere();
					}
				})
				.catch(function(error){
					console.log(error);
				})
		},
		Gotohere(){
			this.$el
			    .querySelector("#EchartsView")
			    .scrollIntoView({ block: "start", behavior: "smooth" });
		},
		fetchCData(){
			var that = this;
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '011',
						user_id: that.userID,
						token: that.token
					}
				})
				.then(function(response){
					console.log(response.data);
					that.companyList = response.data.data;
				})
				.catch(function(error){
					console.log(error);
				})
		},
		fetchGData(){
			//post请求传递三个参数
			//请求地址、传递的参数 在请求体中传递、配置信息
			var that = this;
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '003',
						user_id: that.userID,
						company_id: that.companyID,
						token: that.token
					}
				})
				.then(function(response){
					console.log(response.data);
					that.gatewayList = response.data.data;
					that.ChangeDismiss();
				})
				.catch(function(error){
					console.log(error);
				})
		},
		ChangeDismiss(){
			var that = this;
			for(var i = 0; i < that.gatewayList.length; i++)
			{
				if(that.gatewayList[i].dismiss === '1'){
					that.gatewayList[i].dismiss = '离线';
				}
				else if(that.gatewayList[i].dismiss === '2'){
					that.gatewayList[i].dismiss = '在线';
				}
				else{
					that.gatewayList[i].dismiss = '待注册';
				}
			}
		},
		GetCompany(event){
			// console.log(event);
			var that = this;
			that.companyID = event.company_id;
			// console.log(that.companyID);
			that.fetchGData();
		},
		Register(event)
		{
			var that = this;
			that.deviceid = event.device_id;
			that.companyID1 = event.company;

			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '009',
						user_id: that.userID,
						company_id: that.companyID1,
						token: that.token,
						device_id: that.deviceid
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
			alert("已成功注册！请刷新页面。");

		},
		handleClose(done) {
		        this.$confirm('确认关闭？')
		          .then(_ => {
		            done();
		          })
		          .catch(_ => {});
		},
		Adding(){
			let that = this
			//console.log(that.addForm.password)
			let sha256 = require("js-sha256").sha256 //这里用的是require方法，所以没用import
			var sha256password = sha256(that.addForm.password) //要加密的密码
			//console.log(sha256password)//这就是你加密之后的密码
			axios.get(
				"https://site.maple.today/IOTplatform/ServerMain",
				{
					params:{
						requestCode: '008',
						user_id: that.userID,
						company_id: that.companyID,
						token: that.token,
						device_name: that.addForm.device_name,
						password: sha256password
					}
				})
				.then(function(response){
					console.log(response.data);
				})
				.catch(function(error){
					console.log(error);
				})
		}
	}
}	
</script>

<style scoped>
.ViewDetails{/* 原workspack */
	width: 100%;
	height: 96%;
/* 	background-color: antiquewhite;
	border: black;
	border-width: 1px;
	border-style: solid; */
}
.el-card{
	width: 96%;
	margin-top: 20px;
	margin-left: 20px;
}
.el-table{
	margin-top: 15px;
}
</style>