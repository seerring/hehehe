// pages/mySubpackage/pages/memberRecord/memberRecord.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], //购买记录列表
    paged: 1, //分页
    types: ['ios-small'],
    isLoadMore: true,
  },

  // // 获取缓存等相关信息
  // getParams() {
  //   var that = this;
  //   that.data.uid = window.localStorage.getItem('uid');
  //   that.oid = that.$router.app.__proto__.$oid;
  //   // 获取购买记录列表
  //   that.recordList();
  // },
  //获取基本信息
  getParams() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
    that.setData({
      oid: app.globalData.oid,
      uid: wx.getStorageSync("uid")
    })
    console.log(that.data.oid)
    console.log(that.data.uid)

    that.recordList();
  },
  // 获取购买记录列表
  // recordList() {
  //   var that = this;
  //   var data = that.oid + '/edit?uid=' + that.uid;
  //   that.$api.buyRecord(data).then(res => {
  //     console.log(res);
  //     if (res.code == 1) {
  //       that.list = res.data;
  //     }
  //   })
  // },
  recordList() {
    var that = this;
    var data = {
      oid: that.data.oid,
      uid: that.data.uid,
    }
    wx.request({
      url: hostUrl + '/vip/' + data.oid + '/edit?uid=' + data.uid,
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          // that.list = res.data;
          that.setData({
            list:res.data.data
          })
          console.log(that.data.list)
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getParams()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that =this;
    wx.showToast({
      title: '无会员购买记录',
      icon:'none'
    })
    setTimeout(function(){
    if(that.data.list.length == 0){
      wx.navigateBack({
        url: '/pages/mySubpackage/pages/memberCharge/memberCharge',
      })
      }
    },1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})