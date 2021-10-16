<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
		  <el-breadcrumb-item>首页</el-breadcrumb-item>
		  <el-breadcrumb-item>数据概览</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="DataInformation">
			<el-divider content-position="left">数据概览</el-divider>
			<div class="panel-body" style="height: 100%; overflow-x:hidden;width: 100%;">
			<div class="Gateway">
				<!-- <div><br>网关概览 <a href="http://www.baidu.com" class="r1">查看详情</a> </div> -->
				<div class="littleTitle">
					<el-divider content-position="left" style="width: 50%;">网管概览</el-divider>
                    <el-button class="informationButton" @click="gotolink">查看详情</el-button>
					<!-- <a @click="gotolink" class="r1" style="color: #3A33D1; cursor:pointer;">查看详情</a> -->
					</div>
				<!-- <br><hr align=left width=95% color=#dddddd SIZE=1/><br> -->
				<div class="wrap1">
					<div class="rectangle1" >
						<!-- <img src="../../assets/off-line.png" width="30%" height="80%"> -->
						<img src="../../assets/off-line.png" style="width: 50px;height: 50px;">
						<div class="text1">
							{{data1}}<br>离线网关
						</div>
					</div>
					<div class="rectangle2">
						<!-- <img src="../../assets/on-line.png" width="30%" height="80%"> -->
						<img src="../../assets/on-line.png" style="width: 50px;height: 50px;">
						<div class="text2">
							{{data2}}<br>在线网关
						</div>
					</div>
					<div class="rectangle3">
						<!-- <img src="../../assets/unregistered.png" width="30%" height="80%"> -->
						<img src="../../assets/unregistered.png" style="width: 50px;height: 50px;">
						<div class="text3">
							{{data3}}<br>待注册网关
						</div>
					</div>
					<div class="rectangle4">
						<!-- <img src="../../assets/total.png" width="30%" height="80%"> -->
						<img src="../../assets/total.png" style="width: 50px;height: 50px;">
						<div class="text4">
							{{datatotal1}}<br>总计网关
						</div>
					</div>
				</div>
			</div>
			
			<div class="Platform">
				<div class="littleTitle">
					<el-divider content-position="left">平台概览</el-divider>
					  <el-button class="informationButton" @click="gotolink2">查看详情</el-button>
					<!-- <a @click="gotolink2" class="r1" style="color: #3A33D1; cursor:pointer;">查看详情</a>  -->
					</div>
				<!-- <br><hr align=left width=95% color=#dddddd SIZE=1/><br> -->
				<div class="wrap2">
					<div class="rectangle5">
						<!-- <img src="../../assets/running.png" width="30%" height="80%"> -->
						<img src="../../assets/running.png" style="width: 50px;height: 50px;">
						<div class="text5">
							{{data4}}<br>运行数据流
						</div>
					</div>
					<div class="rectangle6">
						<!-- <img src="../../assets/unrunning.png" height="80%"> -->
						<img src="../../assets/unrunning.png" style="width: 50px;height: 50px;">
						<div class="text6">
							{{data5}}<br>未运行数据流
						</div>
					</div>
					<div class="rectangle7">
						<!-- <img src="../../assets/alert.png" height="80%"> -->
						<img src="../../assets/alert.png" style="width: 50px;height: 50px;">
						<div class="text7">
							{{data6}}<br>报警数据流
						</div>
					</div>
					<div class="rectangle8">
						<!-- <img src="../../assets/total2.png" height="80%"> -->
						<img src="../../assets/total2.png" style="width: 50px;height: 50px;">
						<div class="text8">
							{{datatotal2}}<br>总计数据流
						</div>
					</div>
				</div>
			</div>
			
			<div class="DataShow">
				<div class="littleTitle">
					<el-divider content-position="left">平台数据量分析</el-divider>
					</div>
				<!-- <br>平台数据量分析<br><br> -->
				<!-- <hr align=left width=95% color=#dddddd SIZE=1/><br> -->
				<div id="EchartsView" style="width: 800px; height:300px; padding-left: 0px;"></div>
			</div>
			
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import * as echarts from 'echarts';
	export default {
		name: "DataInformation",
		data() {
			return{//网关数据
				data1: '',
				data2: '',
				data3: '',
				datatotal1: '',
				//平台数据
				data4: '',
				data5: '',
				data6: '',
				datatotal2: '',
				
				activeName: 'first',
				gatewayList: [],
				companyList: [],
				dataList: [],
				deviceidList: [],
				datanumList: [],
				userID: '',
				token: '',
				companyID: '',
				modal: ''
			};
		},
		created(){
			this.token = Cookies.get("token");
			this.userID = Cookies.get("user_id");
			this.companyID = Cookies.get("company_id");
			this.modal = Cookies.get("modal");
			this.fetchGData();
		},
		mounted(){
			this.drawLine();
		},
		methods: {
			//组件的方法
			drawLine(){
				var that = this;
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
							that.deviceidList.push(that.dataList[i].device_id);
							that.datanumList.push(that.dataList[i].dataNumber);
						}
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
						that.getGData();
					})
					.catch(function(error){
						console.log(error);
					})
			},
			gotolink(){//跳转至查看详情
				this.$router.push({name: "ViewDetails"})
			},
			gotolink2(){
				this.$router.push({name: "ViewDetails2"})
			},
			handleClick(tab, event) {
				console.log(tab, event);
			},
			getGData(){
				var that = this, count1 = 0, count2 = 0, count3 = 0;
				if(that.modal !== '3')
				{
					for(var i = 0; i < that.gatewayList.length; i++)
					{
						if(that.gatewayList[i].dismiss === '1'){
							count1++;
						}
						else if(that.gatewayList[i].dismiss === '2'){
							count2++;
						}
						else{
							count3++;
						}
					}
					that.data1 = count1;
					that.data2 = count2;
					that.data3 = count3;
					that.datatotal1 = that.gatewayList.length;
				}else{
					// that.data1 = '999';
					// that.data2 = '999';
					// that.data3 = '999';
					// that.datatotal1 = '999';
				}
			}
			
		}
	}
