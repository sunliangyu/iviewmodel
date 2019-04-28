<template>
  <Card shadow>
    <div>
      <div class="message-page-con message-category-con">
        <Menu width="auto" active-name="unread" @on-select="handleSelect">
          <MenuItem name="unread">
            <span class="category-title">新订单</span><Badge style="margin-left: 10px" :count="orderUnreadCount"></Badge>
          </MenuItem>
          <MenuItem name="receive">
            <span class="category-title">今天已接订单</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="orderReceiveCount"></Badge>
          </MenuItem>
          <MenuItem name="refuse">
            <span class="category-title">今天已拒订单</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="orderRefuseCount"></Badge>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-list-con">
        <Spin fix v-if="listLoading" size="large"></Spin>
        <Menu
          width="auto"
          active-name=""
          :class="titleClass"
          @on-select="handleView"
        >
          <MenuItem  v-for="item in messageList" :name="item.msg_id" :key="`msg_${item.msg_id}`">
            <div>
              <p class="msg-title">{{ item.title }}</p>
              <Button
                style="float: right;margin-right: 10px;"
                :style="{ display: item.loading ? 'inline-block !important' : '' }"
                :loading="item.loading"
                size="small"
                title="接单"
                type="success"
                v-show="currentMessageType === 'unread'"
                @click.native.stop="receiveOrder(item)">
                <Icon type="ios-arrow-forward"></Icon>
                接单
              </Button>
              <Button
                style="float: left;margin-left: 10px;"
                :style="{ display: item.loading ? 'inline-block !important' : '' }"
                :loading="item.loading"
                size="small"
                title="拒单"
                type="error"
                v-show="currentMessageType === 'unread'"
                @click.native.stop="refuseOrder(item)">
                <Icon type="ios-arrow-back"></Icon>拒单
              </Button>
            </div>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-view-con">
        <Spin fix v-if="contentLoading" size="large"></Spin>
        <div class="message-view-header">
          <h2 class="message-view-title">{{ showingMsgItem.title }}</h2>
          <time class="message-view-time">{{ showingMsgItem.create_time }}</time>
        </div>
        <div v-html="messageContent"></div>
      </div>
    </div>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getRes, getToken } from '../../../libs/util'
const listDic = {
  unread: 'orderUnreadList',
  receive: 'orderReceiveList',
  refuse: 'orderRefuseList'
}
export default {
  name: 'order_page',
  data () {
    return {
      listLoading: true,
      contentLoading: false,
      currentMessageType: 'unread',
      messageContent: '',
      showingMsgItem: {}
    }
  },
  computed: {
    ...mapState({
      orderUnreadList: state => state.user.orderUnreadList,
      orderReceiveList: state => state.user.orderReceiveList,
      orderRefuseList: state => state.user.orderRefuseList,
      messageList () {
        return this[listDic[this.currentMessageType]]
      },
      titleClass () {
        return {
          'not-unread-list': this.currentMessageType !== 'unread'
        }
      }
    }),
    ...mapGetters([
      'orderUnreadCount',
      'orderReceiveCount',
      'orderRefuseCount'
    ])
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getOrders',
      'hasRead',
      'receiveOrders',
      'refuseOrders',
      'rceiveText',
      'getOrderById'
    ]),
    stopLoading (name) {
      this[name] = false
    },
    handleSelect (name) {
      this.currentMessageType = name
    },
    handleView (msg_id) {
      this.contentLoading = true
      var resid = getRes()
      var token = getToken()
      alert('userid:' + userid + 'token:' + token)
      this.getOrderById({ msg_id, resid, token }).then(content => {
        this.messageContent = content
        const item = this.messageList.find(item => item.msg_id === msg_id)
        if (item) this.showingMsgItem = item
        this.stopLoading('contentLoading')
      }).catch(() => {
        this.stopLoading('contentLoading')
      })
    },
    receiveOrder (item) {
      item.loading = true
      const msg_id = item.msg_id
      const operate = '1'
      alert(item.toString() + '1')
      this.rceiveText(msg_id, operate)
    },
    refuseOrder (item) {
      const operate = '2'
      item.loading = true
      const msg_id = item.msg_id
      this.rceiveText(msg_id, operate)
    }
  },
  mounted () {
    this.listLoading = true
    // 请求获取消息列表
    this.listLoading = false
  }
}
</script>

<style lang="less">
  .message-page{
    &-con{
      height: ~"calc(100vh - 176px)";
      display: inline-block;
      vertical-align: top;
      position: relative;
      &.message-category-con{
        border-right: 1px solid #e6e6e6;
        width: 200px;
      }
      &.message-list-con{
        border-right: 1px solid #e6e6e6;
        width: 230px;
      }
      &.message-view-con{
        position: absolute;
        left: 446px;
        top: 16px;
        right: 16px;
        bottom: 16px;
        overflow: auto;
        padding: 12px 20px 0;
        .message-view-header{
          margin-bottom: 20px;
          .message-view-title{
            display: inline-block;
          }
          .message-view-time{
            margin-left: 20px;
          }
        }
      }
      .category-title{
        display: inline-block;
        width: 65px;
      }
      .gray-dadge{
        background: gainsboro;
      }
      .not-unread-list{
        .msg-title{
          color: rgb(170, 169, 169);
        }
        .ivu-menu-item{
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
            display: none;
          }
          &:hover{
            .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
