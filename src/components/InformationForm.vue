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
      <el-table-column label="设备类型" prop="AppType" width="90px"></el-table-column>
      <el-table-column label="使用单位" prop="User" width="200px"></el-table-column>
      <el-table-column label="项目负责人" prop="AppPerson" width="120px"></el-table-column>
      <el-table-column label="许可证到期日期" prop="Date" width="200px"></el-table-column>
      <el-table-column label="下载页面" prop="Download">
        <template slot-scope="scope">
          <a href="#" style="text-decoration: none">{{ scope.row.Download }}</a>
        </template>
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
export default class InforForm extends Vue {
  CurrentPage = 1
  pagesize = 1
  TableData = [
    {
      AppName: '长沙市执法监察管理系统（iOS）',
      AppType: 'IOS',
      User: '长沙市',
      AppPerson: '张海',
      Date: '2023-09-28 00:00:00',
      Download: '下载页面',
    },
    {
      AppName: '韶关市自然资源一站式管理服务系统(Ipad)',
      AppType: 'IOS',
      User: '韶关',
      AppPerson: '王银彬',
      Date: '2021-09-24 00:00:00',
      Download: '下载页面',
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
.Page {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

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
</style>
