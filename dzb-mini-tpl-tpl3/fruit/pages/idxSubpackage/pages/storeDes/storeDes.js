// indexPackage/pages/storeDes/storeDes.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      loadingHidden: false,//加载中
      id: '',//当前门店ID
      swiperList: [],//轮播图
      imgArr: [],//营业执照
      storeInfo: []//门店基本信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      that.setData({
        loadingHidden: true,
        id: options.id,
      })
      //获取门店详情
      that.getDetail()
    },

    //获取门店详情
    getDetail() {
      var that = this;
      var params = that.data.id
      wx.request({
        url: hostUrl + '/store/' + params,
        method: "GET",
        data: '',
        success: function (res) {
          if (res.data.code == 1) {
            that.setData({
              storeInfo: res.data.data,
              swiperList: res.data.data.img,
              imgArr: res.data.data.license,
            })
          }
        }

      })
    },

})