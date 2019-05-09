<template>
  <div>
    <Form  v-show="showform"   :label-width="400">
      <FormItem label="开始日期">
        <Row>
          <Col span="11">
            <FormItem >
              <Date-picker
                @on-change="handleChange"
                type="daterange"
                format="yyyy-MM-dd"
                placeholder="请选择时间段"
                placement="bottom-end">
              </Date-picker>
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="物品类型">
        <i-select   clearable  @on-change="typebutton" >
          <i-option v-for="item in types"  :key="item.id" :value="item.id">
            {{ item.label }}
          </i-option>
        </i-select>
      </FormItem>
      <FormItem label="物品">
        <i-select  clearable   @on-change="matebutton"  >
          <i-option v-for="item in materials"  :key="item.id" :value="item.id" >
            {{ item.label }}
          </i-option>
        </i-select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">查询</Button>
      </FormItem>
    </Form>
    <Form v-show="!showform"   :label-width="80">
      <FormItem label="订单总支出">
        <Icon type="md-thumbs-up" />
        {{allprice}}元
      </FormItem>
      <FormItem>
        <Table :columns="columns" :data="data"></Table>
      </FormItem>
      <FormItem>
        <Page :total="allpage" show-total="true" @on-change="pagchange"/>
        <Button @click="returnback">返回上一层</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'inquiry',
  components: {},
  data () {
    return {
      time: null,
      types: [
        {
          id: 'A',
          label: '菜品原料'
        },
        {
          id: 'B',
          label: '消耗品'
        }
      ],
      currenttype: null,
      materials: [],
      currentmate: null,
      allpage: 0,
      showform: true,
      allprice: null,
      columns: [
        {
          title: '物品名',
          key: 'name'
        },
        {
          title: '数量',
          key: 'count'
        },
        {
          title: '支出',
          key: 'price'
        },
        {
          title: '创建时间',
          key: 'time'
        }
      ],
      data: [],
      showarray: []
    }
  },
  methods: {
    ...mapActions([
      'getMaterial',
      'getMateFlow'
    ]),
    typebutton (arg) {
      if (arg != null && this.currenttype !== arg) {
        this.getMaterial(arg).then(res => {
          this.materials = res
          this.currenttype = arg
        })
      }
    },
    matebutton (arg) {
      this.currentmate = arg
    },
    handleSubmit () {
      var time = this.time
      this.getMateFlow({ time: time, id: this.currentmate, page: null }).then(res => {
        this.allpage = res.count
        this.data = res.page
        this.showarray[0] = res.page
        this.allprice = res.price
        this.showform = false
      })
    },
    pagchange (index) {
      var id = index - 1
      if (this.showarray[index] == null) {
        this.getMateFlow({ time: this.time, id: this.currentmate, page: id }).then(res => {
          this.showarray[index] = res.page
          this.data = res.page
        })
      } else {
        this.data = this.showarray[index]
      }
    },
    returnback () {
      this.allpage = 0
      this.data = []
      this.allprice = 0
      this.showarray = []
      this.showform = true
    },
    handleChange (daterange) {
      if (daterange === ',') {
        daterange = null
      }
      this.time = daterange
    }
  }
}
</script>
