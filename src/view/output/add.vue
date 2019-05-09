<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <FormItem label="类型" prop="type">
      <i-select  v-model="formValidate.type"  @on-change="typebutton" >
        <i-option v-for="item in types"  :key="item.id" :value="item.id">
          {{ item.label }}
        </i-option>
      </i-select>
    </FormItem>
    <FormItem label="物品" prop="mate">
      <i-select  v-model="formValidate.mate"  >
        <i-option v-for="item in materials"  :key="item.id" :value="item" >
          {{ item.label }}
        </i-option>
      </i-select>
    </FormItem>
    <FormItem label="数量" prop="number">
      <Input v-model="formValidate.number" type="number" placeholder="请输入数量"></Input>
    </FormItem>
    <FormItem label="价格" prop="price">
      <Input v-model="formValidate.price" type="number" placeholder="请输入耗费"></Input>
    </FormItem>
    <FormItem label="备注" prop="remark">
      <Input v-model="formValidate.remark" placeholder="请输入备注"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'add',
  data: function () {
    return {
      formValidate: {
        type: '',
        mate: null,
        number: '',
        price: '',
        remark: ''
      },
      ruleValidate: {
        type: [
          { required: true, message: 'Please select the type', trigger: 'change' }
        ],
        number: [
          { required: true, message: 'The number cannot be empty', trigger: 'blur' }
        ],
        price: [
          { required: true, message: 'The price cannot be empty', trigger: 'blur' }
        ]
      },
      currenttype: null,
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
      materials: []
    }
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getMaterial',
      'addoutflow'
    ]),
    handleSubmit: function (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formValidate.mate == null) {
            this.$Message.error('输入不完整!')
          } else {
            this.addoutflow({ id: this.formValidate.mate.id, name: this.formValidate.mate.label, count: this.formValidate.number, price: this.formValidate.price, remark: this.formValidate.remark }).then(res => {
              this.$Message.success('Success!')
              this.handleReset('formValidate')
              this.currenttype = null
              this.materials = []
            })
          }
        } else {
          this.$Message.error('输入不完整!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    typebutton (arg) {
      if (arg != null && this.currenttype !== arg) {
        this.getMaterial(arg).then(res => {
          this.materials = res
          this.currenttype = arg
        })
      }
    }
  },
  mounted () {
  }
}
</script>
