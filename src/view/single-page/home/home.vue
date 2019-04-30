<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row  :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" ></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周订单量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '今日总订单数', icon: 'md-person-add', count: 0, color: '#19be6b' },
        { title: '今日收入金额', icon: 'md-help-circle', count: 0, color: '#ff9900' },
        { title: '今日已接订单', icon: 'md-share', count: 0, color: '#ed3f14' },
        { title: '今日已拒订单', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
        { title: '今日未处理订单', icon: 'md-map', count: 0, color: '#9A66E4' }
      ],
      barData: {
      },
      hasread: false
    }
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getHome'
    ])
  },
  created () {
    if (!this.hasread) {
      this.getHome().then(res => {
        this.inforCardData[0].count = res.all
        this.inforCardData[1].count = res.count
        this.inforCardData[2].count = res.receive
        this.inforCardData[3].count = res.refuse
        this.inforCardData[4].count = res.nodo
      })
    }
  },
  mounted () {

    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
