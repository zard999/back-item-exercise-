<template>
  <div>
    <CommonSale title="今日订单" :count="orderToday | numberFormat">
      <template #main>
        <v-chart autoresize :options="getOptions()"></v-chart>
      </template>
      <template #footer>
        <span class="leftText">昨日订单量</span>
        <span>{{ orderLastDay | numberFormat }}</span>
      </template>
    </CommonSale>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TodayOrder',
  methods: {
    getOptions() {
      return {
        grid: {
          left: 5,
          right: 5,
          top: 0,
          bottom: 0,
        },

        xAxis: {
          data: this.orderTrendAxis,
          show: false,
        },

        yAxis: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
        },
        series: {
          name: '实时订单数',
          type: 'line',
          data: this.orderTrend,
          itemStyle: {
            opacity: 0,
            color: 'red',
          },
          lineStyle: {
            opacity: 0,
          },
          smooth: true,
          areaStyle: {
            color: 'hotpink',
          },
        },
      }
    },
  },
  computed: {
    ...mapState({
      /**
       * "//2": "今日订单量",
  "orderToday": 2562061,
  "orderLastDay": 2100000,
  "orderTrend": [610, 432, 220, 534, 790, 430, 220, 320, 532, 320, 834, 690, 530, 220],
  "orderTrendAxis": ["00:00", "01:00", "02:
       */
      orderToday: state => state.mock.echartsData.orderToday,
      orderLastDay: state => state.mock.echartsData.orderLastDay,
      orderTrend: state => state.mock.echartsData.orderTrend,
      orderTrendAxis: state => state.mock.echartsData.orderTrendAxis,
    }),
  },
}
</script>

<style></style>
