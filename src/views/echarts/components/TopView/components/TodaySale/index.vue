<template>
  <div>
    <CommonSale title="今日销售额" :count="salesToday | moneyFormat">
      <template #main>
        <div class="main">
          <div class="top">
            <span>日同比</span>
            <span class="count">{{ salesGrowthLastDay }}</span>
            <div :class="salesGrowthLastDay > 0 ? 'down' : 'up'"></div>
          </div>
          <div class="bottom">
            <span>月同比</span>
            <span class="count">{{ salesGrowthLastMonth }}</span>
            <div :class="salesGrowthLastMonth > 0 ? 'down' : 'up'"></div>
          </div>
        </div>
      </template>
      <template #footer>
        <span class="leftText">昨日销售额</span>
        <span>{{ salesLastDay | moneyFormat }}</span>
      </template>
    </CommonSale>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TodaySale',

  computed: {
    /**
     * "//1": "今日销售额",
  "salesToday": 30346799,
  "salesLastDay":   36000000,
  "salesGrowthLastDay": -19.16,
  "salesGrowthLastMonth": 56.67,
     */
    ...mapState({
      salesToday: state => state.mock.echartsData.salesToday,
      salesLastDay: state => state.mock.echartsData.salesLastDay,
      salesGrowthLastDay: state => state.mock.echartsData.salesGrowthLastDay,
      salesGrowthLastMonth: state =>
        state.mock.echartsData.salesGrowthLastMonth,
    }),
  },
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 12px;
  font-weight: bold;
  color: #666;
  .count {
    margin: 0 5px;
  }
  .top,
  .bottom {
    display: flex;
    align-items: center;
  }
}
</style>
