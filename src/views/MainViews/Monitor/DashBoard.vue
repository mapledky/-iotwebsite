<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>监控运维</el-breadcrumb-item>
      <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="workspace">
		
		<el-divider content-position="left">产品列表</el-divider>
		<el-empty description="系统管理员无法使用此功能" v-if="this.isType3 !== false"></el-empty>
      <div class="scrollbox" v-if="this.isType3 === false">
        <el-scrollbar style="height: 95%; width: 100%;">
          <div class="productList">
            <!-- <div class="topTitle"> -->
             <!-- <h3>产品列表</h3> -->
              <!-- <div class="searchClass">
                <el-input size="mini" placeholder="请输入产品名称以搜索">
                  <el-button class="search" icon="el-icon-search" size="mini" slot="append"> </el-button>
                </el-input>
              </div> -->
            <!-- </div> -->
            <div class="list">
              <div
                class="list-items"
                v-for="product in productListData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                :key="product.product_id"
                @click="goDevice(product)"
              >
                <el-card shadow="always" :body-style="{ padding: '10px' }">
                  <div class="image-container">
                    <el-image :src="product.images[0]" style="width: 200px; height: 180px" fit="cover"></el-image>
                  </div>
                  <h4 style="margin-top: 8px">{{ product.product_name }}</h4>
                </el-card>
              </div>
            </div>

            <div class="pagination">
              <el-pagination
                class="Page"
                background
                layout="prev, pager, next"
                :total="productListData.length"
                :page-size="pagesize"
                :current-page="currentPage"
                @current-change="handleChange"
              >
              </el-pagination>
            </div>
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
	  isType3 : false,
      user_id: '',
      token: '',
      company_id: '',
      productListData: [],
      currentPage: 1,
      pagesize: 12,
    }
  },

  created() {
    const that = this
    that.user_id = Cookies.get('user_id')
    that.token = Cookies.get('token')
    // eslint-disable-next-line no-console
    console.log(that.token)
    // that.company_id = Cookies.get('company_id')
	if (Cookies.get('modal') === '3'){
		console.log("检测到为系统管理员")
		that.company_id = '1'
		that.isType3 = true
	}
	else{
		console.log("检测到为普通成员")
		that.company_id = Cookies.get('company_id')
	}
    that.getProductList()
  },
  methods: {
    getProductList: function () {
      var that = this
      var url = 'https://site.maple.today/IOTplatform/ServerMain?requestCode=005'
      axios
        .get(url, {
          params: {
            user_id: that.user_id,
            token: that.token,
            company_id: that.company_id,
          },
        })
        .then(function (response) {
          // eslint-disable-next-line no-console
          console.log(response.data)
          if (response.data.result === '1') {
            that.productListData = response.data.data
            // eslint-disable-next-line no-console
            console.log(that.productListData)
          }
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },
    goDevice: function (product) {
      var new_product = JSON.stringify(product)
      this.$router.push({ path: '/mainPage/dashBoard/deviceList', query: { product: encodeURIComponent(new_product) } })
    },
    handleChange(val) {
      // eslint-disable-next-line no-console
      console.log(val)
      this.currentPage = val
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
