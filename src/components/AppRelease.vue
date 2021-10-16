<template>
  <div>
    <div class="PageTop">
      <div class="searchClass">
        <el-input size="mini" placeholder="请输入应用名称以搜索"
          ><el-button class="search" icon="el-icon-search" size="mini" slot="append"></el-button
        ></el-input>
      </div>
      <el-button class="addClass" size="mini" type="primary">新增</el-button>
    </div>
    <el-table :data="TableData.slice((CurrentPage - 1) * pagesize, CurrentPage * pagesize)" style="font-size: 12px; color: black">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="应用名称" prop="AppName" width="300px">
        <template slot-scope="scope">
          <a href="#" style="text-decoration: none">{{ scope.row.AppName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="使用单位" prop="User" width="200px"></el-table-column>
      <el-table-column label="强制更新" prop="Update" width="200px"></el-table-column>
      <el-table-column label="设备类型" prop="EquipType" width="200px"></el-table-column>
      <el-table-column label="版本号" prop="AppVersion" width="120px"></el-table-column>
      <el-table-column label="发布时间" prop="Date" width="200px"></el-table-column>
      <el-table-column label="下载页面" prop="Download">
        <a href="#" style="text-decoration: none">下载页面</a>
      </el-table-column>
      <el-table-column label="操作" prop="Operation">
        <a href="#" style="text-decoration: none">停用</a>
      </el-table-column>
    </el-table>

    <el-pagination
      class="Page"
      background
      layout="prev, pager, next"
      :total="TableData.length"
      :page-size="pagesize"
      :current-page="CurrentPage"
      @current-change="handleChange"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppRelease extends Vue {
  CurrentPage = 1
  pagesize = 1
  TableData = [
    {
      AppName: '长沙市自然资源和规划执法监察巡查核查系统',
      User: '长沙市自然资源和规划执法监察支队',
      Update: '否',
      EquipType: 'Android',
      AppVersion: 44,
      Date: '2020-11-09 15:42:30',
    },
  ]
  handleChange(val: number) {
    // eslint-disable-next-line no-console
    console.log(val)
    this.CurrentPage = val
  }
}
</script>

<style scoped>
.PageTop {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.searchClass {
  display: flex;
  width: 300px;
}

.addClass:hover {
  background: rgb(8, 9, 85);
}

.Page {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
</style>
