<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>监控运维</el-breadcrumb-item>
			<el-breadcrumb-item>数据监控</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="DataMonitor">
			<el-divider content-position="left">数据监控</el-divider>
			<div v-if="modal==='3'">
				<div class="scrollbox" style="height: 100%; overflow-x:hidden">
					<el-scrollbar style="height: 100%; width: 100%;">
					<div class="data-monitor">
						<!-- 头一行 -->
						<div class="data-class">
							<div class="card">
								<div style="font-weight: bold">
									<div style="margin-left: 10px" class="content">接收数据量：{{datar}}</div>
								</div>
								<div></div>
							</div>
							<div class="card">
								<div style="font-weight: bold">
									<div style="margin-left: 10px" class="content">发送数据量：{{datas}}</div>
								</div>
								<div></div>
							</div>
							<div class="card">
								<div style="font-weight: bold">
									<div style="margin-left: 10px" class="content">丢弃数据量：{{datad}}</div>
								</div>
								<div></div>
							</div>
						</div>
						<!-- 第二行 -->
						<div class="otherdata-class">
							<div class="number-board">
								<div class="othercard">
									<div style="display: flex; align-items: center; justify-content: space-between">
										<div style="font-size: 14px; font-weight: bold; margin-left: 10px;">
											客户端数量：{{cdata}}</div>
										<i class="el-icon-s-platform" style="font-size: 40px; color: #409eff"></i>
									</div>
									<div></div>
								</div>
								<div class="othercard">
									<div style="display: flex; align-items: center; justify-content: space-between">
										<div style="font-size: 14px; font-weight: bold; margin-left: 10px;">
											会话数量：{{sedata}}</div>
										<i class="el-icon-message" style="font-size: 40px; color: #409eff"></i>
									</div>
									<div></div>
								</div>
								<div class="othercard">
									<div style="display: flex; align-items: center; justify-content: space-between">
										<div style="font-size: 14px; font-weight: bold; margin-left: 10px;">
											主题数量：{{tdata}}</div>
										<i class="el-icon-s-open" style="font-size: 40px; color: #409eff"></i>
									</div>
									<div></div>
								</div>
								<div class="othercard">
									<div style="display: flex; align-items: center; justify-content: space-between">
										<div style="font-size: 14px; font-weight: bold; margin-left: 10px;">
											订阅数量：{{sudata}}</div>
										<i class="el-icon-collection-tag" style="font-size: 40px; color: #409eff"></i>
									</div>
									<div></div>
								</div>
							</div>

							<!-- 客户端列表 -->
							<div class="Client">
								<!-- <br><div style="padding-left: 2px;font-size: 18px;">客户端列表</div><br> -->
								<el-divider content-position="left">客户端列表</el-divider>
								<el-table :data="clientList" stripe style="width: 1053px" border>
									<el-table-column type="index" label="#" width="50"></el-table-column>
									<el-table-column prop="clientid" label="客户端标识" width="200px"></el-table-column>
									<el-table-column prop="username" label="用户名" width="200px"></el-table-column>
									<el-table-column prop="ip_address" label="IP" width="200px"></el-table-column>
									<el-table-column prop="created_at" label="创建时间" width="200px"></el-table-column>
									<el-table-column prop="" label="清除会话" width="200px">
										<template slot-scope = "scope">
											<el-tooltip class="item" effect="dark" content="点击按钮清除会话" placement="top-start" :enterable="false" >
												<el-button type="danger" icon="el-icon-delete" size="small" @click="Cleaning(scope.row)">
												</el-button>								
											</el-tooltip>
										</template>
									</el-table-column>
								</el-table>
								<!-- 分页区域 -->
								<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
									:current-page="pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="pagesize"
									layout="total, sizes, prev, pager, next, jumper" :total="cdata">
								</el-pagination>
							</div>
						</div>
					</div>
					</el-scrollbar>
				</div>
			</div>
			<div v-if="modal!=='3'">
				<h2 style="margin-left: 20px;">此页面为系统管理员专属</h2>
			</div>
		</div>
	</div>
</template>

