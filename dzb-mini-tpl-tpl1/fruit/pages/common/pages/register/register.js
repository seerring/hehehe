// pages/common/register/register.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp();
const accountInfo = wx.getAccountInfoSync();
var appid = accountInfo.miniProgram.appId; // 小程序 appId
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loadingHidden: false,//加载
        phoneVal: '',//手机号
        time: '获取验证码',//获取验证码或倒计时
        currtime: 60,//倒计时
        isClick: false,//按钮样式
        name:'',//昵称
        inputNameController:false,//控制昵称长度
        regimg: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            loadingHidden: true,
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
            success: function (result) {
                console.log(result.data);
                console.log("获取小程序appid");
                var res = result.data;
                if (res.code == '1' && res.data != '0') {
                    app.globalData.oid = res.data;
                    app.globalData.appName = res.mininame
                    console.log("注册图片：", res.headimg);
                    that.setData({
                        regimg: res.headimg
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
            complete: function () { }
        })
    },
    //手机号
    inpVal: function (e) {
        var that = this;
        var value = e.detail.value;
        console.log(value);
        if (value) {
            that.setData({
                phoneVal: value,
            })
        }
    },
    //昵称
    inpName: function (e) {
      var that = this;
      var value = e.detail.value;
      console.log(value.length);
      if (value) {
        that.setData({
          name: value,
        })
      }
    },
    //获取验证码
    getCode: function () {
        var that  = this;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var phone = that.data.phoneVal;
        if (!myreg.test(phone)) {
            wx.showToast({
                icon: 'none',
                title: '请输入有效手机号！',
            })
        }
        else {
            var currtime = that.data.currtime;
            that.setData({
                loadingHidden: false,
            })
            
            wx.request({
                url: hostUrl + '/sms',
                data: {
                    'phone': phone,
                    'oid': wx.getStorageSync('oid'),
                    'action': 1
                },
                method: 'GET',
                success: function (res) {
                    var r = res.data;
                    if(r.code == 1){
                        that.setData({
                            isClick: true,
                            time: currtime + 's',
                        })
                        var interval = setInterval(function () {
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
                complete:function(){
                    that.setData({
                        loadingHidden: true
                    })
                }
            }) 
        }
    },
    //注册
    submitFun: function (e) {
        var arr = e.detail.value;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var that = this;
        if (!arr.nickname) {
            wx.showToast({
                icon: 'none',
                title: '请输入昵称！',
            })
        }
        else if (!myreg.test(arr.mobile)) {
            wx.showToast({
                icon: 'none',
                title: '请输入有效手机号',
            })
        }
        else if (arr.code.length != 6) {
            wx.showToast({
                title: '请输入六位数验证码',
                icon: 'none'
            })
        }
        else if (arr.password.length < 6 || arr.password2.length < 6) {
            wx.showToast({
                icon: 'none',
                title: '请输入6~11位的密码！',
            })
        }
        else if (arr.password != arr.password2) {
            wx.showToast({
                icon: 'none',
                title: '两次密码不一致！',
            })
        }
        else {
            that.setData({ loadingHidden: false })
            arr.oid = wx.getStorageSync('oid');
            wx.request({
                url: hostUrl + '/register',
                data: arr,
                method:'POST',
                success: function (res) {
                    var r = res.data;
                    if (r.code == 1) {
                        wx.reLaunch({
                            url: '/pages/common/pages/login/login?oid=' + arr.oid
                        })
                    }
                    if (r.msg == '手机号已存在') {
                      wx.showToast({
                        icon: 'none',
                        title: '此手机号已注册！',
                      })  
                      }else{
                      wx.showToast({
                        icon: 'none',
                        title: r.msg,
                      })   
                      }

                }, 
                complete: function () {
                    that.setData({
                        loadingHidden: true
                    })
                }
            })
        }
    }
})