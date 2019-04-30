<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { mapMutations, mapActions } from 'vuex'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  data () {
    return {
      dom: null,
      value: {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0
      },
      text: '最近七天订单变化图',
      subtext: ''
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getBar'
    ])
  },
  created () {
  },
  mounted () {
    this.getBar().then(res => {
      this.value.Mon = res[0]
      this.value.Tue = res[1]
      this.value.Wed = res[2]
      this.value.Thu = res[3]
      this.value.Fri = res[4]
      this.value.Sat = res[5]
      this.value.Sun = res[6]
      this.$nextTick(() => {
        let xAxisData = Object.keys(this.value)
        let seriesData = Object.values(this.value)
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          xAxis: {
            type: 'category',
            data: xAxisData
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: seriesData,
            type: 'bar'
          }]
        }
        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
