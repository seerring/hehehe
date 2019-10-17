// pages/mySubpackage/pages/refundDes/refundDes.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      id: '',//当前退款订单id
      orderDes: {},//订单信息
      list:'',//上传凭证
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
         var id = options.id;
         var that = this;
         that.setData({
              id: id,
         })
         //获取退款订单信息
        that.getRefundDes()
    },
    //获取退款订单信息
    getRefundDes() {
      var that = this;
      var data = that.data.id;
      wx.request({
        url: hostUrl + '/storeorder/'+data,
        method: 'GET',
        data: '',
        success: function (res) {
          var res = res.data
          that.setData({
            orderDes: res.data,
            list: res.data.proof_img
          })
          var totalSum = 0;
          var totalPrice = 0;
          that.data.orderDes.order_info.forEach(item => {
            item.totalSum = totalSum += parseInt(item.num)
            item.totalPrice = ((totalPrice += item.num * item.product_fact_price) - that.data.orderDes.coupon_price).toFixed(2)
          })
          that.setData({
            orderDes: that.data.orderDes,
          })
        }
      })
    },
    //凭证图片
    enlarge(e){
      var that = this;
      var index = e.currentTarget.dataset.index;
      wx.previewImage({
        current: that.data.list[index], // 当前显示图片的http链接
        urls: that.data.list ,// 需要预览的图片http链接列表
        success: function (res) {
        }
      })
    },
})