<template>
  <div>
    <Form  v-show="showform"   >
      <FormItem label="菜单">
        <i-select   clearable  style="width:180px" @on-change="typebutton" >
          <i-option v-for="item in foods"  :key="item.id" :value="item.id">
            {{ item.label }}
          </i-option>
        </i-select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">查询</Button>
      </FormItem>
    </Form>
    <Form v-show="!showform"   :label-width="80">
      <FormItem label="菜品总量">
        <Icon type="md-thumbs-up" />
        {{allsum}}份
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
  name: 'ready',
  components: {},
  data () {
    return {
      foods: [],
      currentfood: null,
      showform: true,
      columns: [
        {
          title: '菜单名',
          key: 'name'
        },
        {
          title: '数量',
          key: 'count'
        },
        {
          title: '创建时间',
          key: 'time'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '打包(Y/N)',
          key: 'flag'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(params.index)
                  }
                }
              }, '制作完成')
            ])
          }
        }
      ],
      data: [],
      showarray: [],
      allpage: 0,
      allsum: 0,
      currentpage: 0
    }
  },
  methods: {
    ...mapActions([
      'getFoods',
      'getcodepage',
      'updateorder'
    ]),
    handleSubmit () {
      this.getcodepage({ id: this.currentfood, page: null, status: 'b' }).then(res => {
        this.data = res.code
        this.allpage = res.count
        this.allsum = res.sum
        this.showform = false
        this.showarray[0] = res.code
        this.currentpage = 0
      })
    },
    typebutton (index) {
      this.currentfood = index
    },
    pagchange (index) {
      var id = index - 1
      this.currentpage = id
      if (this.showarray[id] == null) {
        this.getcodepage({ id: this.currentfood, page: id, status: 'b' }).then(res => {
          this.showarray[id] = res.code
          this.data = res.code
        })
      } else {
        this.data = this.showarray[id]
      }
    },
    returnback () {
      this.allpage = 0
      this.data = []
      this.showarray = []
      this.currentpage = null
      this.showform = true
    },
    edit (index) {
      var id = this.data[index].food
      var order = this.data[index].id
      this.updateorder({ id, order, status: 'c' }).then(() => {
        this.showarray = []
        this.$Message.success('制作成功')
        this.allsum = this.allsum - this.data[index].count
        if (this.allpage === 11) {
          this.pagchange(1)
        } else {
          this.allpage = this.allpage - 1
          this.data.splice(index, 1)
        }
      })
    }
  },
  mounted () {
    this.getFoods().then(res => {
      this.foods = res
    })
  }
}
</script>
