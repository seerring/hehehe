// pages/mySubpackage/pages/disCoupon/disCoupon.js
const hostUrl = require('../../../../config').hostUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false, //加载中
    isAllShow: false, //是否展示全部
    paged: 1, //当前页数
    list: [
      //    { disMoney: '20', fullReduct: '300减20', vaildDate: '2018.11.11至2018.11.26' ,status:1}
    ] //优惠券列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取优惠券列表
    this.getcouponlist();
  },
  //获取优惠券列表
  getcouponlist: function() {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var oid = wx.getStorageSync('oid');
    console.log(oid);
    console.log(uid);
    console.log("paged:" + that.data.paged);
    wx.request({
      url: hostUrl + '/storecoupon',
      data: {
        'uid': uid,
        'oid': oid,
        'paged': that.data.paged,
      },
      method: 'GET',
      success: function(result) {
        //console.log(result.data);
        //console.log("优惠卷内容");
        var res = result.data;
        if (res.code == 1) {
          var proNum = that.data.paged;
          that.setData({
            paged: ++proNum,
          })
          var arr = res.data;
          arr.forEach(item => {
            that.data.list.push(item);
          })
          that.setData({
            list: that.data.list,
          })
          //console.log(that.data.list);
        }
      },
      complete: function() {
        that.setData({
          loadingHidden: true
        })

      }
    })
  },
  // //查看更多
  // moreFun: function() {
  //   var that = this;

  //   wx.showLoading({
  //     title: '加载中',
  //   })

  //   setTimeout(() => {
  //     wx.hideLoading();
  //     that.setData({
  //       isAllShow: true,
  //     })
  //   }, 1000)
  //   //获取优惠券列表
  //   that.getcouponlist();

  // },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.setData({
      loadingHidden: false,
    });
    that.getcouponlist();
  },
})