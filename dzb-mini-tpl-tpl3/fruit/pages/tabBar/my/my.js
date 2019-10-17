// pages/tabBar/my/my.js
const hostUrl = require('../../../config').hostUrl
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModal: false,
    loadingHidden: false, //加载
    animationData: {}, //展示核销二维码
    ewm: '', //二维码图
    orderList_1: '', //待付款数量
    orderList_2: '', //待配送数量
    orderList_3: '', //配送中数量
    orderList_4: '', //退款数量
    orderList_5: '', //核销订单数量
    msgNum: '', //消息通知数量
    myStore: '', //当前商店名称
    location: '', //当前商店名称
    storeLogo: '', //当前商店头像
    uid: "",
    coupon_count: 0 //优惠券的数量
  },
  onShow: function() {
    var that = this;
    wx.hideLoading();
    that.setData({
      loadingHidden: false,
      uid: wx.getStorageSync('uid')
    })
    var uid = wx.getStorageSync('uid');
    var oid = wx.getStorageSync('oid');
    if (uid) {
      that.getUser(uid);
    } else {
      // wx.reLaunch({
      //     url: '/pages/common/pages/login/login?oid=' + oid
      // })
      // that.showAddCartWarn()
      that.setData({
        loadingHidden: true
      })
      return;
    }

    that.getOrder();
    that.getMsg();
    wx.removeStorageSync('curIndex')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.name) {
      wx.navigateTo({
        url: '/pages/mySubpackage/pages/order/order?name=' + options.name,
      })
    }
    var nickname = wx.getStorageSync('nickname');
    that.setData({
      nickname: nickname
    })

    var shopInfo = wx.getStorageSync('shopInfo');
    shopInfo = JSON.parse(shopInfo);
    var areaaddress = shopInfo.area + shopInfo.address;
    that.setData({
      myStore: shopInfo.name,
      location: areaaddress,
      storeLogo: shopInfo.logo,
    })
    if (!wx.getStorageSync('uid')) {
      // that.showAddCartWarn()
      return
    } //未登录直接跳出
  },
  //提示是否登录
  showAddCartWarn() {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '您还未登录，请先进行登录！',
      showCancel: true,
      confirmColor: "#1ccfcf",
      cancelColor: "#666",
      success(res) {
        if (res.confirm) {
          setTimeout(function() {
            wx.navigateTo({
              url: '/pages/common/pages/login/login',
            })
          }, 500);
        } else if (res.cancel) {
          console.log('用户点击取消')
          that.setData({
            loadingHidden: true
          })
        }
      }
    })
  },

  //客服
  toService() {
    var that = this;
    // wx.miniProgram.navigateTo({ url: '/path/to/page' })
    if (!app.isLogin()) { //检测是否登录
      return
    } else {
      wx.navigateTo({
        url: '../../mySubpackage/pages/communicate/communicate',
      })
    }
  },

  // 获取订单红点信息
  getOrder: function() {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var oid = wx.getStorageSync('oid');

    wx.request({
      url: hostUrl + '/storeorder',
      data: {
        uid: uid,
        oid: oid
      },
      method: 'GET',
      success: function(result) {
        var res = result.data;
        if (res.code == 1) {
          that.setData({
            orderList_1: res.data.PendingPayment_count,
            orderList_2: res.data.dispatching_count,
            orderList_3: res.data.distribution_count,
            orderList_4: res.data.refund_count,
            orderList_5: res.data.writeOff_count,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      },
      complete: function() {
        that.setData({
          loadingHidden: true
        })
      }
    })
  },

  // 获取消息通知信息
  getMsg: function() {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var oid = wx.getStorageSync('oid');

    wx.request({
      url: hostUrl + '/storemessages',
      data: {
        uid: uid,
        oid: oid
      },
      method: 'GET',
      success: function(result) {
        var res = result.data;
        if (res.code == 1) {
          that.setData({
             msgNum: res.data.message_count,
            // msgNum: 3,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      },
      complete: function() {
        that.setData({
          loadingHidden: true
        })
      }
    })
  },

  //获取当前用户信息
  getUser: function(uid) {
    var that = this;
    var oid = wx.getStorageSync('oid');
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: hostUrl + '/user/' + uid,
      data: '',
      method: 'GET',
      success: function(result) {
        var res = result.data;
        console.log(res.data)
        if (res.code == 1) {
          that.setData({
            userinfo: res.data,
            nickname: res.data.nickname,
            coupon_count: res.data.coupon_count
          })
          // console.log("-------------"+userinfo);
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
          wx.clearStorageSync();
          // wx.reLaunch({
          //     url: '/pages/common/pages/login/login?oid=' + oid
          // })
          that.showAddCartWarn()
        }
      },
      complete: function() {
        that.setData({
          loadingHidden: true
        })
      }
    })
  },
  //提示
  bindhint: function() {
    var that = this;
    wx.showToast({
      icon: 'none',
      title: '敬请期待！',
    })
  },
  // 跳转消息列表
  jumpUserMsg() {
    if (!app.isLogin()) {
      return;
    }; //检测是否登录
    wx.navigateTo({
      url: '../../idxSubpackage/pages/userMessage/userMessage',
    })
  },

  //点击刷新二维码
  reFresh() {
    var that = this;
    var uid = wx.getStorageSync('uid');
    var params1 = {
      uid: uid
    }
    var params2 = {
      param: JSON.stringify(params1)
    }

    wx.request({
      url: hostUrl + '/qrcode',
      data: {
        param: params2
      },
      method: 'GET',
      success: function(result) {
        var res = result.data;
        if (res.code == 1) {
          that.setData({
            ewm: res.data,
          })
        } else {

          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
          // wx.reLaunch({
          //     url: '/pages/common/pages/login/login?oid=' + oid
          // })
        }
      },
      complete: function() {
        that.setData({
          loadingHidden: true
        })
      }
    })

  },

  //展示核销二维码
  recommend: function() {
    var that = this;
    if (!app.isLogin()) { //检测是否登录
      return
    } else {
      // 创建一个动画实例
      var animation = wx.createAnimation({
        // 动画持续时间
        duration: 500,
        // 定义动画效果，当前是匀速
        timingFunction: "linear",
        delay: 0,
      })
      // 将该变量赋值给当前动画
      that.animation = animation;
      // 先在y轴偏移，然后用step()完成一个动画
      animation.translateY(600).step();
      // 用setData改变当前动画
      that.setData({
        // 通过export()方法导出数据
        animationData: animation.export(),
        // 改变view里面的Wx：if
        isShowModal: true
      })

      // 显示核销二维码
      that.reFresh()
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function() {
        animation.translateY(0).step();
        that.setData({
          animationData: animation.export()
        })
      }, 200)
    }
  },
  //关闭弹窗
  closeModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        isShowModal: false
      })
    }, 500)
  },
  // 跳转会员页
  lookMember() {
    var that = this;
    if (!app.isLogin()) { //检测是否登录
      return
    } else {
      wx.navigateTo({
        url: '/pages/mySubpackage/pages/memberCharge/memberCharge',
      })
    }
  }
})