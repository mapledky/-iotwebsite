<template>
  <div>
    <el-table :data="TableData.slice((CurrentPage - 1) * pagesize, CurrentPage * pagesize)" style="font-size: 12px; color: black">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="异常简介" prop="ErrorInform" width="300px">
        <template slot-scope="scope">
          <a href="#" style="text-decoration: none">{{ scope.row.ErrorInform }}</a>
        </template>
      </el-table-column>
      <el-table-column label="异常类型" prop="ErrorType" width="90px"></el-table-column>
      <el-table-column label="设备类型" prop="EquipType" width="200px"></el-table-column>
      <el-table-column label="应用名称" prop="AppName" width="120px"></el-table-column>
      <el-table-column label="应用类别" prop="AppType" width="200px"></el-table-column>
      <el-table-column label="应用版本" prop="AppVersion"></el-table-column>
      <el-table-column label="异常发生时间" prop="ErrorTime"></el-table-column>
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
export default class ErrorLog extends Vue {
  CurrentPage = 1
  pagesize = 1
  TableData = [
    {
      ErrorInform: 'NSInvalidArgumentException -[__NSCFConstantString count]: unrecognized selector sent to instance 0x101430090',
      ErrorType: '应用级别',
      EquipType: 'IOS',
      AppName: '一站式规划管理服务平台基础版',
      AppType: 'Pad',
      AppVersion: 'version:1.4; build:5; com.xxzx.SampleGuiHua',
      ErrorTime: '2018-09-29 17:59:10',
    },
    {
      ErrorInform: 'NSInvalidArgumentException -[__NSCFConstantString count]: unrecognized selector sent to instance 0x101430090',
      ErrorType: '应用级别',
      EquipType: 'IOS',
      AppName: '一站式规划管理服务平台基础版',
      AppType: 'Pad',
      AppVersion: 'version:1.4; build:5; com.xxzx.SampleGuiHua',
      ErrorTime: '2018-09-29 17:09:10',
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
</style>
