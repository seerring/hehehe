
// pages/mySubpackage/pages/verGoods/verGoods.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',//当前用户id
    paged: 1,//当前页数
    list: [],//订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      that.setData({
        uid: wx.getStorageSync("uid")
      })
      that.getHxOrderList()
  },
  //获取核销订单列表
  getHxOrderList() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var data = {
      uid: that.data.uid,
      paged: that.data.paged,
      order_type: 1,
      oid: app.globalData.oid,
    }
    wx.request({
      url: hostUrl + '/storeorder',
      method: "GET",
      data: data,
      success: function (res) {
        console.log(res.data)
        var res = res.data
        if (res.code == 1 && res.data != '') {
          var page = that.data.paged
          that.setData({
            paged: ++page,
          })
          console.log(that.data.paged)
          console.log(that.data.list)
          var arr = res.data;
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
            isLoadMore:true,
            scrollWatch:true,
          })
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
    that.getHxOrderList()
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  },
})