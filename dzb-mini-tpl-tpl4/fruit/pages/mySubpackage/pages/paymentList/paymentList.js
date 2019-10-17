// pages/mySubpackage/pages/paymentList/paymentList.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',//当前用户id
    oid: '', //商家id
    curIndex: 0,//tab选择
    list: [],//明细列表
    paged: 1,//页数
    // types: ['ios-small'],
    isLoadMore: false,//加载更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    that.setData({
      oid: app.globalData.oid,
      uid: wx.getStorageSync("uid")
    })
    if (wx.getStorageSync('orderIndex')) {
      that.setData({
        curIndex: parseInt(wx.getStorageSync('orderIndex')),
      })
      var a = {
        currentTarget: {
          dataset: {
            index: that.data.curIndex,
            paged: 1
          }
        }
      }
      //点击tab选择
      that.switchTabItem(a);
    }
    else {
      var a = {
        currentTarget: {
          dataset: {
            index: 0,
            paged:1
          }
        }
      }
      //点击tab选择
      that.switchTabItem(a);
    }
  },
  //点击tab选择 获取当前列表
  switchTabItem(e) {
    var index = e.currentTarget.dataset.index
    var paged = e.currentTarget.dataset.paged
    var that = this;
    if (paged) {
      that.setData({
        paged: paged,
      })
    } else {
      that.setData({
        paged: 1,
        list:[]
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    if (index) {
      var data = {
        oid: that.data.oid,
        uid: that.data.uid,
        status: index,
        paged: that.data.paged,
      }
      that.setData({
        curIndex: index,
      })
    }
    else {
      var data = {
        oid: that.data.oid,
        uid: that.data.uid,
        status: '',
        paged: that.data.paged,
      }
    }
    wx.request({
      url: hostUrl + '/detailed',
      data: data,
      success: function (res) {
        var res = res.data;
        if (res.code == 1 && res.data.length > 0) {
          var arr = res.data;

          if (that.data.paged > 1){
            arr.forEach(item => {
              that.data.list.push(item);
            })
            that.setData({
              list: that.data.list,
            })
          }else{
            that.setData({
              list: arr,
            })
          }
          if (that.data.paged == 1 && arr.length < 10) {
            that.setData({
              isLoadMore: false,
              scrollWatch:false
            })
          }
          else {
            that.setData({
              isLoadMore: true,
              scrollWatch: true
            })
          }
          var page = that.data.paged
          that.setData({
            paged: ++page,
          })
        }
        else{
          that.setData({
            isLoadMore: false,
            scrollWatch: false,
            // list:null,
          })
        }
        setTimeout(() => {
          wx.setStorageSync("orderIndex", index);
          wx.hideLoading();
        }, 500)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var a = {
      currentTarget: {
        dataset: {
          index: that.data.curIndex,
          paged: that.data.paged
        }
      }
    }
    that.switchTabItem(a)
    setTimeout(() => {
      wx.hideLoading();
    }, 500)
  },

})