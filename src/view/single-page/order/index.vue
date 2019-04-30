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
              <Badge status="default" :text="item.create_time" />
            </div>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-view-con"   v-show=" display ===  true ">
        <Spin fix v-if="contentLoading" size="large"></Spin>
        <div class="message-view-header">
          <h2 class="message-view-title">{{ showingMsgItem.title }}</h2>
          <time class="message-view-time">{{ showingMsgItem.create_time }}</time>
        </div>
        <div>{{ messageContent.location }}</div>
        <div>共计{{ messageContent.people }}人用餐</div>
        <div>价格总计{{ messageContent.price }}元</div>
        <div>菜品：{{messageContent.foods}} </div>
        <div v-show=" messageContent.reason != null">
          拒绝理由{{messageContent.reason}}
        </div>
        <br> <br> <br> <br> <br>
        <div v-show="currentMessageType === 'unread'  "   >
          <Button
            style="float: right;margin-right: 10px;"
            :style="{ display: showingMsgItem.loading ? 'inline-block !important' : '' }"
            :loading="showingMsgItem.loading"
            size="small"
            title="接单"
            type="success"
            @click.native.stop="receiveOrder(showingMsgItem)">
            <Icon type="ios-arrow-forward"></Icon>
            接单
          </Button>
          <Button
            style="float: left;margin-left: 10px;"
            :style="{ display: showingMsgItem.loading ? 'inline-block !important' : '' }"
            :loading="showingMsgItem.loading"
            size="small"
            title="拒单"
            type="error"
            @click.native.stop="modal6 = true">
            <Icon type="ios-arrow-back"></Icon>拒单
          </Button>
          <Modal
            v-model="modal6"
            title="请填写拒绝理由"
            @on-ok="refuseOrder(showingMsgItem)"
            @on-cancel="cancel">
            <Input v-model="refusereason" placeholder="Enter something..." style="width: 300px" />
          </Modal>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
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
      messageContent: {},
      showingMsgItem: {},
      display: false,
      modal6: false,
      refusereason: ''
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
      'getOrderContentByMsgId'
    ]),
    stopLoading (name) {
      this[name] = false
    },
    handleSelect (name) {
      this.display = false
      this.currentMessageType = name
    },
    handleView (msg_id) {
      this.contentLoading = true
      this.display = true
      this.getOrderContentByMsgId(msg_id).then(content => {
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
      this.receiveOrders(msg_id)
      item.loading = false
      this.display = false
    },
    refuseOrder (item) {
      const reason = this.refusereason
      item.loading = true
      const msg_id = item.msg_id
      this.refuseOrders({ msg_id, reason })
      item.loading = false
      this.display = false
    }
  },
  mounted () {
    this.listLoading = true
    this.getOrders().then(() => this.stopLoading('listLoading')).catch(() => this.stopLoading('listLoading'))
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
