// pages/mySubpackage/pages/paymentDes/paymentDes.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getDes: {},//当前明细基本信息
    id:"",//当前明细id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      id: options.id,
      // uid: wx.getStorageSync("uid")
    })
    //获取当前明细基本信息
    that.paymentDes();
  },
  //获取当前明细基本信息
  paymentDes() {
    var that = this;
    var data = that.data.id;
    wx.request({
      url: hostUrl + '/detailed/'+ data,
      data: "",
      method: 'GET',
      success: function (result) {
        var res = result.data;
        console.log(res);
        if (res.code == 1) {
          that.setData({
            getDes: res.data,
          })
        }
      },
    })    
  },

})