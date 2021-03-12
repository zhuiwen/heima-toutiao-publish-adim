<template>
  <div class="fans-container">
    <map-demo></map-demo>
    <bmap-demo></bmap-demo>
  </div>
</template>

<script>
import mapDemo from './componets/map-demo'
import BmapDemo from './componets/bmap-demo'
export default {
  components: {
    mapDemo, // 百度地图结合echarts
    BmapDemo // 纯粹的百度地图
  }
}
</script>

<style>

</style>
