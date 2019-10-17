// pages/mySubpackage/pages/withdraw/withdraw.js
const hostUrl = require('../../../../config').hostUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canDrawMoney: '0.00',
        status:1,
        cash:0,
    },

    onLoad: function (options) {
        this.getCashInfo();
    },
    getCashInfo: function (orderid) {
        var that = this;
        var uid = wx.getStorageSync('uid');
        wx.request({
            url: hostUrl + '/wallet/' + uid,
            data: {},
            method: 'GET',
            success: function (result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        canDrawMoney: res.data.w_price,
                        status:res.data.status,
                        cash: res.data.cash
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }
            },
            complete: function () {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
    //全部提现
    allWithdraw: function () {
        var that = this;
        that.setData({
            allWithdraw: that.data.canDrawMoney,
        })
    },
    //提现金额
    formSubmit(e) {
        var that   = this;
        that.setData({ loadingHidden: false })
        var formId = e.detail.formId;
        var datas  = e.detail.value;
        var currentMoney = that.data.canDrawMoney;
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        wx.request({
            url: hostUrl + '/wallet',
            data: {
                'uid': uid,
                'oid': oid,
                'cash':datas.cash,
                'formid': formId,
                'type':1
            },
            method: 'POST',
            success: function (result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        status: 2
                    })
                }
                wx.showToast({
                    icon: 'none',
                    title: res.msg
                })
            },
            complete: function () {
                that.setData({
                    loadingHidden: true
                })
            }
        })
        console.log('form发生了submit事件，携带数据为：', datas)
        console.log(formId);
    },
    cashinfo: function () {
        var cash = this.data.cash;
        wx.showModal({
            title: '',
            content: '您有一笔提现金额为【 ¥' + cash + ' 】的申请正在处理中...',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#f56259',
            success: function (res) {
            }
        })
    },
})