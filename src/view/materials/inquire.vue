<template>
  <Card shadow>
    <row>
      <i-select :model.sync="model1" style="width:200px" filterable @on-change="test">
        <i-option v-for="item in cityList"  :key="item.id" :value="item.id">
          {{ item.label }}
        </i-option>
      </i-select>
      <i-select :model.sync="model1" style="width:200px" filterable>
        <i-option v-for="item in cityLista"  :key="item.id" :value="item.id">
          {{ item.label }}
        </i-option>
      </i-select>
    </row>
    <div :style="divstyle">
      <br>
      <i-form  label-position="top">
        <Form-item label="物品名">
          <i-input readonly=true value="只读" id="edit1"></i-input>
        </Form-item>
        <Form-item label="物品描述">
          <i-input  readonly=true value="可编辑" id="edit2"></i-input>
        </Form-item>
        <Form-item   label="物品数量">
          <i-input readonly=true id="edit3"></i-input>
        </Form-item>
        <Form-item label="物品保质期">
          <i-input readonly=false id="edit4"></i-input>
        </Form-item>
      </i-form>
      <br>
      <row>
        <i-button type="primary" disabled="true">Primary</i-button>
        <i-button type="primary" disabled="true" id="button1">Primary</i-button>
      </row>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'inquire',
  data () {
    return {
      cityList: [
        {
          id: 'beijing',
          label: '北京市'
        },
        {
          id: 'shanghai',
          label: '上海市'
        },
        {
          id: 'shenzhen',
          label: '深圳市'
        },
        {
          id: 'hangzhou',
          label: '杭州市'
        },
        {
          id: 'nanjing',
          label: '南京市'
        },
        {
          id: 'chongqing',
          label: '重庆市'
        }
      ],
      model1: '',
      cityLista: [],
      divstyle: 'display:none'
    }
  },
  methods: {
    test (ids) {
      this.cityLista.push({ id: ids, label: ids },
        { id: '2', label: '2' })
      this.divstyle = 'display:'
      document.getElementById('edit1').readonly = false
      document.getElementById('button1').disabled = false
    }
  }
}
</script>

<style scoped>

</style>
