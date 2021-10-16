<template>
  <div class="box">
    <h4 style="text-align: left">最新异常(最近10条)</h4>
    <table class="TableHead">
      <thead>
        <tr style="display: flex">
          <th style="flex: 1">应用名称</th>
          <th style="flex: 1">设备类型</th>
          <th style="flex: 1">应用类别</th>
          <th style="flex: 1">异常发生时间</th>
        </tr>
      </thead>
    </table>
    <table class="TableBody">
      <tbody>
        <tr>
          <td>一站式规划管理服务平台基础版</td>
          <td>IOS</td>
          <td>Pad</td>
          <td>2018-09-29 17:59:10</td>
        </tr>
        <tr>
          <td>一站式规划管理服务平台基础版</td>
          <td>IOS</td>
          <td>Pad</td>
          <td>2018-09-29 17:59:10</td>
        </tr>
        <tr>
          <td>一站式规划管理服务平台基础版</td>
          <td>IOS</td>
          <td>Pad</td>
          <td>2018-09-29 17:59:10</td>
        </tr>
        <tr>
          <td>一站式规划管理服务平台基础版</td>
          <td>IOS</td>
          <td>Pad</td>
          <td>2018-09-29 17:59:10</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class NewError extends Vue {}
</script>

<style scoped>
.box {
  width: 50%;
  /* padding-left: 10px;
  
  padding-right: 10px; */
  height: 100%;
  /* background: blue; */
}

.TableHead {
  height: 20%;
  width: 100%;
  /* background: #f0f0f0; */
}

.TableBody {
  height: 80%;
  width: 100%;
}

.TableBody {
  display: block;
  text-align: center;
  height: 200px;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /*滚动更流畅*/
}

.table_info table thead,
.TableBody tr {
  display: table;
  width: 100%;
  height: 60px;
  table-layout: fixed;
  border-bottom: 1px solid #e0e0e0;
}

.TableBody td {
  flex: 1;
}

.table_info table thead {
  /* background-color: #004453; */
  /* width: calc(100% - 6px); */ /*减去默认滚动条的宽度，让thead 与tbody 对齐*/
}
</style>
