// pages/mySubpackage/pages/refundList/refundList.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',//用户ID
    paged: 1,//页数
    list: [],//退款列表
    // scrollWatch: true, //是否监听
    // types: ['ios-small'],
    isLoadMore: false,//加载更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      uid: wx.getStorageSync("uid")
    })
    //获取退款列表
    that.getRefundList();
  },
  //获取退款列表
  getRefundList() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var data = {
      uid: that.data.uid,
      paged: that.data.paged,
      order_type: 2,
      oid: app.globalData.oid,
    }
    wx.request({
      url: hostUrl + '/storeorder',
      method: 'GET',
      data: data,
      success: function (res) {
        var res = res.data;
        console.log(res)
        if (res.code == 1 && res.data.list != '') {
          var page = that.data.paged
          that.setData({
            paged: ++page,
          })
          console.log(that.data.paged)
          var arr = res.data.list;
          arr.forEach(item => {
            that.data.list.push(item);
          })
          that.data.list.forEach(item => {
            var totalSum = 0;
            var totalPrice = 0;
            item.order_info.forEach(item2 => {
              item.totalSum = totalSum += parseInt(item2.num)
              item.totalPrice = ((totalPrice += item2.num * item2.product_fact_price) - item.coupon_price).toFixed(2)
            })
          })
          that.setData({
            list: that.data.list,
            isLoadMore: true,
            scrollWatch: true,
          })
          console.log(that.data.list)
          console.log(that.data.list[0].order_info)
        } else {
          that.setData({
            isLoadMore: false,
            scrollWatch: false
          })
         }
      }
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.getRefundList()
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  },

})