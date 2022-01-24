<template>
  <div class="topViewContainer">
    <el-row :gutter="10">
      <el-col :span="6">
        <TodaySale></TodaySale>
      </el-col>
      <el-col :span="6">
        <TodayOrder></TodayOrder>
      </el-col>
      <el-col :span="6">
        <TotalUser></TotalUser>
      </el-col>
      <el-col :span="6">
        <TotalDeal></TotalDeal>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TodaySale from './components/TodaySale'
import TodayOrder from './components/TodayOrder'
import TotalUser from './components/TotalUser'
import TotalDeal from './components/TotalDeal'
export default {
  name: 'TopView',
  components: {
    TodaySale,
    TodayOrder,
    TotalUser,
    TotalDeal,
  },
}
</script>
<style lang="scss">
.leftText {
  margin-right: 5px;
}
.up {
  border: 5px solid transparent;
  border-top-color: green;
}
.down {
  border: 5px solid transparent;
  border-bottom-color: red;
}
</style>
