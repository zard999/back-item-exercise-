<template>
  <div class="middleContainer">
    <el-card>
      <div class="header">
        <div class="menu">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="1">销售额</el-menu-item>

            <el-menu-item index="2">访问量</el-menu-item>
          </el-menu>
        </div>
        <div class="radio">
          <el-radio-group v-model="radio1">
            <el-radio-button label="今日"></el-radio-button>
            <el-radio-button label="本周"></el-radio-button>
            <el-radio-button label="本月"></el-radio-button>
            <el-radio-button label="今年"></el-radio-button>
          </el-radio-group>
        </div>

        <div class="date">
          <el-date-picker
            v-model="dateDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </div>

      <div class="main">
        <el-row :gutter="10">
          <el-col :span="18">
            <LeftView :activeIndex="activeIndex"></LeftView>
          </el-col>
          <el-col :span="6">
            <RightView :activeIndex="activeIndex"></RightView>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import LeftView from './components/LeftView'
import RightView from './components/RightView'
export default {
  name: 'MiddleView',
  data() {
    return {
      activeIndex: '1',
      radio1: '本周',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      dateDate: [],
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
    },
  },

  components: {
    LeftView,
    RightView,
  },
}
</script>

<style lang="scss" scoped>
.middleContainer {
  margin: 20px 0;
  .header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #999;
    .menu {
      flex: 1;
      .el-menu--horizontal {
        border-bottom: none;
      }
      .leftContent {
        width: 100%;
        height: 350px;
      }
    }
    .radio {
      margin-right: 20px;
    }
  }
}
</style>
