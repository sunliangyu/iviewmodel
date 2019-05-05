<template>
  <Card shadow>
    <row v-show="div1">
      <i-select :model.sync="model1" style="width:200px" filterable @on-change="selectbutton" clearable="true">
        <i-option v-for="item in foodclass"  :key="item.id" :value="item.id">
          {{ item.label }}
        </i-option>
      </i-select>
      <Table :columns="columns1" :data="data1"></Table>
      <Modal
        v-model="modal2"
        title="确定删除该条数据吗？"
        @on-ok="ok"
        @on-cancel="cancel">
        <p>{{this.currentfood}}</p>
      </Modal>
    </row>
    <div v-show="!div1">
      <br>
      <i-form  label-position="top" >
        <Form-item label ="菜单名字">
          <i-input v-model="newname"></i-input>
        </Form-item>
        <Form-item   label="描述">
          <i-input v-model="newdesc"></i-input>
        </Form-item>
        <Form-item label="耗时">
          <i-input v-model="newcost" type="number" ></i-input>
        </Form-item>
        <Form-item label="价格">
          <i-input v-model="newprice" type="number" ></i-input>
        </Form-item>
        <Table :columns="columns2" :data="data2"></Table>
        <Modal
          v-model="modal3"
          title="请输入原料"
          @on-ok="saveadd"
          @on-cancel="cancel">
          <p>
            <i-select  :model.sync="model1" style="width:200px" filterable @on-change="selectmater" clearable="true">
              <i-option v-for="item in material"  :key="item.id" :value="item">
                {{ item.label }}
              </i-option>
            </i-select>
            <Input v-model="inputcount" type="number"  placeholder="请输入数量"></Input>
          </p>
        </Modal>
        <Button type="primary" @click="addmate()">增加原料</Button>
      </i-form>
      <br>
      <row>
        <i-button type="primary"    id="savebutton" @click="savebutton">保存</i-button>
        <i-button type="primary"     @click="returnback">返回</i-button>
      </row>
    </div>
  </Card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'update',
  data () {
    return {
      foodclass: [
      ],
      currentfood: null,
      model1: '',
      deletefood: [],
      addfood: [],
      name: null,
      price: null,
      cost: null,
      desc: null,
      currenttype: null,
      newname: null,
      newcost: null,
      newdesc: null,
      newprice: null,
      currentitem: null,
      modal2: false,
      div1: true,
      allfood: null,
      modal3: false,
      inputitm: null,
      inputcount: 0,
      material: null,
      columns1: [
        {
          title: 'Id',
          key: 'id'
        },
        {
          title: 'Name',
          key: 'name'
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
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data1: [
      ],
      columns2: [
        {
          title: '原料',
          key: 'name'
        },
        {
          title: '数量',
          key: 'count'
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
                    this.foodremove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data2: [
      ]
    }
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getFoodsByClass',
      'getFoodById',
      'getfoodClass',
      'deleteFoodById',
      'getMaterial',
      'updateFood'
    ]),
    selectbutton (type) {
      if (type != null && type !== this.currenttype) {
        this.currenttype = type
        this.getFoodsByClass({ type }).then(res => {
          this.data1 = res
        })
      }
    },
    edit (index) {
      this.div1 = false
      var id = this.data1[index].id
      this.name = this.data1[index].name
      this.currentitem = this.data1[index].id
      this.getFoodById(id).then(res => {
        this.cost = res.cost
        this.price = res.price
        this.desc = res.des
        this.newname = this.name
        this.newcost = this.cost
        this.newprice = this.price
        this.newdesc = this.desc
        this.data2 = res.need
      })
    },
    remove (index) {
      this.currentfood = this.data1[index].name
      this.modal2 = true
      this.currentitem = index
    },
    ok () {
      var index = this.currentitem
      var id = this.data1[index].id
      this.deleteFoodById({ id }).then(() => {
        this.data1.splice(index, 1)
        this.$Message.success('数据删除成功')
        this.modal2 = false
      })
    },
    addmate () {
      this.modal3 = true
      if (this.material == null) {
        this.getMaterial('A').then(res => {
          this.material = res
        })
      }
    },
    savebutton () {
      if (this.name == this.newname && this.cost == this.newcost && this.price == this.newprice  && this.desc == this.newdesc  && this.deletefood.length === 0 && this.addfood.length === 0) {
        this.$Message.warning('数据没有修改')
      } else {
        var name = this.newname
        var des = this.newdesc
        var price = this.newprice
        var cost = this.newcost
        var add = this.addfood
        var dfood = this.deletefood
        var id = this.currentitem
        this.updateFood({ name, des, price, cost, add, dfood, id }).then(res => {
          this.$Message.success('数据保存成功')
          this.addfood = []
          this.deletefood = []
          this.div1 = true
        }
        )
      }
    },
    foodremove (index) {
      var id = this.data2[index].id
      this.data2.splice(index, 1)
      this.deletefood.push(id)
    },
    saveadd () {
      if (this.inputcount <= 0) {
        this.$Message.warning('数量不能小于0')
      } else if (this.inputitm === null) {
        this.$Message.warning('食材不能为空')
      } else {
        var bo = true
        var i = 0
        var len = this.data2.length
        var id = this.inputitm.id
        for (; i < len; i++) {
          if (this.data2[i].id == id) {
            this.$Message.warning('原料已经存在')
            bo = false
            break
          }
        }
        if (bo) {
          var name = this.inputitm.label
          var count = this.inputcount
          this.data2.push({ 'name': name, 'count': count, 'id': id })
          this.addfood.push({ 'name': name, 'count': count, 'id': id })
        }
      }
    },
    selectmater (item) {
      if (item != null) {
        this.inputitm = item
      }
    },
    returnback () {
      this.addfood = []
      this.deletefood = []
      this.div1 = true
    }
  },
  created () {
    this.getfoodClass().then(res => {
      this.foodclass = res
    })
  }
}
</script>

<style scoped>

</style>
