// pages/mySubpackage/pages/systemUpdate/systemUpdate.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemList:[],
    uid: '',//用户ID
    oid:'',//商家id

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      uid: wx.getStorageSync("uid"),
      oid: app.globalData.oid,    //商家ID
    })
    that.getsystemList()
  },
  //获取列表
  getsystemList() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var data = {
      uid: that.data.uid,
      app_version: '2.1.2',
      msg_type: 2,
      oid: app.globalData.oid,
    }
    wx.request({
      url: hostUrl + '/versions',
      method: 'GET',
      data: data,
      success: function (res) {
        var res = res.data;
        console.log(res)
       
          that.setData({
            systemList: res.data.version_message,
          })
      }
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
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