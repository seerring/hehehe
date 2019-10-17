// pages/mySubpackage/pages/orderDetails/orderDetails.js
const hostUrl = require('../../../../config').hostUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderStatus: '',
        isShowModal1: false,
        orderinfo: [],
        orderid:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        var that = this;
        var status = options.status;
        var orderid = options.orderid;
        that.setData({
            orderStatus: status,
            orderid: orderid,
        })

        that.getOrderInfo(orderid);
    },

    getOrderInfo: function(orderid) {
        var that = this;
        that.setData({ loadingHidden: false })
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        wx.request({
            url: hostUrl + '/order/' + orderid,
            data: {
                'oid': oid,
                'uid': uid
            },
            method: 'GET',
            success: function(result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        orderinfo: res.data
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: res.msg
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
    //取消订单
    qxOrder: function(e) {
        console.log(e);
        var that = this;
        that.setData({
            isShowModal1: true,
        })
    },
    //取消操作
    cancleOrder: function() {
        var that = this;
        that.setData({
            isShowModal1: false,
            isShowModal3: false,
        })
    },
    //确认操作
    comOrder: function() {
        var that = this;
        that.setData({
            isShowModal1: false,
        })
    },
    //确认订单
    confirmOrder: function (e) {
        console.log(e);
        var that = this;
        var orderId = e.currentTarget.dataset.id;
        that.setData({
            isShowModal3: true,
            orderId: orderId,
        })
        console.log('111')
    },
    //确认收货操作
    confirmSubmitOrder: function (e) {
        var that = this;
        var orderid = that.data.orderId;
        console.log(orderid);
        that.setData({ loadingHidden: false })
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');
        wx.request({
            url: hostUrl + '/confirmorder',
            data: {
                'orderid': orderid
            },
            method: 'GET',
            success: function (result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        isShowModal3: false,
                        orderStatus: "已完成",
                    })
                    that.getOrderInfo(orderid);
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
    },

    //支付
    toPayment: function() {
        var that = this;
        that.setData({
            loadingHidden: false
        })
        var info = that.data.orderinfo;
        var orderid = that.data.orderid;
        var uid = wx.getStorageSync('uid');
        var oid = wx.getStorageSync('oid');

        console.log("订单信息");
        console.log(info);
        wx.login({
            success: function(res) {
                if (res.code) {
                    wx.request({
                        url: hostUrl + '/payment',
                        data: {
                            uid: uid,
                            oid: oid,
                            id: orderid,
                            orderinfo: info,
                            type: 2, //已下单重新支付
                        },
                        method: 'POST',
                        success: function(result) {
                            console.log("支付信息返回");
                            console.log(result.data);
                            //return false;
                            var res = result.data;
                            if (res.code == 1) {
                                var oinfo = JSON.parse(res.data.orderinfo);
                                var orderID = res.data.orderID;
                                wx.requestPayment({
                                    'timeStamp': oinfo.timeStamp,
                                    'nonceStr': oinfo.nonceStr,
                                    'package': oinfo.package,
                                    'signType': oinfo.signType,
                                    'paySign': oinfo.paySign,
                                    success(r) {
                                        wx.showToast({
                                            icon: 'success',
                                            title: "支付成功"
                                        })
                                        that.setData({
                                            orderStatus:"待发货"
                                        })
                                        that.getOrderInfo(orderID);
                                    },
                                    fail(r) {
                                        wx.showToast({
                                            icon: 'none',
                                            title: "支付失败或取消"
                                        })
                                    }
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
                } else {
                    console.log('登录失败！' + res.errMsg)
                    wx.showToast({
                        icon: 'none',
                        title: "登录失败或授权被禁用！",
                    })
                }
            }
        });
    }
})