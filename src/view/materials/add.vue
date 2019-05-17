<template>
  <Card shadow>
    <row>
      <i-select :model.sync="model1" style="width:200px" filterable @on-change="selectbutton" clearable="true">
        <i-option v-for="item in cityList"  :key="item.id" :value="item.id">
          {{ item.label }}
        </i-option>
      </i-select>
    </row>
    <div :style="divstyle">
      <br>
      <i-form  label-position="top" >
        <Form-item label ="物品名">
          <i-input v-model="name" ></i-input>
        </Form-item>
        <Form-item   label="物品数量">
          <i-input v-model="count"></i-input>
        </Form-item>
        <Form-item label="物品保质期">
          <i-input v-model="save"></i-input>
        </Form-item>
      </i-form>
      <br>
      <row>
        <i-button type="primary"   @click="savebutton">添加</i-button>
      </row>
    </div>
  </Card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'add',
  data () {
    return {
      cityList: [
        {
          id: 'A',
          label: '菜品原料'
        },
        {
          id: 'B',
          label: '消耗品'
        }
      ],
      model1: '',
      currenttype: null,
      count: 0,
      save: 0,
      divshow: 1,
      name: null,
      divstyle: 'display:none'
    }
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'checkName',
      'saveMaterial'
    ]),
    selectbutton (ids) {
      if (ids != null) {
        this.name = null
        this.count = 0
        this.save = 0
        this.divstyle = 'display:'
        this.currenttype = ids
      }
    },
    savebutton () {
      var name = this.name.trim()
      var type = this.currenttype
      var count = this.count
      var save = this.save
      if (name == null || name === '') {
        alert('name 不能为空')
      } else {
        this.checkName({ name, type }).then(res => {
          if (res === false) {
            alert(name + '已经使用，请重新填写')
            this.name = null
          } else {
            this.saveMaterial({ name, type, count, save }).then(res => {
              this.$Message.success('保存成功')
              this.name = null
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
