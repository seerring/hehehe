// pages/cartSubpackage/pages/addAds/addAds.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: '',//选择地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var arr = e.detail.value;
    console.log(arr)
    var arr1 = arr[0];
    var arr2 = arr[1];
    var arr3 = arr[2];
    var region = arr1 + ' ' + arr2 + ' ' + arr3;
    this.setData({
      region: region,
    })
    // console.log(this.data.region)
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