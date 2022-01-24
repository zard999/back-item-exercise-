<template>
  <div class="saleContainer">
    <div class="content">
      <TopView></TopView>
      <MiddleView></MiddleView>
      <BottomView></BottomView>
    </div>
  </div>
</template>

<script>
import TopView from './components/TopView'
import MiddleView from './components/MiddleView'
import BottomView from './components/BottomView'
export default {
  name: 'Echarts',
  mounted() {
    this.getEchartsData()
  },
  methods: {
    getEchartsData() {
      this.$store.dispatch('getData')
    },
  },
  components: {
    TopView,
    MiddleView,
    BottomView,
  },
}
</script>

<style lang="scss" scoped>
.saleContainer {
  padding: 10px;
  background-color: #999;
  .content {
    padding: 20px;
  }
}
</style>
