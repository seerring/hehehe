// pages/common/forgetPassword/forgetPassword.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        phoneVal: '',//手机号
        time: '获取验证码',//获取验证码或倒计时
        currtime: 60,//倒计时
        isClick: false,//按钮样式
        loadingHidden: false,//加载
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({ loadingHidden: true, })
    },
    //手机号
    inpVal: function (e) {
        var that = this;
        var value = e.detail.value;
        if (value) {
            that.setData({
                phoneVal: value,
            })
        }
    },
    //获取验证码
    getCode: function () {
        var that = this;
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
                    'action': 0
                },
                method: 'GET',
                success: function (res) {
                    var r = res.data;
                    if (r.code == 1) {
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
                complete: function () {
                    that.setData({
                        loadingHidden: true
                    })
                }
            }) 
        }
    },
    //重置密码
    submitFun: function (e) {
        var arr = e.detail.value;
        var that = this;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!myreg.test(arr.mobile)) {
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
                title: '密码长度需大于6位数！',
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
            arr.type = 3;
          var params = {
            "mobile": arr.mobile,
            "password": arr.password,
            "password2": arr.password2,
            "code": arr.code,
            "type": 3,
            "oid": app.globalData.oid,
          }

            wx.request({
                url: hostUrl + '/login',
                data: params,
                method: 'GET',
                success: function (res) {
                    var r = res.data;
                    if (r.code == 1) {
                        wx.reLaunch({
                            url: '/pages/common/pages/login/login'
                        })
                    }
                    wx.showToast({
                        icon: 'none',
                        title: r.msg,
                    })
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