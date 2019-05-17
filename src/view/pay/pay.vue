<template>
  <div>
    <Form v-show="showform" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="方式" prop="type">
        <Select v-model="formValidate.type" placeholder="请选择查询方式">
          <Option value="A">订单号查询</Option>
          <Option value="B">客户号查询</Option>
          <Option value="C">桌号查询</Option>
        </Select>
      </FormItem>
      <FormItem label="值" prop="number">
        <Input v-model="formValidate.number" placeholder="请输入查询值"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">查询</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
    <Form v-show="!showform"   :label-width="80">
      <FormItem  >
        订单号: {{currentId}}    创建时间: {{createtime}}     客户号: {{client}}                 位置: {{location}}
      </FormItem>
      <FormItem  >
        <Table :columns="columns" :data="data"></Table>
      </FormItem>
      <FormItem >
        价格总计 {{allprice}}元
      </FormItem>
      <Modal
        v-model="modal6"
        title="请选择付款方式"
        @on-ok="pay"
        @on-cancel="cancel">
        <Select v-model="payflag" placeholder="请选择付款方式">
          <Option value="true">在线支付</Option>
          <Option value="false">现金支付</Option>
        </Select>
      </Modal>
      <FormItem  v-show="buttonshow">
        <Button @click="paybutton">收款</Button>
      </FormItem>
      <FormItem  v-show="!buttonshow">
        已付款 付款方式：{{paymethod}}
      </FormItem>
      <FormItem>
        <Button @click="returnback">返回上一层</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'pay',
  components: {},
  data () {
    return {
      time: null,
      showform: true,
      allprice: null,
      client: null,
      buttonshow: true,
      paymethod: null,
      payflag: 'true',
      location: null,
      currentId: null,
      createtime: null,
      modal6: false,
      columns: [
        {
          title: '菜名',
          key: 'name'
        },
        {
          title: '数量',
          key: 'count'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '备注',
          key: 'de'
        }
      ],
      data: [],
      formValidate: {
        number: '',
        type: ''
      },
      ruleValidate: {
        number: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Please select the type', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'inquiryOrder',
      'topay'
    ]),
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          var id = this.formValidate.number.trim()
          this.inquiryOrder({ type: this.formValidate.type, id: id }).then(res => {
            var status = res.status
            if (status == null) {
              this.data = res.food
              this.allprice = res.price
              this.client = res.client
              this.location = res.location
              this.createtime = res.time
              this.currentId = res.id
              var paym = res.paym
              this.showform = false
              if (paym !== 'a') {
                this.buttonshow = false
                if (paym == 'b') {
                  this.paymethod = '在线支付'
                } else {
                  this.paymethod = '现金支付'
                }
              } else {
                this.buttonshow = true
              }
            } else {
              this.$Message.warning(status)
            }
          })
        } else {
          this.$Message.error('输入错误!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    returnback () {
      this.data = []
      this.allprice = 0
      this.showform = true
    },
    pay () {
      var payflag
      if (this.payflag === 'true') {
        payflag = true
      } else {
        payflag = false
      }
      this.topay({ id: this.currentId, pay: payflag, price: this.allprice }).then(res => {
        this.$Message.success('收款成功')
        this.returnback()
      })
    },
    cancel () {
      this.$Message.warning('你取消的收款')
      this.modal6 = false
      this.returnback()
    },
    paybutton () {
      this.modal6 = true
    }
  }
}
</script>
