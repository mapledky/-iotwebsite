<template>
  <div class="ClickBox">
    <h4 style="text-align: left">热门访问(TOP10)</h4>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class HotClick extends Vue {}
</script>

<style scoped>
.ClickBox {
  width: 50%;
  height: 100%;
  /* background: pink; */
}
</style>
