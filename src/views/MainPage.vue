<template>
	<div id="mainPage" ref="mainPage">
		<div class="topBar">
			<div class="title">
				<div style="display: flex;flex-direction: row;align-items: center;">
					<h3 v-if="this.smallMode">IOT管理</h3>
					<h3 v-if="!this.smallMode">IOT设备管理平台</h3>
					<el-button size="small" icon="el-icon-s-fold" v-on:click="Collapse()"
						style="margin-left: 10px;" v-if="!this.smallMode"></el-button>
				</div>

				<div class="titleButtons">
				     <el-button  icon="el-icon-set-up" circle @click="gotolink6"></el-button>
				     <!-- <el-button  icon="el-icon-check" circle></el-button> -->
				     <el-button type="primary" icon="el-icon-s-custom" circle @click="gotolink5"></el-button>
				    </div>
			</div>
			<el-divider content-position="left">功能列表</el-divider>
		</div>
		<!-- <div class="show" ref="show" style="background-color: antiquewhite;"> -->
		<div ref='menu' class="menu">
			<el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
				:collapse="isCollapse">
				<el-menu-item index="1" v-on:click="jump('DataInformation')">
					<i class="el-icon-document-copy"></i>
					<span slot="title">数据概览</span>
				</el-menu-item>
				<el-menu-item index="2" v-on:click="jump('DeviceMap')">
					<i class="el-icon-location-information"></i>
					<span slot="title">设备地图</span>
				</el-menu-item>
				<el-submenu index="3">
					<template slot="title">
						<i class="el-icon-view"></i>
						<span>数字镜像</span>
					</template>
					<el-menu-item index="3-1" v-on:click="jump('ProductionManage')">
						<i class="el-icon-edit-outline"></i>
						<span slot="title">产品管理</span>
					</el-menu-item>
					<el-menu-item index="3-2" v-on:click="jump('DeviceManage')">
						<i class="el-icon-edit-outline"></i>
						<span slot="title">设备管理</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="4">
					<template slot="title">
						<i class="el-icon-data-analysis"></i>
						<span>设备数据流</span>
					</template>
					<el-menu-item index="4-1" v-on:click="jump('DataFlout')">
						<i class="el-icon-data-board"></i>
						<span slot="title">平台数据流</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="5">
					<template slot="title">
						<i class="el-icon-timer"></i>
						<span>时序数据库</span>
					</template>
					<el-menu-item index="5-1" v-on:click="jump('ForeData')">
						<i class="el-icon-bank-card"></i>
						<span slot="title">元数据</span>
					</el-menu-item>
					<el-menu-item index="5-2" v-on:click="jump('DataCheck')">
						<i class="el-icon-search"></i>
						<span slot="title">数据查询</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="6">
					<template slot="title">
						<i class="el-icon-service"></i>
						<span>监控运维</span>
					</template>
					<el-menu-item index="6-1" v-on:click="jump('DashBoard')">
						<i class="el-icon-odometer"></i>
						<span slot="title">仪表盘</span>
					</el-menu-item>
					<el-menu-item index="6-2" v-on:click="jump('DataMonitor')">
						<i class="el-icon-notebook-2"></i>
						<span slot="title">数据监控</span>
					</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
		<!-- <router-view class= "routeView" ref='routeView'></router-view> -->
		<div class="routeView" ref="routeView">
			<router-view style="width: 100%; height: 100%;"></router-view>
		</div>
		<!-- </div> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isCollapse: false,
				menuWidth: 256,
				smallMode : false,
				screanwidth : 0,
				screan : 0,
				height : 0
			}
		},
		methods: {
			gotolink5(){
			    this.$router.push({name: "PersonnalDetails"})
			   },
			   gotolink6(){
			    this.$router.push({name: "Settings"})
			   },
			   
			handleOpen(key, keyPath) {
				// eslint-disable-next-line no-console
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				// eslint-disable-next-line no-console
				console.log(key, keyPath);
			},
			Collapse() {
				if (this.isCollapse) {
					this.menuWidth = 256
					this.isCollapse = false
					this.$refs.routeView.style.left = "256px"
					this.$refs.routeView.style.width = `${document.documentElement.clientWidth - this.menuWidth-22}` + 'px'
					this.screanwidth = this.$refs.routeView.style.width = document.documentElement.clientWidth - this.menuWidth-22
				} else {
					this.menuWidth = 65
					this.isCollapse = true
					this.$refs.routeView.style.left = "65px"
					this.$refs.routeView.style.width = `${document.documentElement.clientWidth - this.menuWidth-22}` + 'px'
					this.screanwidth = this.$refs.routeView.style.width = document.documentElement.clientWidth - this.menuWidth-22
				}
				// alert("折叠后" + this.screanwidth +this.smallMode)
			},
			jump(path) {
				// eslint-disable-next-line no-console
				console.log(path)
				this.$router.push({
					name: path
				})
			}
		},
		watch: {
			isCollapse: function(val) {
				// eslint-disable-next-line no-console
				// console.log("change");
				if (val) {
					this.$refs.menu.style.width = "65px"

				} else {
					this.$refs.menu.style.width = "256px"

				}
			},
			screan: function(val){
				if(val <600 && !this.isCollapse){
					this.Collapse()
					this.smallMode = true
				}
				else if(val > 600 && this.isCollapse){
					this.smallMode = false
				}
				else if(val < 600 && this.isCollapse){
					this.smallMode = true
				}
			}
			
		},
		mounted() {
			this.screanheight = `${document.documentElement.clientHeight - 114}`
			this.screanwidth = `${document.documentElement.clientWidth - this.menuWidth-22}`
			this.screan = document.documentElement.clientWidth
			this.$refs.menu.style.height = this.screanheight + 'px'
			this.$refs.routeView.style.width = this.screanwidth + 'px'
			this.$refs.routeView.style.height = this.screanheight + 'px'
			 // alert(this.screanwidth)
			var that = this
			window.onresize = function() {
				// console.log("change")
				// console.log(that.screanwidth)
				that.height = document.documentElement.clientHeight
				that.screan = document.documentElement.clientWidth
				that.screanwidth = document.documentElement.clientWidth - that.menuWidth-22
				that.$refs.routeView.style.width = `${document.documentElement.clientWidth - that.menuWidth-22}` + 'px'
				that.$refs.routeView.style.height = `${document.documentElement.clientHeight - 114}` + 'px'
				that.$refs.menu.style.height = `${document.documentElement.clientHeight - 112}` + 'px'
			}
		}
	}
</script>

<style lang="scss">
	#mainPage {
		width: 100%;
		// background-color: palegoldenrod;
	}

	.el-menu-vertical-demo {
		width: 100%;
		height: 100%;
		// background-color: cadetblue;
	}

	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-left: 2%;
		margin-right: 2%;
		// position: fixed;
		width: 96%;

	}

	.topBar {
		// background-color: darkcyan;
		position: fixed;
		top: 0px;
		width: 100%;
		z-index: 999;
	}

	.show {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
	}

	.routeView {
		// background-color: lightgrey;
		position: fixed;
		top: 112px;
		left: 256px;
		margin-left: 20px;
		margin-top: 0px;
	}

	.menu {
		position: fixed;
		top: 112px;
		left: 0px;
		width: 256px;

	}
</style>
