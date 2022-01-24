<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <SearchView></SearchView>
      </el-col>
      <el-col :span="12">
        <RankView></RankView>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SearchView from './components/SearchView'
import RankView from './components/RankView'
export default {
  name: 'BottomView',
  components: {
    RankView,
    SearchView
  }
}
</script>

<style></style>
