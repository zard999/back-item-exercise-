<template>
  <div class="leftContainer">
    <v-chart autoresize :options="getOptions()"></v-chart>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LeftView',
  props: ['activeIndex'],
  methods: {
    getOptions() {
      let {
        activeIndex,
        orderFullYearAxis,
        userFullYearAxis,
        orderFullYear,
        userFullYear,
      } = this
      return {
        title: {
          text: activeIndex === '1' ? '销售趋势' : '用户趋势',
          textStyle: {
            fontSize: 14,
          },
          left: 30,
          top: 20,
        },
        // grid: {
        //   left: 0,
        //   right: 0,
        //   top: 0,
        //   bottom: 0,
        // },

        xAxis: {
          data: activeIndex === '1' ? orderFullYearAxis : userFullYearAxis,
        },

        yAxis: {},

        tooltip: {},

        series: {
          name: '用户量',
          type: 'bar',
          data: activeIndex === '1' ? orderFullYear : userFullYear,
          barWidth: '50%',
        },
        color: 'hotpink',
      }
    },
  },
  computed: {
    ...mapState({
      /**
       * "//5": "销售额与访问量",
  "orderFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  "orderFullYear": [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290],
  "userFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  "userFullYear": [110, 120, 90, 220, 175, 212, 19
       */
      orderFullYearAxis: state => state.mock.echartsData.orderFullYearAxis,
      orderFullYear: state => state.mock.echartsData.orderFullYear,
      userFullYearAxis: state => state.mock.echartsData.userFullYearAxis,
      userFullYear: state => state.mock.echartsData.userFullYear,
    }),
  },
}
</script>

<style lang="scss" scoped>
.leftContainer {
  width: 100%;
  height: 350px;
}
</style>
