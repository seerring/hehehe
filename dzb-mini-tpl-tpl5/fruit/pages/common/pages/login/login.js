// pages/idxSubpackage/pages/login/login.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp();
const accountInfo = wx.getAccountInfoSync()
var appid = accountInfo.miniProgram.appId // 小程序 appId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneVal: '', //手机号
    time: '获取验证码', //获取验证码或倒计时 当前页面不需要
    isClick: false,
    currtime: 60, //倒计时 当前页面不需要
    isUseCodeLogin: false, //密码登录
    isShowPassword: true, //当前页面不需要
    loadingHidden: false, //加载
    logoimg: '/images/APPlogo.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    var oid = app.globalData.oid;
    //var oid = 15;  // haidaozy  add  商家oid写死便于测试
    wx.setStorageSync('oid', oid);
    console.log("商家ID");
    console.log(oid);
    var uid = wx.getStorageSync('uid');
    if (uid) {
      wx.reLaunch({
        url: '/pages/tabBar/index/index'
      })
    }

    that.setData({
      loadingHidden: true,
    })
    wx.setNavigationBarTitle({
      title: '登录'
    })
    that.getMiniinfo(); //获取商家小程序信息
  },
  getMiniinfo() {
    var that = this;
    wx.request({
      url: hostUrl + '/common',
      data: {
        'attr': appid,
        'action': 'miniinfo'
      },
      method: 'GET',
      success: function(result) {
        console.log(result.data);
        console.log("获取小程序appid");
        var res = result.data;
        if (res.code == '1' && res.data != '0') {
          app.globalData.oid = res.data;
          app.globalData.appName = res.mininame
          that.setData({
            logoimg: res.headimg
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '商家未绑定小程序，暂不可使用',
            confirmColor: '#ff5400',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.clearStorageSync();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      complete: function() {}
    })
  },
  //手机号
  inpVal: function(e) {
    var that = this;
    var value = e.detail.value;
    if (value) {
      that.setData({
        phoneVal: value,
      })
    }
  },
  //删除手机号
  delFun: function() {
    var that = this;
    that.setData({
      phoneVal: '',
      isShowDel: false,
    })
  },
  //获取验证码
  getCode: function() {
    var that = this;
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    var phone = that.data.phoneVal;
    if (!myreg.test(phone)) {
      wx.showToast({
        icon: 'none',
        title: '请输入有效手机号！',
      })
    } else {
      var currtime = that.data.currtime;
      that.setData({
        loadingHidden: false,
      })
      wx.request({
        url: hostUrl + '/sms',
        data: {
          'phone': phone,
          'action': 0
        },
        method: 'GET',
        success: function(res) {
          var r = res.data;
          if (r.code == 1) {
            that.setData({
              isClick: true,
              time: currtime + 's',
            })
            var interval = setInterval(function() {
              that.setData({
                time: --currtime + 's',
              })
              if (currtime <= 0) {
                clearInterval(interval);
                that.setData({
                  time: '重新获取',
                  currtime: 60,
                  isClick: false,
                })
              }
            }, 1000)
          }
          wx.showToast({
            icon: 'none',
            title: r.msg,
          })
        },
        complete: function() {
          that.setData({
            loadingHidden: true
          })
        }
      })
    }
  },
  //登录
  submitFun: function(e) {
    console.log(e);
    var arr = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var that = this;
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (id == 1) {
      if (!myreg.test(arr.mobile)) {
        wx.showToast({
          icon: 'none',
          title: '请输入有效手机号！',
        })
      } else if (arr.code.length != 6) {
        wx.showToast({
          title: '请输入六位数验证码',
          icon: 'none'
        })
      } else {
        that.memberLogin(id, arr);
      }
    }
    if (id == 2) {
      if (!myreg.test(arr.mobile)) {
        wx.showToast({
          icon: 'none',
          title: '请输入有效手机号！',
        })
      } else if (!arr.password) {
        wx.showToast({
          icon: 'none',
          title: '密码不正确！',
        })
      } else {
        that.memberLogin(id, arr);
      }
    }
  },
  //用户登录
  memberLogin: function(type, arr) {
    var that = this;
    that.setData({
      loadingHidden: false
    })
    arr.type = type;
    var oid = wx.getStorageSync('oid');
    arr.oid = oid;
    wx.request({
      url: hostUrl + '/login',
      data: arr,
      method: 'GET',
      success: function(res) {
        var r = res.data;
        console.log(r);
        if (r.code == 1) {
          wx.setStorageSync('uid', r.data.uid);
          wx.setStorageSync('nickname', r.data.nickname);
          wx.reLaunch({
            url: '/pages/tabBar/index/index?oid=' + oid,
          })
        }
        wx.showToast({
          icon: 'none',
          title: r.msg,
        })
      },
      complete: function() {
        that.setData({
          loadingHidden: true
        })
      }
    })
  },
  //显示密码
  showPassword: function() {
    var that = this;
    var isShowPassword = !that.data.isShowPassword;
    that.setData({
      isShowPassword: isShowPassword,
    })
  },
  //却换登录方法
  changeWay: function() {
    var that = this;
    that.setData({
      isUseCodeLogin: false,
      phoneVal: '',
    })
  },
  changeWay2: function() {
    var that = this;
    that.setData({
      isUseCodeLogin: true,
      phoneVal: '',
    })
  },
  //授权登录
  wxLogin(e) {
    var that = this;
    var info = e.detail;
    console.log(e);
    //查看是否授权
    that.setData({
      loadingHidden: false
    })
    var oid = wx.getStorageSync('oid');
    wx.login({
      success: function(res) {
        wx.request({
          url: hostUrl + '/login',
          data: {
            'oid': app.globalData.oid,
            'code': res.code,
            'signature': info.signature,
            'iv': info.iv,
            'encryptedData': info.encryptedData
          },
          header: {
            "Content-Type": "applciation/json"
          },
          method: "POST",
          success: function(r) {
            var s = r.data;
            console.log(s);
            if (s.code == 4 || s.data == '-1001') {
              wx.showModal({
                title: '错误提示',
                confirmColor: '#1ccfcf',
                showCancel: false,
                content: '授权失败，请重试:' + s.data,
                success: function(res) {
                  if (res.confirm) {
                    that.setData({
                      loadingHidden: true
                    })
                  }
                }
              })

            } else if (s.code == 1) {
              //该账号为老用户已绑定手机号
              wx.setStorageSync('uid', s.data.uid);
              wx.reLaunch({
                url: '/pages/tabBar/index/index?oid=' + oid,
              })

            } else {
              //该账号未绑定手机号
              wx.setStorageSync('uid', s.data.uid);
              wx.showModal({
                title: '绑定提示',
                content: '当前账号还未绑定手机号，请立即绑定',
                confirmColor: '#1ccfcf',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/mySubpackage/pages/bindMobile/bindMobile?oid=' + oid
                    })
                  } else if (res.cancel) {
                    wx.reLaunch({
                      url: '/pages/tabBar/index/index?oid=' + oid,
                    })
                  }
                }
              })

            }
          },
          complete: function() {
            that.setData({
              loadingHidden: true
            })
          }
        });
      },
    });
  },
  onShow: function() {
    console.log("show list");
    var uid = wx.getStorageSync('uid');
    var oid = wx.getStorageSync('oid');
    if (uid) {
      wx.reLaunch({
        url: '/pages/tabBar/index/index?oid=' + oid,
      })
    }
  }
})