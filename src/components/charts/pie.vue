<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import { mapMutations, mapActions } from 'vuex'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  data () {
    return {
      dom: null,
      value: [
        { value: 0, name: ' 到店订单' },
        { value: 0, name: ' 外卖订单' }
      ],
      text: '用户订单来源',
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
      'getpie'
    ])
  },
  mounted () {
    this.getpie().then(res => {
      this.value[0].value = res.in
      this.value[1].value = res.out
      this.$nextTick(() => {
        let legend = this.value.map(_ => _.name)
        let option = {
          title: {
            text: this.text,
            subtext: this.subtext,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: legend
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.value,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
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
