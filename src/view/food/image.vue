<template>
  <div>
    <div v-show="divshow">
      <row>
        <i-select  style="width:200px" filterable @on-change="classbutton" >
          <i-option v-for="item in foodclass"  :key="item.id" :value="item.id">
            {{ item.label }}
          </i-option>
        </i-select>
        <i-select  style="width:200px"    v-model="currentfood" filterable >
          <i-option v-for="item in foods"  :key="item.id" :value="item.id">
            {{ item.name }}
          </i-option>
        </i-select>
        <Button type="primary" @click="inquiry()">查询</Button>
      </row>
    </div>
    <div v-show="!divshow">
      <div class="demo-upload-list" v-for="item in uploadList">
        <template v-if="item.status === 'finished'">
          <img :src= "'http://localhost:8779/image/' + item.url ">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        :headers="headers"
        multiple
        type="drag"
        action="http://localhost:5000/file/file/image"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
      <Modal title="View Image" v-model="visible">
        <img :src="'http://localhost:8779/image/' + imgName " v-if="visible" style="width: 100%">
      </Modal>
      <Modal
        v-model="modal1"
        title="警告"
        ok-text="保存"
        @on-ok="oksave"
        cancel-text="忽略保存"
        @on-cancel="nosave"
      >
        数据未保存
      </Modal>
      <row>
        <Button type="primary" @click="saved()">保存</Button>
        <Button type="primary" @click="reback()">返回上一级</Button>
      </row>
    </div>
  </div>
</template>
<script>
import { getToken } from '../../libs/util'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      defaultList: [
      ],
      imgName: '',
      visible: false,
      uploadList: [],
      headers: {
        'token': getToken()
      },
      foodclass: null,
      foods: null,
      currentfood: null,
      currentclass: null,
      add: [],
      delete: [],
      modal1: false,
      divshow: true
    }
  },
  methods: {
    ...mapActions([
      'getFoodsByClass',
      'getfoodClass',
      'getImage',
      'alertImage'
    ]),
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      var l = true
      var i = 0
      var len = this.add.length
      for (;i < len; i++) {
        if (this.add[i] === file.url) {
          this.add.splice(i, 1)
          l = false
        }
      }
      if (l) {
        this.delete.push(file.url)
      }
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      var url = res.url
      if (url != null) {
        file.url = url
        file.name = url
        this.add.push(url)
        console.log('uploadList')
        console.log(this.uploadList)
        console.log('uploadList')
        console.log(this.uploadList)
      } else {
        this.$Message.warning('上传失败')
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 3
      if (!check) {
        this.$Notice.warning({
          title: '对多发送3张图片'
        })
      }
      return check
    },
    classbutton (id) {
      if (id != null && this.currentclass !== id) {
        this.getFoodsByClass({ type: id }).then(res => {
          this.foods = res
          this.currentclass = id
        })
      }
    },
    reback () {
      if (this.add.length !== 0 || this.delete.length !== 0) {
        this.modal1 = true
      } else {
        this.divshow = true
      }
    },
    inquiry: function () {
      var len = this.$refs.upload.fileList.length
      if (len !== 0) {
        this.$refs.upload.fileList.splice(0, len)
      }
      this.uploadList.splice(0, this.uploadList.length)
      this.getImage(this.currentfood).then(res => {
        var i = 0
        var len = res.length
        this.defaultList = res
        for (; i < len; i++) {
          this.uploadList.push({ 'name': res[i], 'url': res[i], 'status': 'finished' })
        }
        this.divshow = false
      })
    },
    saved () {
      if (this.add.length === 0 && this.delete.length === 0) {
        this.$Message.warning('数据没有修改')
      } else {
        var add = null
        var deletes = null
        if (this.add.length > 0) {
          add = this.add
        }
        if (this.delete.length > 0) {
          deletes = this.delete
        }
        this.alertImage({ 'id': this.currentfood, add, deletes }).then(() => {
          this.$Message.success('保存成功')
          this.add = []
          this.delete = []
          alert('ad' + this.add.length)
          alert('delete' + this.delete.length)
          var len = this.$refs.upload.fileList.length
          this.$refs.upload.fileList.splice(0, len)
        })
      }
    },
    oksave () {
      this.modal1 = false
      var add = null
      var deletes = null
      if (this.add.length > 0) {
        add = this.add
      }
      if (this.delete.length > 0) {
        deletes = this.delete
      }
      this.alertImage({ 'id': this.currentfood, add, deletes }).then(() => {
        this.$Message.success('保存成功')
        this.add = []
        this.delete = []
        var len = this.$refs.upload.fileList.length
        this.$refs.upload.fileList.splice(0, len)
      })
    },
    nosave () {
      this.defaultList = null
      var len = this.$refs.upload.fileList.length
      this.$refs.upload.fileList.splice(0, len)
      this.add = []
      this.delete = []
      this.modal1 = false
      this.$Message.warning('你忽略了修改')
      this.divshow = true
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
    this.getfoodClass().then(res => {
      this.foodclass = res
    })
  },
  created () {
  }
}
</script>
<style>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
