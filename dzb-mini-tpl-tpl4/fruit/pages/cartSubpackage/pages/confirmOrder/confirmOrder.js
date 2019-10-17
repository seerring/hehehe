// pages/cartSubpackage/pages/confirmOrder/confirmOrder.js
const hostUrl = require('../../../../config').hostUrl
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        totalPrice: '',
        freight: '0',
        newtotalPrice: '',
        orderList: [],
        addressInfo: {},
        lessAmount: 0,
        curIndex: -1,
        nullAds: false,
        isAgree: false,
        isShowCoupon: false,
        checkCoupon: false,
        couponid:-1,
        couponList: [],
        inpVal: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        var that = this;
        //详情页立即购买
        if (options.way == 1) {
            var totalPrice = wx.getStorageSync('totalPrice');
            var orderList  = wx.getStorageSync('proInfo');

            console.log(orderList);
            console.log("dingdan xinxi");
            that.setData({
                orderList: orderList,
            })
        }
        if (options.way == 2) {
            var totalPrice = wx.getStorageSync('totalPrice');
            var orderList = wx.getStorageSync('orderList');
            console.log(orderList);
            that.setData({
                orderList: orderList,
            })
        }
        var newtotalPrice = parseInt(totalPrice) + parseInt(that.data.freight);
        that.setData({
            totalPrice: totalPrice,
            newtotalPrice: newtotalPrice.toFixed(2),
        })

        that.getcouponlist(orderList);
    },
    getcouponlist: function (orderinfo) {
        var that = this;
        var uid = wx.getStorageSync('uid');
        var sid = wx.getStorageSync('clickId');
        var oid = wx.getStorageSync('oid');


        wx.request({
          url: hostUrl + '/storencoupon',
            data: {
                'uid': uid,
                'orderinfo': orderinfo,
                'sum': 100,
                'sid': sid,              
            },
            method: 'GET',
            success: function (result) {
                console.log(result.data);
                console.log("优惠卷内容");
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        couponList: res.data.list,
                        checkCoupon: true
                    })
                } else {
                    that.setData({
                        checkCoupon: false
                    });
                }
            },
            complete: function () {
                that.setData({
                    loadingHidden: true
                })
            }
        })

    },

    //同意协议
    // checkboxChange: function (e) {
    //     var that = this;
    //     var isAgree = e.currentTarget.dataset.isagree;
    //     var checked = !isAgree;
    //     that.setData({
    //         isAgree: checked
    //     })
    // }

    //优惠券列表
    couponList: function () {
        var that = this;
        var totalPrice = that.data.totalPrice;
        that.setData({
            isShowCoupon: true,
            //newtotalPrice: totalPrice - that.data.lessAmount,
        })
    },
    // 选择优惠券
    checkedCoupon: function (e) {
        var that = this;
        var totalPrice = that.data.totalPrice;
        var newtotalPrice = that.data.newtotalPrice;
        newtotalPrice = totalPrice;
        var index = e.currentTarget.dataset.index;
        var id    = e.currentTarget.dataset.id;
        var couponList = that.data.couponList;
        for (var i = 0; i < couponList.length; i++) {
            if (i == index) {
                couponList[index].checked = !couponList[index].checked;
            }
            else {
                couponList[i].checked = false;
            }
        }
        console.log(couponList)
        if (couponList[index].checked) {
            newtotalPrice -= couponList[index].disMoney - that.data.freight;
            that.setData({
                couponid: id,
                curIndex: index,
                newtotalPrice: newtotalPrice.toFixed(2),
                lessAmount: couponList[index].disMoney,
                couponList: couponList,
            })
        }
        else {
            newtotalPrice = parseInt(newtotalPrice) + parseInt(that.data.freight);
            that.setData({
                couponid:id,
                curIndex: -1,
                lessAmount: 0,
                newtotalPrice: newtotalPrice.toFixed(2),
                couponList: couponList,
            })
        }

    },
    //关闭优惠券弹窗
    closeModal: function () {
        var that = this;
        that.setData({
            isShowCoupon: false,
        })
    },
    //支付
    toPayment: function () {
        var that = this;
        var nullAds = that.data.nullAds;
        if (nullAds) {
            that.setData({ loadingHidden: false })
            var info          = that.data.orderList;
            var newtotalPrice = that.data.newtotalPrice;
            var addressInfo   = that.data.addressInfo;
            var couponid      = that.data.couponid;
            var ordernote     = that.data.inpVal;
            var fee = that.data.freight;
            var uid = wx.getStorageSync('uid');
            var oid = wx.getStorageSync('oid');
            console.log("商家ID",oid);
            console.log("订单信息");
            console.log(info);
            console.log(newtotalPrice);
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            url: hostUrl + '/payment',
                            data: {
                                uid: uid,
                                oid: oid,
                                type: 1, //未支付
                                orderinfo: info,
                                opencode: res.code,
                                total: newtotalPrice,
                                addressInfo: addressInfo,
                                couponid: couponid,
                                fee: fee,
                                ordernote: ordernote
                            },
                            method: 'POST',
                            success: function (result) {
                                console.log("支付信息返回");
                                console.log(result.data);
                                var res = result.data;
                                if (res.code == 1) {
                                    var oinfo = JSON.parse(res.data.orderinfo);
                                    var orderid = res.data.orderID;
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
                                            wx.setStorageSync('orderList', "");
                                            wx.setStorageSync('totalPrice', "");
                                            wx.setStorageSync('proInfoList', "");
                                            wx.reLaunch({
                                                url: '/pages/tabBar/my/my',
                                            })
                                        },
                                        fail(r) {
                                            wx.showToast({
                                                icon: 'none',
                                                title: "支付失败或取消"
                                            })
                                            setTimeout(function(){
                                                wx.reLaunch({
                                                    url: '/pages/tabBar/my/my?name=待付款',
                                                })
                                            },1000)  
                                        }
                                    })
                                }
                                else {
                                    wx.showToast({
                                        icon: 'none',
                                        title: res.msg,
                                    })
                                }
                            },
                            complete: function () {
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
        else {
            wx.showToast({
                icon: 'none',
                title: '请选择收货地址！',
            })
        }
    },
    //买家留言
    getVal: function (e) {
        var value = e.detail.value;
        var that = this;
        that.setData({
            inpVal: value,
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        var pages     = getCurrentPages();
        var uid       = wx.getStorageSync('uid');
        var orderList = that.data.orderList;
        var currPage  = pages[pages.length - 1];//当前页面
        if (that.data.id) {
            var address_id = that.data.id;
        } else {
            var address_id = "";
        }
        wx.request({
            url: hostUrl + '/address/' + uid,
            data: {
                aid: address_id,
                feeid:orderList[0].feeid
            },
            method: 'GET',
            success: function (result) {
                console.log("dizhi xinxi ");
                console.log(result.data);
                var res = result.data;
                console.log(res.data)
                if (res.code == 1) {
                    that.setData({
                        nullAds: true,
                        addressInfo: res.data.address,
                        freight: res.data.feeprice
                    })
                }
                else {
                    that.setData({
                        nullAds: false,
                    })
                }
            },
            complete: function () {
                var totalPrice    = wx.getStorageSync('totalPrice'); //商品总价
                var lessAmount    = that.data.lessAmount; //优惠劵价格
                var newtotalPrice = parseInt(totalPrice) + parseInt(that.data.freight) - lessAmount;
                that.setData({
                    loadingHidden: true,
                    newtotalPrice: newtotalPrice,
                })
            }
        })
        
    }
})