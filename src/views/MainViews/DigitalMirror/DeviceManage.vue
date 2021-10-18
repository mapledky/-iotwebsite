<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>数字镜像</el-breadcrumb-item>
			<el-breadcrumb-item>设备管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="deviceManage">
			<!-- 原workspack -->

			<el-divider content-position="left">设备列表</el-divider>
			<el-button type="primary" icon="el-icon-circle-plus-outline" circle v-on:click="goToAdd(1)"
				class="plusButton" v-if="this.companyID !== null && (this.userType === '3' || this.userType === '2' )">
			</el-button>
			<el-select v-model="companyID" placeholder="请选择工厂" v-if="this.userType === '3'">
				<el-option v-for="(item,index) in Componies" :key="index" :label="item.company_name"
					:value="item.company_id">
				</el-option>
			</el-select>
			<!-- <div v-if="this.userType !== '3'" style="font-size: 20px;">{{this.companyID}}号工厂</div> -->
			<el-button style="margin-left: 10px;" v-on:click="goToAdd(2)" v-if="this.userType === '3'">添加工厂</el-button>
			<el-empty description="请选择工厂" style="width: 100%;height: 80%;" v-if="this.companyID === null"></el-empty>
			<div style="width: 100%;height: 85%;" ref="scroll" v-if="this.companyID !== null">
				<el-empty description="该工厂还没有设备,点击上方加号添加" v-if="this.cards === undefined || this.cards.length ===0">
				</el-empty>
				<el-scrollbar style="height: 100%; width: 100%;" v-if="this.cards !== undefined ">
					<div class="cardBox">
						<el-card class="box-card" v-for="(item, index) in cards" :key="index">
							<div slot="header" class="clearfix">
								<!-- <el-radio v-model="radio"></el-radio> -->
								<span style="font-size: 20px;">{{item.sensor_name}}</span>
								<el-button style="float: right;margin-left: 10px;" type="danger"
									icon="el-icon-circle-close" circle v-on:click="deleteRow(index, cards)"
									size="small"></el-button>
								<el-button style="float: right;" type="success" icon="el-icon-info" circle
									v-on:click="goToInfor(index)" size="small"></el-button>
							</div>
							<!-- <el-image style="width: 100%; height: 50%" :src="item.url" fit="fit"></el-image> -->
							<!-- <el-collapse>
								<el-collapse-item title="描述" name="1">
									<div>createTime : {{item.create_time}}</div>
								</el-collapse-item>
							</el-collapse> -->
						</el-card>
					</div>
					<!-- <div class="pagination" style="height: 10%;" v-if="this.cards.length !== 0">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
							:page-size="100" layout="prev, pager, next" :total="300" small>
						</el-pagination>
					</div> -->
				</el-scrollbar>
			</div>


		</div>
	</div>
</template>
<script>
	import Cookies from 'js-cookie'

	export default {
		data() {
			return {
				height: document.documentElement.clientHeight,
				userID: 'user_2',
				token: '1628765771204',
				companyID: '',
				type3ID: null,
				userType: 3,
				cards: [],
				Componies: [],
			}
		},

		created() {
			console.log(this.userID + " " + Cookies.get("token") + " ")
			// console.log(Cookies.get('user_id'))
			var that = this
			this.userType = Cookies.get('modal')
			console.log("检测到用户type为" + this.userType)
			
			if (this.userType !== '3') {
				this.companyID = Cookies.get('company_id')
				// this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
				// 		params: {
				// 			requestCode: '007',
				// 			user_id: Cookies.get('user_id'),
				// 			company_id: Cookies.get('company_id'),
				// 			token: Cookies.get('token')
				// 		}
				// 	})
				// 	.then(function(response) {
				// 		// console.log(response.data.data)
				// 		that.cards = response.data.data
				// 		// console.log(that.Componies)
				// 	})
				// 	.catch(function(error) {
				// 		console.log(error)
				// 	})
			} else {
				this.companyID = null
				this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
						params: {
							requestCode: '011',
							user_id: Cookies.get('user_id'),
							token: Cookies.get('token')
						}
					})
					.then(function(response) {
						console.log(response)
						that.Componies = response.data.data
					})
					.catch(function(error) {
						console.log(error)
					})
			}


		},
		mounted() {

		},
		methods: {
			goToDevices(id) {
				if (id !== null) {
					// console.log(id)
					// console.log(this.Componies[id].device.length)
				}
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			goToInfor(index) {
				console.log(this.cards[index])
				var cardInfor = {
					// companyName: this.Componies[this.cards[index].company_id - 1].company_name,
					createTime: this.cards[index].create_time,
					productID: this.cards[index].product_id,
					sensorName: this.cards[index].sensor_name,
				}
				var that = this
				this.$router.push({
					name: 'DeviceInformation',
					params: {
						card: cardInfor,
						companyID: that.companyID
					}
				})
			},
			goToAdd(id) {
				console.log("添加" + id)
				if (id === 2) {
					this.$router.push({
						name: 'AddCompony',
						params:{
							whichFrom : 2
						}
					})
				} else {
					this.$router.push({
						name: 'AddDevice',
						params: {
							// componyName: this.Componies[this.companyID - 1].company_name,
							companyID: this.companyID
						}
					})
				}
			},
			deleteRow(index, rows) {
				console.log(this.cards[index])
				if (this.userType === "1") {
					this.$message({
						message: '权限不够，无法操作',
						type: 'warning'
					});
				} else {
					

					var deleteCard = this.cards[index]
					var that = this
					this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
							params: {
								requestCode: '012',
								user_id: Cookies.get('user_id'),
								company_id: this.companyID,
								token: Cookies.get('token'),
								device_id : deleteCard.sensor_id,
							}
						})
						.then(function(response) {
							console.log(response)
							if (response.data.result === "1"){
								that.$message({
									message: '删除成功',
									type: 'success'
								});
								rows.splice(index, 1);
							}
						})
						.catch(function(error) {
							console.log(error)
						})
				}

			},
		},
		watch: {
			companyID: function() {
				console.log("type3 Change")
				this.cards = []
				var that = this
				// console.log("检测到用户type为" + this.userType)
				if (this.companyID !== null) {
					// console.log("search" + this.type3ID)
					this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
							params: {
								requestCode: '007',
								user_id: Cookies.get('user_id'),
								company_id: this.companyID,
								token: Cookies.get('token')
							}
						})
						.then(function(response) {
							console.log(response.data.data)
							var data = response.data.data
							// that.cards = response.data.data
							for (var number in data) {
								if (data[number].dismiss === "1") {
									that.cards.push(data[number])
									// console.log("加一个")
								}
							}

						})
						.catch(function(error) {
							console.log(error)
						})
					// this.cards = [{}]
				}
			}
		}

	}
</script>
<style scoped>
	.deviceManage {
		width: 100%;
		height: 96%;
		/* background-color: ; */
	}

	.cardBox {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;

	}

	.box-card {
		width: 300px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.plusButton {
		position: fixed;
		top: 20%;
		right: 30px;
	}

	el-scrollbar. el-scrollbar_wrap {
		overflow-x: hidden;
	}
</style>
