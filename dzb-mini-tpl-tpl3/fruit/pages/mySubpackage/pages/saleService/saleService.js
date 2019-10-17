// pages/mySubpackage/pages/saleService/saleService.js
const hostUrl = require('../../../../config').hostUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var orderid = options.orderid;
        this.getSaleafter(orderid);
    },

    getSaleafter: function (orderid){
        var that = this;
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        wx.request({
            url: hostUrl + '/order/' + orderid,
            data: {
                'oid': oid,
                'uid': uid
            },
            method: 'GET',
            success: function (result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    
                    that.setData({
                        
                    })
                }else{
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
    }
})