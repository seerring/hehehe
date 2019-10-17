// pages/idxSubpackage//pages/userMessage/userMessage.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',//当前用户id
    paged: 1,//消息页数
    msgList: [],//消息列表
    types: ['ios-small'],
    isLoadMore: false,//是否加载更多
  },

  onShow: function () {
    var that = this;
    that.setData({
      msgList:[],
      paged: 1,
    });
    that.getMsgList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      uid: wx.getStorageSync("uid"),
    });
    // that.getMsgList();
  },

  //获取消息列表
  getMsgList() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: hostUrl + '/storemessages',
      method: 'GET',
      data: {
        uid: that.data.uid,
        paged:that.data.paged,
        oid: app.globalData.oid,
      },
      success: function (res) {
        var res = res.data;
        if (res.code == 1 && res.data.list != '') {
          var proNum = that.data.paged;
          that.setData({
            paged: ++proNum,
          })
          var arr = res.data.list;
          arr.forEach(item => {
            that.data.msgList.push(item);
          })
          that.setData({
            isLoadMore: true,
            msgList: that.data.msgList,
          })
          console.log(arr)
        } else {
          that.setData({
            isLoadMore: false,
          })
        }
      }
    })

      setTimeout(() => {
        wx.hideLoading();
      }, 1000)
  },

  // 阅读消息详情
  readMsg: function(e){
    var that = this;
    console.log(e);
    if (!app.isLogin()) { return; }; //检测是否登录

    var id = e.currentTarget.dataset.id;
    var orderid = e.currentTarget.dataset.orderid;
    var orderstatus = e.currentTarget.dataset.orderstatus;
    var orderType = e.currentTarget.dataset.ordertype;

    console.log(orderid);
    console.log('测试orderstatus=====' + orderType)

    var params = orderid + '?read_id=' + id;

    wx.request({
      url: hostUrl + '/storeorder/' + params,
      method: 'GET',
      success: function (res) {
        console.log(res);
      }
      
    });

    if (orderType == 1 || orderType == 2){

      wx.navigateTo({
        url: '../../../mySubpackage/pages/orderDes/orderDes?id=' + orderid,
      })

    } else if (orderType == 3){

      wx.navigateTo({
        url: '../../../mySubpackage/pages/groupOrderDes/groupOrderDes?id=' + orderid,
      })

    } else if (orderstatus == 7 || orderstatus == 9 || orderstatus == 10){

      wx.navigateTo({
        url: '../../../mySubpackage/pages/refundDes/refundDes?id=' + orderid,
      })

    }


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading();
      // that.setData({
      //   isLoadMore: false,
      // })
    }, 1000)
    that.getMsgList();
  },

})