<template>
  <Card shadow>
    <row>
      <i-select :model.sync="model1" style="width:200px" filterable @on-change="selectbutton" clearable="true">
        <i-option v-for="item in cityList"  :key="item.id" :value="item.id">
          {{ item.label }}
        </i-option>
      </i-select>
      <i-select :model.sync="model1" style="width:200px"  @on-change="selectbutt"  filterable clearable="true">
        <i-option v-for="item in cityLista"  :key="item.id" :value="item">
          {{ item.label }}
        </i-option>
      </i-select>
      <Modal
        v-model="modal2"
        title="确定删除该条数据吗？"
        @on-ok="ok"
        @on-cancel="cancel">
        <p>{{this.name}}</p>
      </Modal>
    </row>
    <div :style="divstyle">
      <br>
      <i-form  label-position="top" v-show="divshow === 1">
        <Form-item label ="物品名">
          <i-input :value="this.name"  readonly=true></i-input>
        </Form-item>
        <Form-item   label="物品数量">
          <i-input :value="this.count" readonly=true></i-input>
        </Form-item>
        <Form-item label="物品保质期">
          <i-input :value="this.save" readonly=true></i-input>
        </Form-item>
      </i-form>
      <i-form  label-position="top" v-show="divshow === 0">
        <Form-item label ="物品名">
          <i-input v-model="newname"></i-input>
        </Form-item>
        <Form-item   label="物品数量">
          <i-input v-model="newcount"></i-input>
        </Form-item>
        <Form-item label="物品保质期">
          <i-input v-model="newsave"></i-input>
        </Form-item>
      </i-form>
      <br>
      <row>
        <i-button type="primary" disabled="true" id="savebutton" @click="savebutton">保存</i-button>
        <i-button type="primary"  id="button1"  @click="modelbutton()">修改</i-button>
        <i-button type="primary"  id="delete"  @click="deletebutton()">删除</i-button>
      </row>
    </div>
  </Card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'inquiry',
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
      cityLista: [],
      divstyle: 'display:none',
      currenttype: '',
      count: 0,
      save: 0,
      divshow: 1,
      newname: '',
      newcount: 0,
      newsave: 0,
      currentitem: null,
      name: '',
      modal2: false
    }
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getMaterial',
      'getSpecific',
      'alertMaterial',
      'deleteMaterial'
    ]),
    selectbutton (ids) {
      if (ids != null) {
        this.divstyle = 'display:none'
        this.getMaterial(ids).then(res => {
          this.cityLista = res
          this.currenttype = ids
        })
      }
    },
    selectbutt (item) {
      const ids = item.id
      document.getElementById('savebutton').disabled = true
      if (ids != null && (this.currentitem === null || item.id !== this.currentitem.id)) {
        this.newname = item.label
        this.name = item.label
        this.divshow = 1
        this.currentitem = item
        this.getSpecific(ids).then(res => {
          this.count = res.count
          this.save = res.save
          this.newcount = this.count
          this.newsave = this.save
        })
        this.divstyle = 'display:'
      }
    },
    modelbutton () {
      this.divshow = 0
      document.getElementById('savebutton').disabled = false
      document.getElementById('delete').disabled = true
    },
    savebutton () {
      if (this.name == this.newname && this.count == this.newcount && this.save == this.newsave) {
        this.$Message.warning('数据没有修改')
      } else {
        const id = this.currentitem.id
        const name = this.newname
        const count = this.newcount
        const save = this.newsave
        this.alertMaterial({ id, save, count, name }).then(res => {
          this.$Message.success('数据修改成功')
          this.name = this.newname
          this.count = this.newcount
          this.save = this.newsave
        }
        )
      }
    },
    deletebutton () {
      this.modal2 = true
    },
    ok () {
      var id = this.currentitem.id
      this.deleteMaterial({ id }).then(() => {
        this.$Message.success('数据删除成功')
        this.divstyle = 'display:none'
        this.deleteById(id)
      })
    },
    deleteById (id) {
      for (j = 0, len = this.cityLista.length; j < len; j++) {
        if (this.cityLista[j].id === id) {
          this.$set(this.cityLista, j, null)
          break
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
