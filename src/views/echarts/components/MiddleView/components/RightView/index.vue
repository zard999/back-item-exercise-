<template>
  <div>
    <div class="title">
      {{ activeIndex === '1' ? '门店销售额排名' : '门店用户排名' }}
    </div>
    <div class="item" v-for="(item, index) in rank" :key="item.no">
      <div class="no" :class="index < 3 && 'active'">{{ item.no }}</div>
      <div class="name">{{ item.name }}</div>
      <div class="count">{{ item.count }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'RightView',
  props: ['activeIndex'],
  computed: {
    ...mapState({
      orderRank: state => state.mock.echartsData.orderRank,
      userRank: state => state.mock.echartsData.userRank,
    }),

    rank() {
      const { activeIndex, orderRank, userRank } = this
      return activeIndex === '1' ? orderRank : userRank
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  margin-top: 50px;
}
.item {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin: 10px 0;
  .no {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    &.active {
      background-color: #000;
      color: #fff;
    }
  }
  .name {
    width: 100px;
    margin-left: 10px;
  }
}
</style>
