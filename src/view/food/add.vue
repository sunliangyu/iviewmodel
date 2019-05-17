<template>
  <Card shadow>
    <row>
      <i-select  :model.sync="model1" style="width:200px" filterable @on-change="selectbutton" clearable="true">
        <i-option v-for="item in foodClass"  :key="item.id" :value="item.id">
          {{ item.label }}
        </i-option>
      </i-select>
    </row>
    <div :style="divstyle">
      <br>
      <Form ref="addFood" :model="addFood" :rules="ruleValidate" :label-width="80">
        <FormItem label="菜名" prop="name">
          <Input v-model="addFood.name" placeholder="请输入菜名"></Input>
        </FormItem>
        <FormItem label="价格" prop="price">
          <Input v-model="addFood.price"  type="number" placeholder="请输入价格"></Input>
        </FormItem>
        <FormItem label="描述" prop="desc">
          <Input v-model="addFood.desc" type="textarea"  placeholder="请输入描述"></Input>
        </FormItem>
        <FormItem label="耗费时间" prop="cost">
          <Input v-model="addFood.cost" type="number"  placeholder="请输入耗费"></Input>
        </FormItem>
        <FormItem label="原料" prop="food">
          <i-select  :model.sync="model1" style="width:200px" filterable @on-change="selectmater" clearable="true">
            <i-option v-for="item in material"  :key="item.id" :value="item">
              {{ item.label }}
            </i-option>
          </i-select>
          <Input v-model="currentcount" type="number"  placeholder="请输入数量"></Input>
          <Button type="primary" @click="addmate()">增加原料</Button>
          <Table :columns="columns1" :data="data1"></Table>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('addFood')">提交</Button>
        </FormItem>
      </Form>
      <br>
    </div>
  </Card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'add',
  data () {
    return {
      foodClass: [
      ],
      material: [],
      model1: '',
      divshow: 1,
      des: null,
      divstyle: 'display:none',
      index: 1,
      currentma: null,
      currentclass: null,
      currentcount: null,
      currentname: null,
      addFood: {
        name: '',
        price: '',
        cost: '',
        need: [],
        desc: ''
      },
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Count',
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
      ruleValidate: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        price: [
          { required: true, message: 'price cannot be empty', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: 'Desc cannot be empty', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: 'Cost cannot be empty', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'checkName',
      'getfoodClass',
      'getMaterial',
      'addFoods'
    ]),
    selectbutton (ids) {
      this.currentclass = ids
      this.divstyle = 'display:'
    },
    remove (index) {
      this.data1.splice(index, 1)
      this.addFood.need.splice(index, 1)
      this.currentcount = null
    },
    selectmater (item) {
      alert(item.id)
      this.currentma = item.id
      this.currentname = item.label
    },
    addmate () {
      if (this.currentcount <= 0) {
        alert('数量必须大于0')
      } else {
        var leng = this.addFood.need.length
        var boolea = true
        for (var i = 0; i < leng; i++) {
          if (this.addFood.need[i].id == this.currentma) {
            boolea = false
            break
          }
        }
        if (boolea) {
          this.data1.push({ name: this.currentname, count: this.currentcount })
          this.addFood.need.push({ id: this.currentma, count: this.currentcount, name: this.currentname })
        } else {
          alert('原料已经添加')
        }
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          var type = this.currentclass
          var food = this.addFood
          this.addFoods({ food, type }).then(() => {
            this.currentma = null
            this.data1 = []
            this.$Message.success(this.addFood.name + '添加成功!')
            this.addFood.need = []
            this.addFood.name = null
            this.addFood.desc = null
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  },
  created () {
    this.getfoodClass().then(res => {
      this.foodClass = res
      this.getMaterial('A').then(res => {
        this.material = res
      })
    })
  }
}
</script>

<style scoped>

</style>
