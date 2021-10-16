<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>数字镜像</el-breadcrumb-item>
			<el-breadcrumb-item :to="{name:'ProductionManage'}">产品管理</el-breadcrumb-item>
			<el-breadcrumb-item>修改产品</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="addProduction">
			<el-divider content-position="right">修改产品</el-divider>
			<div style="width: 100%;height: 80%;" ref="scroll">
				<el-scrollbar style="height: 100%; width: 100%;">
					<div class="form">
						<el-form ref="form" :model="form" label-width="80px">
							<el-form-item label="产品名称">
								<el-input v-model="form.product_name"></el-input>
							</el-form-item>
							<el-form-item label="产品图片">
								<el-button type="primary" @click="openImg">选择</el-button>
								<!-- <el-button type="primary">上传</el-button> -->
								<div>
									<input v-show="false" type="file" accept="image/*" @change="tirggerFile($event)"
										ref="input" />
									<div class="imagesFix">
										<div style="width:200px;height:200px;text-align:center;margin-right: 10px;"
											v-for="(item,index) in form.images" :key="index">

											<el-button type="danger" icon="el-icon-delete" circle
												style="position: absolute;" @click="deleteForeImage(index,form.images)">
											</el-button>

											<el-image style="height:100%;width:100%; z-index: -1;" :src="item"
												fit="cover"> </el-image>
										</div>
										<div style="width:200px;height:200px;text-align:center;margin-right: 10px;"
											v-for="(item,index) in imgUrl" :key="index">
										
											<el-button type="danger" icon="el-icon-delete" circle
												style="position: absolute;" @click="deleteImage(index,imgUrl)">
											</el-button>
										
											<el-image style="height:100%;width:100%; z-index: -1;" :src="item"
												fit="cover"> </el-image>
										</div>
									</div>
								</div>
							</el-form-item>
							<el-form-item label="产品描述">
								<el-input v-model="form.product_des"></el-input>
							</el-form-item>

							<el-form-item label="产品属性">
								<div class="table">
									<el-table :data="this.tableData" style="width: 100%" max-height="250">
										<el-table-column prop="name" label="属性名称" width="150">
										</el-table-column>
										<!-- <el-table-column prop="showName" label="显示名称" width="120">
										</el-table-column>
										<el-table-column prop="type" label="数据类型" width="120">
										</el-table-column> -->
										<el-table-column prop="default" label="默认值" width="120">
										</el-table-column>
										<el-table-column prop="unit" label="单位" width="300">
										</el-table-column>

										<el-table-column label="操作" width="120">
											<template slot-scope="scope">
												<el-button @click.native.prevent="deleteRow(scope.$index,tableData)"
													type="text" size="small">
													移除
												</el-button>
											</template>
										</el-table-column>
									</el-table>
								</div>

							</el-form-item>
							<el-form-item label="添加属性" v-if="addMode" style="width: 50%; z-index: 999;">
								<el-input placeholder="属性名称" v-model="addTable.name"></el-input>
								<!-- <el-input placeholder="仪器型号" v-model="addTable.showName"></el-input> -->
								<!-- <el-input placeholder="数据类型" v-model="addTable.type"></el-input> -->
								<el-input placeholder="默认值" v-model="addTable.default"></el-input>
								<el-input placeholder="单位" v-model="addTable.unit"></el-input>
							</el-form-item>
						</el-form>
						<el-button type="primary" style="width: 100px;" v-on:click="addItem()" v-if="!addMode">添加属性
						</el-button>
						<el-button type="primary" style="width: 70px;" v-on:click="addItem()" v-if="addMode">确定
						</el-button>
					</div>

				</el-scrollbar>
			</div>
			<div
				style="display: flex;flex-direction: row-reverse;padding-right: 10px;height: 10%;padding-bottom: 10px;">
				<el-button type="success" v-on:click="upload()">上传</el-button>
			</div>

		</div>
	</div>
