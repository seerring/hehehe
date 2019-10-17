// pages/mySubpackage/pages/logistics/logistics.js
const hostUrl = require('../../../../config').hostUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lists: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var orderid = options.orderid;
        that.getLogisticInfo(orderid);
    },

    getLogisticInfo: function(orderid) {
        var that = this;
        that.setData({
            loadingHidden: false
        })
        wx.request({
            url: hostUrl + '/logistic/' + orderid,
            data: {},
            method: 'GET',
            success: function(result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        lists: res.data.lists,
                        logcname: res.data.logcname,
                        logcnumber: res.data.logcnumber,
                        nums: res.data.logccount
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                    that.setData({ nums:-1 })
                }
            },
            complete: function() {
                that.setData({
                    loadingHidden: true
                })
            }
        })
    },
})