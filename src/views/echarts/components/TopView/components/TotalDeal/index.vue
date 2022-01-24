<template>
  <div>
    <CommonSale title="交易用户数" :count="usersTotal | numberFormat">
      <template #main>
        <v-chart :options="getOptions()"></v-chart>
      </template>
      <template #footer>
        <div class="footer">
          <div class="left">
            <span>日同比</span>
            <span class="count">{{ userGrowthLastDay }}</span>
            <div :class="userGrowthLastDay > 0 ? 'down' : 'up'"></div>
          </div>
          <div class="right">
            <span>日同比</span>
            <span class="count">{{ userGrowthLastMonth }}</span>
            <div :class="userGrowthLastMonth > 0 ? 'down' : 'up'"></div>
          </div>
        </div>
      </template>
    </CommonSale>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TotalDeal',
  methods: {
    getOptions() {
      return {
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        },

        xAxis: {
          type: 'value',
          show: false,
          min: 0,
          max: this.usersTotal,
        },

        yAxis: {
          type: 'category',
          show: false,
        },

        tooltip: {},

        series: {
          name: '月增长量',
          type: 'bar',
          data: [this.usersTotal - this.usersLastMonth],
          barWidth: '30%',
          showBackground: '#f0f0f0',

          label: {
            show: true,
            formatter: '|',
            position: 'right',
            distance: 60,
          },
        },
        color: 'hotpink',
      }
    },
  },
  computed: {
    ...mapState({
      /**
       * "//4": "累计用户数",
  "usersTotal": 1177965,
  "usersLastDay": 1000000,
  "usersLastMonth": 800000,
  "userGrowthLastDay": "17.70",
  "userGrowthLastMonth": "47.12",
       */
      usersTotal: state => state.mock.echartsData.usersTotal,
      usersLastDay: state => state.mock.echartsData.usersLastDay,
      usersLastMonth: state => state.mock.echartsData.usersLastMonth,
      userGrowthLastDay: state => state.mock.echartsData.userGrowthLastDay,
      userGrowthLastMonth: state => state.mock.echartsData.userGrowthLastMonth,
    }),
  },
}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  .left,
  .right {
    display: flex;
    font-size: 12px;
  }
  .count {
    margin: 0 5px;
  }
}
</style>
