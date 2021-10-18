<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>数字镜像</el-breadcrumb-item>
			<el-breadcrumb-item>产品管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="productionManage">
			<!-- 原workspack -->
			<el-divider content-position="left">产品列表（设备模型)</el-divider>
			<!-- <div style="width: 100%;display: flex;flex-direction: row-reverse; margin-bottom: 10px;"> -->
			<!-- <el-button type="primary"  v-on:click="goToAdd()" icon="el-icon-circle-plus-outline" cricle></el-button> -->
			<el-button type="primary" icon="el-icon-circle-plus-outline" circle v-on:click="goToAdd()"
				class="plusButton" v-if="this.companyID !== null"></el-button>

			<!-- </div> -->
			<el-select v-model="companyID" placeholder="请选择工厂" v-if="this.userType === '3'">
				<el-option v-for="(item,index) in Componies" :key="index" :label="item.company_name"
					:value="item.company_id">
				</el-option>
			</el-select>
			<el-button style="margin-left: 10px;" v-on:click="goToAddConpony()" v-if="this.userType === '3'">添加工厂
			</el-button>
			<el-empty description="请选择工厂" style="width: 100%;height: 80%;" v-if="this.companyID === null"></el-empty>
			<!-- <div style="width: 100%;height: 80%;" ref="scroll"> -->
				<el-scrollbar style="height: 85%; width: 100%;">

					<el-empty description="该工厂还没有产品,点击上方加号添加" v-if="this.cards === undefined || this.cards.length ===0">
					</el-empty>
					<div class="cardBox">
						<el-card class="box-card" v-for="(item, index) in cards" :key="index">
							<div slot="header" class="clearfix">
								<!-- <el-radio v-model="radio"></el-radio> -->
								<span style="font-size: 20px;">{{item.product_name}}</span>
								<el-button style="float: right;" type="warning" icon="el-icon-setting" circle
									v-on:click="fix(index, cards)" size="small"></el-button>
								<!-- <el-button style="float: right; padding: 3px 0" type="text" @click.native.prevent="deleteRow(index, cards)">删除</el-button> -->
							</div>
							<!-- <el-image style="width: 100%; height: 50%" :src="item.images[0]" fit="fit"></el-image> -->
							<el-carousel height="150px">
								<el-carousel-item v-for="(image,index) in item.images" :key="index">
								<el-image style="width: 100%; height: 100%" :src=image fit="cover"></el-image>
								</el-carousel-item>
							</el-carousel>
							<el-collapse>
								<el-collapse-item title="描述" name="1">
									<div>{{item.product_des}}</div>
								</el-collapse-item>
								<el-collapse-item title="仪器指标" name="2">
									<template>
										<el-table :data="item.data_format" style="width: 100%">
											<el-table-column prop="name" label="名称" width="180">
											</el-table-column>
											<!-- <el-table-column prop="showName" label="型号" width="180">
											</el-table-column> -->
											<el-table-column prop="default" label="默认值">
											</el-table-column>
											<el-table-column prop="unit" label="单位">
											</el-table-column>
										</el-table>
										<!-- 	<div v-for=" (format,ForIndex) in item.data_format" :key="ForIndex">
											{{format}}
										</div> -->
									</template>
								</el-collapse-item>
							</el-collapse>
						</el-card>
					</div>
				</el-scrollbar>
			<!-- </div> -->
		<!-- 	<div class="pagination" style="height: 10%;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="100"
					layout="prev, pager, next" :total="300" small>
				</el-pagination>
			</div> -->
		</div>
	</div>
</template>
<script>
	import Cookies from 'js-cookie'
	export default {
		data() {
			return {
				height: document.documentElement.clientHeight,
				// userID: 'user_2',
				// token: '1628765771204',
				companyID: '',
				userType: null,
				cards: [],
				Componies: [],
			}
		},
		beforeCreate() {

		},
		created() {
			// console(this.userID +" "+ this.token + " "+this.company_id)
			// console.log("当前登录信息：componyID:"+Cookies.get('compony_id')+" Type:"+ Cookies.get('modal'))
			this.userType = Cookies.get('modal')
			console.log(this.userType)
			var that = this
			if (this.userType !== '3') {
				this.companyID = Cookies.get('company_id')
				console.log("普通")
				// this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
				// 		params: {
				// 			requestCode: '005',
				// 			user_id: Cookies.get('user_id'),
				// 			company_id: Cookies.get('company_id'),
				// 			token: Cookies.get('token')
				// 		}
				// 	})
				// 	.then(function(response) {
				// 		console.log(Cookies.get('user_id'))
				// 		console.log(Cookies.get('company_id'))
				// 		console.log(Cookies.get('token'))
				// 		// console.log("get success in type 1")
				// 		console.log(response)
				// 		that.cards = response.data.data
						
				// 	})
				// 	.catch(function(error) {
				// 		console.log(error)
				// 	})
			} else {
				console.log("系统管理员")
				// alert("系统管理员")
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
						// alert("获取")
						that.Componies = response.data.data
					})
					.catch(function(error) {
						console.log(error)
					})
			}


		},
		mounted() {
			// this.$refs.scroll.style.height = `${document.documentElement.clientHeight-268}` + "px"
			// var that = this
			// window.onresize = function() {
			// 	that.$refs.scroll.style.height = `${document.documentElement.clientHeight-268}` + "px"
			// }
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			goToAdd() {
				// console.log(this.companyID)
				this.$router.push({
					name: 'AddProduction',
					params: {
						companyID: this.companyID
					}
				})
			},
			goToAddConpony() {
				this.$router.push({
					name: 'AddCompony',
					params: {
						whichFrom: 1
					}
				})
			},
			fix(index, rows) {
				// rows.splice(index, 1);
				console.log(this.cards[index])
				var fixCard = this.cards[index]
				this.$router.push({
					name: "FixProduction",
					params: {
						companyID: fixCard.company_id,
						form: fixCard
					}
				})
			},
		},
		watch: {
			companyID: function() {
				console.log("Change")
				this.cards = []
				var that = this
				// console.log("检测到用户type为" + this.userType)
				if (this.companyID !== null) {
					// console.log("search" + this.type3ID)
					this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
							params: {
								requestCode: '005',
								user_id: Cookies.get('user_id'),
								company_id: this.companyID,
								token: Cookies.get('token')
							}
						})
						.then(function(response) {
							console.log(response)
							// that.cards = response.data.data
							var data = response.data.data
							for (var number in data) {
								if (data[number].dismiss === "1") {
									that.cards.push(data[number])
								}
							}
							console.log(that.cards)
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
	.productionManage {
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
