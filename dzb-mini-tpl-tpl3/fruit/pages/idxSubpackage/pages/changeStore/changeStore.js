// indexPackage/pages/changeStore/changeStore.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
      uid: '',//当前用户id
      oid: '',//行业id
      lng: '',//经度
      lat: '',//纬度
      clickId: '',//选中的门店id
      storeList: [],//商店列表
      loadingHidden: false,//加载中
      fid: '',//选中的门店id
      ischecked:'',//是否选中
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      that.setData({
        oid: app.globalData.oid,
        loadingHidden: true,
      })
      //获取用户信息
      that.getUser();
      //获取路由参数
      that.getParams();
      //获取门店列表
      that.getStores();
    },

  //客服
  toService(res) {
    console.log(res)
    var that = this;
    // wx.miniProgram.navigateTo({ url: '/path/to/page' })
    var s = that.data.storeList;
    var index = res.currentTarget.dataset.index2;
    wx.navigateTo({
      url: '../../../mySubpackage/pages/communicate/communicate?id=' + s[index].id,
    })
  },
  //获取用户信息
  getUser() {
    var that = this;
    //判断是否有用户信息
    if (wx.getStorageSync("uid")) {
      that.setData({
        uid: wx.getStorageSync("uid"),
      })
    }else {
      that.setData({
        uid: 0,
      })
    }
  },

  //获取路由参数
  getParams() {
    var that = this;
    that.setData({
      lng: wx.getStorageSync("lng"),
      lat: wx.getStorageSync("lat"),
      clickId: wx.getStorageSync("clickId"),
    });
  },

  //获取门店列表
  getStores() {
    var that = this
    var m = that.data.lng + ',' + that.data.lat
    wx.request({
      url: hostUrl + '/store',
      data: {
        oid: that.data.oid,
        uid: that.data.uid,
        origin: m,
      },
      success: function(res){
        if (res.data.code == 1) {
          that.setData({
            loadingHidden: true,
            storeList: res.data.data,
          });
          var s = res.data.data;
          var a, b, pick, click
          //收藏置顶
          for (let i = 0; i < s.length; i++) {
            if (s[i].isCheck == 1) {
              pick = s[i]
              s.splice(i, 1)
              s.unshift(pick)
              break
            }
          };
          //当前选择置顶
          for (let i = 0; i < s.length; i++) {
            if (s[i].id == that.data.clickId) {
              s[i].isClick = true
              click = s[i]
              s.splice(i, 1)
              s.unshift(click)
              break
            }
          };
          that.setData({
            storeList: s,
          });
          var s2 = that.data.storeList
          s2.forEach(item => {
            if (typeof (item.km) != 'object')
            {
            item.km = item.km.toFixed(2)
            }else{
            item.km = 0
            }

          })
          that.setData({
            storeList: s2,
          });
        }
      }
    })

  },

  //关注/取消关注门店
  collect(index) {
    var that = this
    if (!that.data.uid) {
      wx.showToast({
        title: '您还未登录哦！',
        icon: 'none',
      })
    }
    else {
      var s = that.data.storeList
      var index = index.currentTarget.dataset.index
      var fid = s[index].id
      wx.request({
        url: hostUrl + '/follow',
        method: "POST",
        data: {
          oid: that.data.oid,
          uid: that.data.uid,
          fid: fid,
        },
        success: function (res) {
          if (res.data.code == 1) {
            wx.showToast({
              title: '关注成功！',
              icon: 'none',
            })
            //获取门店列表
            that.getStores();

            
            var ischecked = that.data.storeList[index].isCheck
            if (ischecked == 1) { 
              that.setData({
                ischecked: !ischecked
              })
            } else {
              that.setData({
                ischecked: 1
              })
            } 
           
          }else if(res.data.code == 2){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
            //获取门店列表
            that.getStores();
          }
        }
      })
    }
  },

    //切换门店
    changeStr(index) {
      var that = this;
      var s = that.data.storeList;
      var index = index.currentTarget.dataset.index
      wx.setStorageSync("clickId", s[index].id);
      var clicked = wx.getStorageSync("clickId")
      wx.reLaunch({
        url: '../../../tabBar/index/index?changeStore=1',
      })
    },

    //店铺详情
    lookStore(index) {
      var that = this;
      var s = that.data.storeList;
      var index = index.currentTarget.dataset.index;
      wx.navigateTo({
          url: '../storeDes/storeDes?id='+s[index].id,
      })
    },
})