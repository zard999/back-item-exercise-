<template>
  <div :style="{ width, height }"></div>
</template>

<script>
import Echarts from 'echarts'
import 'echarts/theme/macarons'
export default {
  name: 'LineChart',
  props: {
    width: {
      type: String,
      default: '100%'
    },

    height: {
      type: String,
      default: '350px'
    },
    chartData: {
      type: Object,
      default: {}
    },
    yTittle: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      myChart: null
    }
  },

  watch: {
    chartData: {
      handler(newVal) {
        // 第二次设置配置项（数据过来之后）
        this.setOption(newVal)
      }
    }
  },

  mounted() {
    this.myChart = Echarts.init(this.$el, 'macarons')
    this.setOption(this.chartData)
  },

  methods: {
    setOption({ expectedData = [], actualData = [] }) {
      this.myChart.setOption({
        //提示
        tooltip: {},

        // 控制图片大小在容器的位置
        grid: {
          left: 20,
          right: 20,
          top: 40,
          bottom: 20,
          containLabel: true
        },

        //图例
        legend: {
          data: ['期望', '实际']
        },
        //x坐标轴
        xAxis: {
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          boundaryGap: false //x轴是否两遍不留白，和边缘重合
        },
        //y坐标轴，一般不写，最多写个y名称
        yAxis: {
          name: this.yTittle
        },

        //系列  （图例和系列是配套的）
        series: [
          {
            name: '期望', //和图例对应的
            type: 'line', //决定了图的样子  是柱状图还是线状图还是饼状图
            data: expectedData, //对应的是图的数据
            itemStyle: {
              color: 'red'
            },
            lineStyle: {
              width: 4 //只能修改线的颜色宽度等等
            }
          },
          {
            name: '实际',
            type: 'line',
            data: actualData,
            itemStyle: {
              color: 'blue'
            },
            lineStyle: {
              width: 4
            },
            areaStyle: {
              color: 'hotpink'
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped></style>
