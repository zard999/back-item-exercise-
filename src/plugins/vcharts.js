import Vue from 'vue'
// import echarts from 'echarts'
import * as echarts from 'echarts'
import ECharts from 'vue-echarts'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VePie from 'v-charts/lib/pie.common'

Vue.prototype.$echarts = echarts
Vue.component('v-chart', ECharts)

Vue.component(VeLine.name, VeLine)
Vue.component(VeHistogram.name, VeHistogram)
Vue.component(VePie.name, VePie)
