// pages/mySubpackage/pages/communicate/communicate.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        sid: '',
        uid:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      console.log("Communicate加载参数↓")
      console.log(options.id)
        var that = this;
        var uid = wx.getStorageSync("uid");
        var clickId = wx.getStorageSync("clickId");
        console.log("用户uid", uid);
        console.log("门店sid", clickId);
      if (options.id){
        that.setData({
          sid: options.id,
          uid: uid
        })
      }else{
        that.setData({
          sid: clickId,
          uid: uid
        })
      }
    }
})