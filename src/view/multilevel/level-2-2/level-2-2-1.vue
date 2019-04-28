<template>
  <div>
    <h3>多级菜单 -> 二级-2 -> 3级1</h3>
    <Input v-model="val" style="width: 200px"></Input>
    <Button  @click="testcliek" type="primary">testbutton1</Button>
  </div>
</template>
<script>
import { getToken } from '../../../libs/util'

export default {
  name: 'level_2_2_1',
  data () {
    return {
      val: ''
    }
  },
  methods: {
    testcliek () {
      var test = this.$store.state.user.unreadCount
      this.$store.state.user.unreadCount = 7
      test = this.$store.state.user.unreadCount
      alert('this.$store.state.user.unreadCount777:' + test)
      var token = getToken()
      // this.$axios.get(this.HOME + '/?fr=hmpage').then(res => {
      //   console.log(res)
      // }).catch(e => { console.log(e) })
      this.$axios({
        url: 'http://localhost:8762/user/test',
        method: 'post',
        dataType: 'jsonp',
        // data: JSON.stringify({ 'username': 'sly', 'password': '123' }),
        headers: { 'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
          'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
          'token': token
        }
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
