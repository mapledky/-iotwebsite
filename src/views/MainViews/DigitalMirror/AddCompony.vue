<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>数字镜像</el-breadcrumb-item>
			<el-breadcrumb-item :to="{name:'DeviceManage'}" v-if="this.whichFrom===2">设备管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{name:'ProductionManage'}" v-if="this.whichFrom===1">产品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加工厂</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="addCompony">
			<el-divider content-position="right">添加工厂</el-divider>
			<div style="width: 100%;height: 80%;" ref="scroll">
				<el-scrollbar style="height: 100%; width: 100%;">
					<div class="form">
						<el-form ref="form" :model="componyForm" label-width="80px">
							<el-form-item label="公司名称">
								<el-input v-model="componyForm.name"></el-input>
							</el-form-item>
							<el-form-item label="公司位置(点击选址)">
								<div style="text-align: right;">
									省：<select id="province" style="width: 130px; height: 30px; border: 1px solid #ccc"
										@change="search"></select>
									市：<select id="city" style="width: 130px; height: 30px; border: 1px solid #ccc"
										@change="search"></select>
									区：<select id="district" style="width: 130px; height: 30px; border: 1px solid #ccc"
										@change="search"></select>
								</div>
								<div id="container">
								</div>
							</el-form-item>
							<el-form-item label="选中位置" v-if="componyForm.position.lat!==null">
								<el-tag style="margin-right: 20px;">经度：{{componyForm.position.lng}}</el-tag>
								<el-tag>纬度：{{componyForm.position.lat}}</el-tag>
							</el-form-item>
						</el-form>
					</div>
				</el-scrollbar>
			</div>
			<div
				style="display: flex;flex-direction: row-reverse;padding-right: 10px;height: 10%;padding-bottom: 10px;">
				<el-button type="success" v-on:click="creat()">创建</el-button>
			</div>

		</div>
	</div>
</template>

<script>
	import Cookies from 'js-cookie'
	import {
		AMapManager
	} from 'vue-amap';
	// import AMap from 'Amap'
	export default {
		data() {
			let self = this;

			return {
				marker: null,
				position: {
					lat: null,
					lng: null
				},
				map: null,
				polygons: [],
				district: null,
				componyForm: {
					name: "",
					position: {
						lat: null,
						lng: null
					},
				},
				events: {
					click(e) {
						let {
							lng,
							lat
						} = e.lnglat;
						self.lng = lng;
						self.lat = lat;
						alert(self.lng + "/" + self.lat)
					}
				}
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
							if(that.marker !== null){
								that.map.remove(that.marker)	
							}
							that.marker =  new AMap.Marker({
							position: [e.lnglat.lng, e.lnglat.lat],
							})
							that.marker.setMap(that.map)
							that.componyForm.position = e.lnglat
						})
						this.polygons.push(polygon)
					}
					if(this.marker !== null){
						this.map.remove(that.marker)	
					}
					this.componyForm.position.lat = null
					this.componyForm.position.lng =null
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
				this.map = new AMap.Map('container', {
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
					if(that.marker !== null)
					that.map.remove(that.marker)		
					that.marker =  new AMap.Marker({
					position: [e.lnglat.lng, e.lnglat.lat],
				    })
					that.marker.setMap(that.map)
					that.componyForm.position = e.lnglat
				})
			},
			creat() {
				var that = this
				if (this.componyForm.name === "" || this.componyForm.position.lat === null) {
					this.$message({
						message: '未填写完，创建失败',
						type: 'warning'
					});
				} else {
					// this.$message({
					// 	message: '创建成功',
					// 	type: 'success'
					// });
					this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
						params: {
							requestCode : '024',
							user_id : Cookies.get("user_id"),
							token : Cookies.get("token"),
							name : this.componyForm.name,
							latitude : this.componyForm.position.lat,
							longitude : this.componyForm.position.lng,
						},
					})
					.then(function(response){
						console.log(response)
						if(response.data !== undefined){
							that.$message({
								message: '创建成功',
								type: 'success'
							});
							if(that.whichFrom === 1)
							that.$router.push({name :"ProductionManage"})
							else
							that.$router.push({name :"DeviceManage"})
						}else{
							that.$message({
								message: '上传失败',
								type: 'warning'
							});
						}
					})
					.catch(function(error){
						console.log(error)
					})
				}
			}
		},
		mounted() {
			this.loadmap()
			this.province()
			console.log("from:" + this.whichFrom)
		},
		watch: {
		    componyForm : function(){
				console.log("change")
			}
		},
		props: ['whichFrom']
	}
</script>
<style>
	#container {
		width: 100%;
		height: 300px;
	}

	.addCompony {
		width: 100%;
		height: 96%;
	}

	.amap-page-container {
		width: 500px;
		height: 300px;
	}
</style>
