<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>数字镜像</el-breadcrumb-item>
			<el-breadcrumb-item :to="{name:'DeviceManage'}">设备管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加设备</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="addDevice">
			<el-divider content-position="right">添加设备</el-divider>
			<div style="width: 100%;height: 80%;" ref="scroll">
				<el-scrollbar style="height: 100%; width: 100%;" v-if="this.cards !== undefined ">
					<el-form ref="form" :model="form" label-width="80px">
						<!-- <el-form-item label="所属工厂">
							<el-input v-model="form.componyName" disabled></el-input>
						</el-form-item> -->
						<el-form-item label="选择产品">
							<el-select v-model="form.product_id" placeholder="请选择产品">
								<el-option v-for="(item,index) in form.productions" :key="index"
									:value="item.product_id" :label="item.product_name">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备名称">
							<el-input v-model="form.sensor_name"></el-input>
						</el-form-item>
						<el-form-item label="设备位置(点击选址)">
							<div style="text-align: right;">
								省：<select id="province" style="width: 130px; height: 30px; border: 1px solid #ccc"
									@change="search"></select>
								市：<select id="city" style="width: 130px; height: 30px; border: 1px solid #ccc"
									@change="search"></select>
								区：<select id="district" style="width: 130px; height: 30px; border: 1px solid #ccc"
									@change="search"></select>
							</div>
							<div id="containerOfAD">
							</div>
						</el-form-item>
						<el-form-item label="选中位置" v-if="form.position.lat!==null">
							<el-tag style="margin-right: 20px;">经度：{{form.position.lng}}</el-tag>
							<el-tag>纬度：{{form.position.lat}}</el-tag>
						</el-form-item>
					</el-form>
				</el-scrollbar>
			</div>
			<div
				style="display: flex;flex-direction: row-reverse;padding-right: 10px;height: 10%;padding-bottom: 10px;">
				<el-button type="success" v-on:click="creatSensor()">创建</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import Cookies from 'js-cookie'
	import {
		AMapManager
	} from 'vue-amap';
	export default {
		data() {
			return {
				marker: null,
				position: {
					lat: null,
					lng: null
				},
				map: null,
				polygons: [],
				district: null,
				upForm: {
					productionType: 0,
				},
				form: {
					componyName: '',
					// id: 0,
					productions: [],
					product_id: null,
					sensor_name: "",
					position: {
						lat: null,
						lng: null,
					}
				},
				cards: [{
						name: "牛死逼车床",
						description: "这个车床牛死逼了",
						imageCount: 0,
						url: "https://img2.baidu.com/it/u=1938097429,3295786295&fm=26&fmt=auto&gp=0.jpg",
						Arrtribute: [{
								type: "电流",
								name1: "车床总线电流",
								name2: "QWER - 5 电流表",
								default: "50",
								unit: "ma",
							},
							{
								type: "温度",
								name1: "车床车刀温度",
								name2: "QWER - 5 测温仪",
								default: "90",
								unit: "°C",
							},
						],
					},
					{
						name: "牛死逼车床ver2.0",
						description: "这个车床牛死逼了",
						imageCount: 0,
						url: "https://img2.baidu.com/it/u=1938097429,3295786295&fm=26&fmt=auto&gp=0.jpg",
						Arrtribute: [{
								type: "电流",
								name1: "车床总线电流",
								name2: "QWER - 5 电流表",
								default: "50",
								unit: "ma",
							},
							{
								type: "温度",
								name1: "车床车刀温度",
								name2: "QWER - 5 测温仪",
								default: "90",
								unit: "°C",
							},
						],
					}
				]
			}
		},
		methods: {
			province() {
				// 行政区划查询
				let opts = {
					subdistrict: 1, // 返回下一级行政区
					showbiz: false // 最后一级返回街道信息
				}
				this.district = new AMap.DistrictSearch(opts) // 注意：需要使用插件同步下发功能才能这样直接使用
				this.district.search('中国', (status, result) => {
					if (status === 'complete') {
						this.getData(result.districtList[0])
					}
				})
			},
			getData(data, level) {
				let citySelect = document.getElementById('city')
				let districtSelect = document.getElementById('district')
				let bounds = data.boundaries
				var that = this
				if (bounds) {

					for (let i = 0, l = bounds.length; i < l; i++) {
						let polygon = new AMap.Polygon({
							map: this.map,

							strokeWeight: 1,
							strokeColor: '#ff52a1',
							fillColor: '#ffeef6',
							fillOpacity: 0.2,
							path: bounds[i],

						})
						AMap.event.addListener(polygon, 'click', function(e) { //添加点击事件,传入对象名，事件名，回调函数
							that.position = e.lnglat
							// alert(this.position)
							if (that.marker !== null) {
								that.map.remove(that.marker)
							}
							that.marker = new AMap.Marker({
								position: [e.lnglat.lng, e.lnglat.lat],
							})
							that.marker.setMap(that.map)
							that.form.position = e.lnglat
						})
						this.polygons.push(polygon)
					}
					if (this.marker !== null) {
						this.map.remove(that.marker)
					}
					this.form.position.lat = null
					this.form.position.lng = null
					this.map.setFitView() // 地图自适应
				}
				// 清空下一级别的下拉列表
				if (level === 'province') {
					citySelect.innerHTML = ''
					districtSelect.innerHTML = ''
				} else if (level === 'city') {
					districtSelect.innerHTML = ''
				}
				let subList = data.districtList
				if (subList) {
					let contentSub = "";
					let curlevel = subList[0].level;
					let curList = document.querySelector("#" + curlevel);
					if (!curList) return false;
					if (curlevel === "province") {
						curList.add(new Option("全国"));
					} else if (curlevel === "city") {
						curList.add(new Option("全市"));
					} else {
						curList.add(new Option("全区"));
					}
					for (let i = 0, l = subList.length; i < l; i++) {
						let name = subList[i].name
						let levelSub = subList[i].level
						contentSub = new Option(name)
						contentSub.setAttribute('value', levelSub)
						contentSub.center = subList[i].center
						contentSub.adcode = subList[i].adcode
						curList.add(contentSub)
					}
				}
			},
			search(obj) {
				// 清除地图上所有覆盖物
				let that = this
				for (let i = 0, l = this.polygons.length; i < l; i++) {
					this.polygons[i].setMap(null)
				}
				let option = obj.srcElement[obj.srcElement.options.selectedIndex]
				let adcode = option.adcode
				this.district.setLevel(option.value) // 行政区级别
				this.district.setExtensions('all')
				// 行政区查询
				// 按照adcode进行查询可以保证数据返回的唯一性
				this.district.search(adcode, function(status, result) {
					if (status === 'complete') {
						that.getData(result.districtList[0], obj.srcElement.id)
					}
				})
			},
			loadmap() {
				var that = this
				this.map = new AMap.Map('containerOfAD', {
					center: [118.792221, 31.938254],
					zoom: 15,
				});
				// this.marker = new AMap.Marker({
				// 	position: [118.792221, 31.938254],
				// 	// icon: alarmIcon, // Icon的图像，地址引入const
				// 	// offset: new AMap.Pixel(-25, -35)
				// })
				// this.marker.setMap(this.map)
				// 缩放地图到合适的视野级别
				// this.map.setFitView([this.maker])
				AMap.event.addListener(this.map, 'click', function(e) {
					//添加点击事件,传入对象名，事件名，回调函数
					if (that.marker !== null)
						that.map.remove(that.marker)
					that.marker = new AMap.Marker({
						position: [e.lnglat.lng, e.lnglat.lat],
					})
					that.marker.setMap(that.map)
					that.form.position = e.lnglat
				})
			},
			creatSensor() {
				console.log(this.form)
				if (this.form.product_id === null || this.form.sensor_name === '' || this.form.position.lat === null) {
					this.$message({
						message: '未填写完，创建失败',
						type: 'warning'
					})
				} else {
					var that = this
					this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
							params: {
								requestCode: '006',
								user_id: Cookies.get("user_id"),
								token: Cookies.get("token"),
								company_id: that.companyID,
								sensor_name: that.form.sensor_name,
								product_id: that.form.product_id,
								latitude: that.form.position.lat,
								longitude: that.form.position.lng
							},

							// params : that.form
						})
						.then(function(response) {
							console.log(response.data)
							if (response.data.result === "1") {
								that.$message({
									message: '创建成功',
									type: 'success'
								});
								that.$router.push({
									name:"DeviceManage"
								})
							} else {
								that.$message({
									message: '创建失败',
									type: 'warning'
								});
							}
						})
						.catch(function(error) {
							console.log(error)
						})
				}
			}
		},
		created() {
			// console.log(this.componyName + this.componyId),
			this.form.componyName = this.componyName
			// this.form.id = this.companyID,
			// 	this.form.productions = this.cards
			var that = this
			this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
					params: {
						requestCode: '005',
						user_id: Cookies.get('user_id'),
						company_id: that.companyID,
						token: Cookies.get('token')
					}
				})
				.then(function(response) {
					console.log(response.data.data)
					that.form.productions = response.data.data

				})
				.catch(function(error) {
					console.log(error)
				})

		},
		props: ['componyName', 'companyID'],
		mounted() {
			this.loadmap()
			this.province()
		},
	}
</script>
<style>
	.addDevice {
		width: 100%;
		height: 96%;
	}

	#containerOfAD {
		width: 100%;
		height: 300px;
	}
</style>