</script>

<style>
	.littleTitle{
	/* background-color: #97CAFF; */
	display: flex;
	flex-direction: row;
	align-items: center;
	}
	.informationButton{
		position: relative;
		top: 0px;
		right: 10px;
		height: 40px;
	}
	.DataInformation{/* 原workspack */
		width: 100%;
		height: 96%;
		background-color: #FFFFFF;
	/* 	border: black;
		border-width: 1px;
		border-style: solid; */
	}
	.Gateway,.Platform{
		width: 93%;
		/* height: 40%; */
		/* border: 1px solid #FFFFFF; */
	    background-color: #ffffff;
	    padding-left: 50px;
	}
	.DataShow{
		width: 93%;
		height: 65%;
		/* border: 20px solid antiquewhite; */
		/* border: 20px solid #FFFFFF; */
		background-color: #ffffff;
		padding-left: 50px;
	}
	.r2{
		float: right;
		width: 18%;
	}
	.r1{
		float: right;
		width: 15%;
	}
	.wrap1,.wrap2{
		width: 95%;
		height: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		/* background-color: #747474; */
	}
	.rectangle1,.rectangle2,.rectangle3,.rectangle4,.rectangle5,.rectangle6,.rectangle7,.rectangle8{
		/* flex:1; */
	    width: 250px;
	    height: 100px;
	    border:solid 2px #DDDDDD;
		border-width: 2px;
		border-radius: 4px;
		margin-left: 10px;
		margin-top: 10px;
		padding-left: 20px;
		padding-top: 15px;
		display: flex;
		flex-direction: row;
		
	/* background-color: #747474; */
	}
	.text1,.text2,.text3,.text4,.text5,.text6,.text7,.text8{
		/* flex: 1; */
		margin-top: 10px;
		text-align: center;
		font-size: 20px;
		height: 5%;
		/* width: 200px; */
		color: #9DA0A4;
	}
</style>
