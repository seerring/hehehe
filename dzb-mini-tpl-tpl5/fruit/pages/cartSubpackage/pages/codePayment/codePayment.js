// pages/cartSubpackage/pages/codePayment/codePayment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputvalues:"",
    rechargeList:[
      { price1: 100.00, price2:5.00},
      { price1: 200.00, price2: 15.00 },
      { price1: 300.00, price2: 25.00 },
    ],
    memberList:[
      { name: "黄金会员", member1: "会员折扣9.8折", member2:"每月专属礼包30元"},
      { name: "铂金会员", member1: "会员折扣9.0折", member2: "每月专属礼包50元" },
      { name: "钻石会员", member1: "会员折扣8.5折", member2: "每月专属礼包80元" },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  inputValue(e) {
    var that = this;
    var v1 = e.detail.value;
    // var v2 = parseFloat(v1).toFixed(2)
    this.setData({
      inputvalues: v1
    })

    console.log(that.data.inputvalues)
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