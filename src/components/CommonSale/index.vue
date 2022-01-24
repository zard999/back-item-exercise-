<template>
  <el-card>
    <!-- 头部：后期主要是写标题和数字 -->
    <div class="header">
      <div class="title">{{ title }}</div>
      <div class="count">{{ count }}</div>
    </div>

    <!-- 后期主要是专门画图 -->
    <div class="main">
      <slot name="main"></slot>
    </div>

    <!-- 分割线 -->
    <div class="line"></div>

    <!-- 底部的文字 -->
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CommonSale',
  props: ['title', 'count'],
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.header {
  .title {
    font-size: 12px;
    color: #aaa;
  }
  .count {
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 1px;
  }
}
.main {
  width: 100%;
  height: 50px;
}
.line {
  height: 2px;
  background-color: #aaa;
  margin: 10px 0;
}
.footer {
  font-size: 12px;
  color: #666;
}
</style>