</template>
<script lang="ts">
	import Cookies from 'js-cookie'
	type tableDataType = {
		name: string,
		showName: string,
		type: string,
		default: string,
		unit: string,
	}
	export default {
		data() {
			return {
				isUp : false,
				upNumber :0,
				height: 0,
				addMode: false,
				imgData : [],
				imgUrl : [],
				// form: {
				// 	product_name: '',
				// 	product_des: '',
				// 	images: [],
				// 	data_format: [],
				// 	company_id: null,
				// 	user_id : Cookies.get("user_id"),
				// 	token : Cookies.get("token")
				// },
				tableData: [

				],
				addTable: {
					name: '',
					// showName: '',
					// type: '',
					default: '',
					unit: ''
				}
			}
		},
		mounted() {
			// console.log(this.height)
			// this.$refs.scroll.style.height = `${document.documentElement.clientHeight-230}` + "px"
		},
		created() {
			// this.form.company_id = this.companyID
			console.log(this.companyID)
			console.log(this.form)
			this.tableData = this.form.data_format
		},
		methods: {
			openImg() {
				this.$refs.input.click();
			},
			tirggerFile: function(event) {
				let file = event.target.files[0];
				if(file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg"){
					this.$message({
						message: '请选择合适的文件类型',
						type: 'warning'
					});
				}else{
					this.imgData.push(file)
					let url = "";
					var reader = new FileReader();
					reader.readAsDataURL(file);
					let that = this;
					reader.onload = function(e) {
						// url = this.result.substring(this.result.indexOf(",") + 1);
						// var currentimgUrl = "data:image/png;base64," + url;
						var currentimgUrl = e.target.result
						that.imgUrl.push(currentimgUrl)
						console.log(that.imgData)
						// that.$refs['imgimg'].setAttribute('src','data:image/png;base64,'+url);
					};
				}
				
			},
			deleteForeImage(index, rows) {
				rows.splice(index, 1);
				// this.imgData.splice(index, 1);
			},
			deleteImage(index, rows) {
				rows.splice(index, 1);
				this.imgData.splice(index, 1);
			},
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			addItem() {
				if (!this.addMode) {
					this.addMode = true
				} else {
					// console.log(this.addTable)
					var a = this.addTable
					var update = true
					if (a.name === '' || a.default === '' || a.unit === '')
						update = false

					if (update) {
						let updata: tableDataType = {
							name: '',
							showName: '',
							type: '',
							default: '',
							unit: ''
						}
						// let updata :tableData = this.addTable
						updata.showName = this.addTable.showName
						updata.name = this.addTable.name
						updata.type = this.addTable.type
						updata.unit = this.addTable.unit
						updata.default = this.addTable.default
						this.tableData.push(updata)
						console.log(updata)
						this.addTable.name = ''
						this.addTable.showName = ''
						this.addTable.type = ''
						this.addTable.default = ''
						this.addTable.unit = ''
						this.addMode = false
					} else {
						this.$message({
							message: '属性未填写完成',
							type: 'warning'
						});
						// console.log("未填写完毕")
					}

				}

			},
			
			upload() {
				var a = this.form
				a.data_format = this.tableData
				if (a.data_format.length === 0 || a.product_name === '' || a.product_des === '') {
					this.$message({
						message: '无法上传',
						type: 'warning'
					});
				} else {
					console.log(this.form)
					let config = {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}
					if(this.imgData.length === 0){
						console.log("无新照片")
						this.isUp = true
					}else{
						console.log("有新照片")
						for (var number in this.imgData) {
							let form = new FormData();
							// console.log("上传")
							var timeString = String(new Date().valueOf()) + Cookies.get("user_id") 
							var that = this
							console.log(timeString)
							form.append('name', 'file');
							form.append('imagename', timeString);
							form.append('file', this.imgData[number]);
							var fullString =  'https://site.maple.today/iotplat/'+ timeString
							this.form.images.push(fullString)
							this.$axios.post('https://site.maple.today/IOTplatform/upload/picture.htm', form, {
									headers: {
										'Content-Type': 'multipart/form-data'
									}
								}
						
							).then(response => {
								console.log(response)
								// alert('上传图片成功!');
								that.upNumber = that.upNumber + 1
								if(that.upNumber === that.imgData.length){
									console.log("图片上传完毕")
									this.isUp = true
								}
								// console.log(that.form.images)
							}).catch(error => {
								// alert('上传图片出错!');
							})
						}
					}
					// this.$axios.get('https://site.maple.today/IOTplatform/ServerMain?requestCode=004', formData,config).then(function(res) {
					// 	console.log(res)
					// })
					
				}
			}
		},
		props: ['companyID', 'form'],
		watch :{
			isUp : function(){
				console.log("开始上传")
				var dataJson = JSON.stringify(this.form.data_format)
				console.log(dataJson)
				var imageJson = JSON.stringify(this.form.images)
				console.log(imageJson)
				var that = this
				this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
						params: {
							requestCode: '020',
							user_id: Cookies.get("user_id"),
							token: Cookies.get("token"),
							company_id: that.form.company_id,
							product_name: that.form.product_name,
							product_des: that.form.product_des,
							product_id: that.form.product_id,
							images: imageJson,
							data_format: dataJson,
						},
				
						// params : that.form
					})
					.then(function(response) {
						console.log(response)
						if (response.data !== undefined) {
							that.$message({
								message: '修改成功',
								type: 'success'
							});
							that.$router.push({
								name: "ProductionManage"
							})
						} else {
							that.$message({
								message: '上传失败',
								type: 'warning'
							});
						}
					})
					.catch(function(error) {
						console.log(error)
					})
				
			}
		}

	}
</script>

<style>
	.addProduction {
		width: 100%;
		height: 96%;
		/* background-color: aliceblue; */
	}

	.form {
		display: flex;
		flex-direction: column;
		/* align-items: center; */
		padding-right: 10px;
	}

	.table {
		width: 100%;
	}
	.imagesFix {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
	}
	el-scrollbar. el-scrollbar_wrap {
		overflow-x: hidden;
	}
</style>
