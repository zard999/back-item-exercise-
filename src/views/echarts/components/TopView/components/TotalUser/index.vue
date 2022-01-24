<template>
  <div>
    <CommonSale title="累积用户数" :count="orderUser | numberFormat">
      <template #main>
        <v-chart autoresize :options="getOptions()"></v-chart>
      </template>
      <template #footer>
        <span class="leftText">退货率</span>
        <span>{{ returnRate }}</span>
      </template>
    </CommonSale>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TotalUser',
  methods: {
    getOptions() {
      return {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },

        xAxis: {
          show: false,
          data: this.orderUserTrendAxis,
        },

        yAxis: {
          show: false,
        },

        tooltip: {
          trigger: 'axis',
        },

        series: {
          name: '实时用户数',
          type: 'bar',
          data: this.orderUserTrend || [],
          barWidth: '50%',
        },
        color: 'green',
      }
    },
  },
  computed: {
    ...mapState({
      /**
       * "//3": "今日交易用户数",
  "orderUser": 182425,
  "returnRate": 5.91,
  "orderUserTrend": [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290, 330, 150],
  "orderUserTrendAxis": ["00:00", "01:00", 
       */
      orderUser: state => state.mock.echartsData.orderUser,
      returnRate: state => state.mock.echartsData.returnRate,
      orderUserTrend: state => state.mock.echartsData.orderUserTrend,
      orderUserTrendAxis: state => state.mock.echartsData.orderUserTrendAxis,
    }),
  },
}
</script>

<style></style>
