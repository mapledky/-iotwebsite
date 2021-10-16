<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>监控运维</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name:'DashBoard'}">仪表盘</el-breadcrumb-item>
      <el-breadcrumb-item>设备列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="workspace">
		<el-divider content-position="left">设备列表</el-divider>
      <div class="scrollbox">
        <el-scrollbar style="height: 95%; width: 100%;">
          <div class="productList">
            <!-- <div class="topTitle">
              <h3>设备列表</h3>
            </div> -->
            <div class="list">
              <div class="list-items" v-for="device in deviceList" :key="device.sensor_id" @click="goData(device)">
                <el-card shadow="always" :body-style="{ padding: '10px' }">
                  <div class="image-container">
                    <!-- <el-image :src="require('@/assets/logo.png')" style="width: 200px; height: 180px"></el-image> -->
                  </div>
                  <h4 style="margin-top: 8px">{{ device.sensor_name }}</h4>
                </el-card>
              </div>
            </div>

            <!-- <div class="pagination">
              <el-pagination class="Page" background layout="prev, pager, next" :total="2" :page-size="2"> </el-pagination>
            </div> -->
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import axios from 'axios'

export default {
  data() {
    return {
      user_id: '',
      token: '',
      company_id: '',
      product: {},
      deviceList: [],
    }
  },
  created() {
    const that = this
    that.user_id = Cookies.get('user_id')
    that.token = Cookies.get('token')
    // that.company_id = Cookies.get('company_id')
	if (Cookies.get('modal') === '3'){
		console.log("检测到为系统管理员")
		that.company_id = '1'
	}
	else{
		console.log("检测到为普通成员")
		that.company_id = Cookies.get('company_id')
	}
	// that.company_id = '1'
    that.getRouteData()
    that.getDeviceData()
  },
  methods: {
    getRouteData() {
      const that = this
      var new_product = decodeURIComponent(that.$route.query.product)
      that.product = JSON.parse(new_product)
      // eslint-disable-next-line no-console
      console.log(that.product)
    },
    goData: function (device) {
      var new_device = JSON.stringify(device)
      this.$router.push({ path: '/mainPage/dashBoard/deviceList/dataBoard', query: { device: encodeURIComponent(new_device) } })
    },
    getDeviceData() {
      const that = this
      var url = 'https://site.maple.today/IOTplatform/ServerMain?requestCode=025'
      axios
        .get(url, {
          params: {
            user_id: that.user_id,
            token: that.token,
            company_id: that.company_id,
            product_id: that.product.product_id,
          },
        })
        .then(function (response) {
          // eslint-disable-next-line no-console
          console.log(response.data)
          if (response.data.result === '1') {
            that.deviceList = response.data.data
            for (var i = 0; i < that.deviceList.length; i++) {
              that.deviceList[i].data_format = that.product.data_format
            }
          }
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },
  },
}
</script>

<style scoped>
.workspace {
  width: 100%;
  height: 96%;
/*  background-color: antiquewhite;
  border: black;
  border-width: 1px;
  border-style: solid; */
}

.scrollbox {
  width: 100%;
  height: 100%;
}

.productList {
  width: 98%;
  min-height: 580px;
  margin-top: 1%;
  margin-right: 1%;
  margin-left: 1%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topTitle {
  width: 98%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(116, 186, 204);
}

.searchClass {
  width: 450px;
}

.list {
  width: 98%;
  margin-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-bottom: 1px solid rgb(116, 186, 204);
}

.list-items {
  height: 280px;
  margin-left: 35px;
  margin-right: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  border: 1px solid rgb(116, 186, 204);
  border-radius: 5px;
  overflow: hidden;
  width: 200px;
  height: 180px;
}

.el-card {
  width: 220px;
  height: 250px;
}

.pagination {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
  margin-bottom: 30px;
  width: 98%;
}

.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