<script>
	import Cookies from 'js-cookie';
	import axios from 'axios';

	export default {
		name: 'DataMonitor',
		data() {
			return { //第一栏数据
				datar: '',
				datas: '',
				datad: '',
				//第二栏数据
				cdata: '',
				tdata: '',
				sedata: '',
				sudata: '',

				userID: '',
				companyID: '',
				token: '',
				modal: '',
				clientList: [],
				pagenum: '1',
				pagesize: '2',
				tclientid: ''
			}
		},
		created() {
			this.token = Cookies.get("token");
			this.userID = Cookies.get("user_id");
			this.companyID = Cookies.get("company_id");
			this.modal = Cookies.get("modal");
			if (this.modal === '3') {
				this.fetchData1();
				this.fetchData2();
				this.fetchData3();
			}
		},
		methods: {
			handleSizeChange(newSize){//监听pagesize改变的事件
				console.log(newSize);
				this.pagesize = newSize;
				this.fetchData3();
			},
			handleCurrentChange(newPage){//监听页码值改变的事件
				console.log(newPage);
				this.pagenum = newPage;
				this.fetchData3();
			},
			fetchData1() {
				var that = this;
				axios.get(
						"https://site.maple.today/IOTplatform/ServerMain", {
							params: {
								requestCode: '029',
								user_id: that.userID,
								token: that.token
							}
						})
					.then(function(response) {
						console.log(response.data);
						that.datas = response.data.data.data[0]["metrics"]["packets.publish.sent"];
						that.datar = response.data.data.data[0]["metrics"]["packets.publish.received"];
						that.datad = response.data.data.data[0]["metrics"]["packets.publish.dropped"];
						// console.log(response.data.data.data[0]["metrics"]["packets.publish.sent"]);
						// console.log(response.data.data.data[0].metrics["packets.publish.sent"]);
					})
					.catch(function(error) {
						console.log(error);
					})
			},
			fetchData2() {
				var that = this;
				axios.get(
						"https://site.maple.today/IOTplatform/ServerMain", {
							params: {
								requestCode: '031',
								user_id: that.userID,
								token: that.token
							}
						})
					.then(function(response) {
						console.log(response.data);
						that.cdata = response.data.data.data[0]["stats"]["connections.count"];
						that.tdata = response.data.data.data[0]["stats"]["topics.count"];
						that.sedata = response.data.data.data[0]["stats"]["sessions.count"];
						that.sudata = response.data.data.data[0]["stats"]["subscriptions.count"];
					})
					.catch(function(error) {
						console.log(error);
					})
			},
			fetchData3() {
				var that = this;
				axios.get(
						"https://site.maple.today/IOTplatform/ServerMain", {
							params: {
								requestCode: '030',
								user_id: that.userID,
								token: that.token,
								page: that.pagenum,
								page_con: that.pagesize
							}
						})
					.then(function(response) {
						console.log(response.data.data.data);
						that.clientList = response.data.data.data;
					})
					.catch(function(error) {
						console.log(error);
					})
			},
			Cleaning(e){
				var that = this;
				console.log(e.clientid);
				that.tclientid = e.clientid;
				axios.get(
						"https://site.maple.today/IOTplatform/ServerMain", {
							params: {
								requestCode: '032',
								user_id: that.userID,
								token: that.token,
								client_id: that.tclientid
							}
						})
					.then(function(response) {
						console.log(response.data);
						alert("已清除会话。");
					})
					.catch(function(error) {
						console.log(error);
					})
			}
		}
	}
</script>

<style scoped>
.DataMonitor {
	width: 100%;
	height: 96%;
	background-color: #FFFFFF;
/* 	border: black;
	border-width: 1px;
	border-style: solid; */
}
.scrollbox {
	width: 100%;
	height: 100%;
}
.data-monitor {
	width: 98%;
	height: 100%;
	margin-right: 1%;
	margin-left: 1%;
	margin-top: 20px;
}
.data-class {
	/* height: 100px; */
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
	align-items: center;
	background: white;
}
.content {
	width: 280px;
	height: 65px;
	background-color: #aaffff;
	text-align: center;
	line-height: 60px;
	margin-top: 6px;
	color: #333333;
	border-radius: 5px;
}
.card {
	width: 300px;
	height: 80px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	margin-top: 10px;
	box-shadow: 0 0 5px 0 #000000;
	border-radius: 8px;
	background: linear-gradient(135deg, rgb(1, 255, 234), rgb(255, 255, 255), rgb(0, 247, 255));
	animation: color 3s linear infinite;
}
/* .card:hover{
box-shadow: 0 0 10px 0 #000000;
} 鼠标悬浮时边缘阴影变大*/
@keyframes color {
	to {
		filter: hue-rotate(60deg);
	}
}
.otherdata-class {
	width: 100%;
	height: 600px;
	background: white;
	margin-top: 20px;
}
.number-board {
	width: 100%;
	/* height: 110px; */
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	flex-wrap: wrap;
	align-items: center;
}
.othercard {
	height: 80px;
	width: 250px;
	border: 1px solid rgb(116, 186, 204);
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	padding-left: 5px;
	padding-right: 5px;
	margin-left: 10px;
	margin-right: 10px;
	border-width: 2px;
	margin-top: 10px;
}

.Client {
	width: 100%;
	height: 490px;
	padding-left: 20px;
}
.el-pagination{
	margin-top: 15px;
}
.el-table{
	border-width: 3px;
}
.el-table-column{
	border-width: 2px;
}
</style>
