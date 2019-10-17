// pages/mySubpackage/pages/bindMobile/bindMobile.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        time: '获取验证码',//获取验证码或倒计时
        currentTime: '60',//倒计时
        loadingHidden: false,//加载
        isClick: false,//按钮样式
        mobile: '',//手机号
        uid:'',//当前用户uid
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        console.log(options)
        var oid = options.oid;
        if (oid) {
            wx.setStorageSync('oid', oid);
        } else {
            wx.setStorageSync('oid', 0);
        }
        that.setData({ 
          loadingHidden: true, 
          uid: wx.getStorageSync('uid')
        })
        console.log(that.data.uid)
    },
    //获取手机号
    inpVal: function (e) {
        console.log(e)
        var that = this;
        var mobile = e.detail.value;
        that.setData({
            mobile: mobile,
        })
    },
    //获取验证码
    getCode: function () {
        var that = this;
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var phone = that.data.mobile;
        if (!myreg.test(phone)) {
            wx.showToast({
                icon: 'none',
                title: '请输入有效手机号！',
            })
        }
        else {
            var currtime = that.data.currentTime;
            that.setData({
                loadingHidden: false,
            })
            wx.request({
                url: hostUrl + '/sms',
                data: {
                    'phone': phone,
                    'action': 1
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
                                    currentTime: 60,
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
    //提交
    formSubmit: function (e) {
        var that = this;
        var arr = e.detail.value;
        console.log(arr)
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!myreg.test(arr.mobile)) {
            wx.showToast({
                icon: 'none',
                title: '请输入有效手机号！',
            })
        }
        else if (arr.code.length != 6) {
            wx.showToast({
                title: '请输入六位数验证码',
                icon: 'none'
            })
        }
        else if (!arr.password || !arr.password2) {
            wx.showToast({
                icon: 'none',
                title: '请输入密码！',
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
            var uid = that.data.uid;
            var oid = wx.getStorageSync('oid');
            console.log("商家oid" + oid + "用户uid" + uid);
          var params = uid + '?mobile=' + arr.mobile + '&code=' + arr.code + '&password=' + arr.password + '&oid=' + app.globalData.oid;
            wx.request({
                url: hostUrl + '/register/' + params,
                data: '',
                method:'PUT',
                success: function (res) {
                    var r = res.data;
                    console.log(r)
                    if (r.code == 1) {
                        // wx.reLaunch({
                        //     url: '/pages/tabBar/my/my?oid=' + oid,
                        // })
                        wx.reLaunch({
                          url: '/pages/tabBar/index/index?isCheck' + "res.data.isCheck",
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
    },
})