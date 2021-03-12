<template>
  <div>
    <h2>纯粹的百度地图示例</h2>
    <div class="bmap" id="bmap"></div>
  </div>
</template>

<script>
export default {
  name: 'BmapDemo',
  mounted() {
    // 创建地图实例
    const map = new window.BMap.Map('bmap')
    // 设置中心点坐标
    const point = new window.BMap.Point(116.404, 39.915)
    // 地图初始化，同时设置地图缩放级别
    map.centerAndZoom(point, 15)
  }
}
</script>

<style scoped lang='less'>
.bmap {
  width: 800px;
  height: 600px;
  border: 1px solid #000;
}
</style>
