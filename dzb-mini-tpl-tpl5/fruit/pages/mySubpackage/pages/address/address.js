// pages/mySubpackage/pages/address/address.js
const hostUrl = require('../../../../config').hostUrl
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loadingHidden: false,//加载中
        area: [],//新增收货地址里面的所在区域
        adsList: [],//地址列表
        addAds: 1,//添加地址页面的展示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var oid = wx.getStorageSync('oid');
        var uid = wx.getStorageSync('uid');
        //获取地址列表
        that.getAddressInfo(uid);
    },
    //获取地址列表
    getAddressInfo: function (uid) {
        var that = this;
        that.setData({ loadingHidden: false })
        wx.request({
            url: hostUrl + '/address',
            data: {
                'uid':uid
            },
            method: 'GET',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    that.setData({
                        adsList: res.data
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


    //添加地址
    addAddress: function () {
        var that = this;
        that.setData({
            addAds: 2,
        })
    },
    //选择区域
    bindRegionChange: function (e) {
        var that = this;
        var area = e.detail.value;
        area = area.toString().replace(/,/g, ' ');
        that.setData({
            area: area,
        })
    },
    //提交
    submitBtn: function (e) {
        var that = this;
        var formVal = e.detail.value;
    
        var name = formVal.name;
        var mobile = formVal.mobile;
        var areaarr = formVal.area;
        var area = areaarr.join(',');
        var areaDetail = formVal.areaDetail;
        var parrent = new RegExp(/^[\u4e00-\u9fa5]{2,4}$/);
        var parrent2 = new RegExp(/^[1][3,4,5,7,8][0-9]{9}$/);

        if (!(formVal.name)) {
            wx.showToast({
                icon: 'none',
                title: '请输入有效姓名',
            })
        }
        else if (!parrent2.exec(formVal.mobile)) {
            wx.showToast({
                icon: 'none',
                title: '请输入有效手机号',
            })
        }
        else if (!name || !mobile || !area || !areaDetail) {
            wx.showToast({
                icon: 'none',
                title: '还有未填项!',
            })
        }
        else {
            that.setData({ loadingHidden: false })
            var uid = wx.getStorageSync('uid');
            wx.request({
                url: hostUrl + '/address',
                data: {
                    'uid': uid,
                    'name': name,
                    'mobile': mobile,
                    'area': area,
                    'areaDetail': areaDetail,
                },
                method: 'POST',
                success: function (result) {
                    var res = result.data;
                    if (res.code == 1) {
                        that.getAddressInfo(uid);
                    }else{
                        that.setData({
                            loadingHidden: true,
                        })
                    }
                    wx.showToast({
                        icon: 'none',
                        title: res.msg,
                    })
                },
                complete: function () {
                    that.setData({
                        //loadingHidden: true,
                        addAds: 1
                    })
                }
            })
        }
    },
    //选择默认地址
    radioChange: function (e) {
        var that = this;
        that.setData({
            loadingHidden: false
        })
        var index = e.detail.value;
        var adsList = that.data.adsList;
        for (var i = 0; i < adsList.length; i++) {
            if (index == adsList[i].id){
                adsList[i].checked = true;
            }else{
                adsList[i].checked = false;
            }
        }
        that.setData({
            adsList: adsList
        })
        var uid = wx.getStorageSync('uid');
        wx.request({
            url: hostUrl + '/address/' + index,
            data: {
                'uid':uid
            },
            method: 'PUT',
            success: function (result) {
                var res = result.data;
                if (res.code == 1) {
                    that.getAddressInfo(uid);
                }else{
                    that.setData({
                        loadingHidden: true
                    })
                }
                wx.showToast({
                    icon: 'none',
                    title: res.msg,
                })
            },
            complete: function () {
                
            }
        })
    },
    //删除地址
    deleteAds: function (e) {
        var that = this;
        that.setData({
            loadingHidden: false
        })
        var index = e.currentTarget.dataset.index;
        var idx   = e.currentTarget.dataset.idx;
        var adsList = that.data.adsList;
        wx.showModal({
            title: '提示',
            content: '确认删除该地址信息吗？',
            confirmColor: '#1ccfcf',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: hostUrl + '/address/' + index,
                        data: {
                        },
                        method: 'DELETE',
                        success: function (result) {
                            var res = result.data;
                            if (res.code == 1) {
                                adsList.splice(idx, 1);
                                that.setData({
                                    adsList: adsList,
                                })
                            }
                            wx.showToast({
                                icon: 'none',
                                title: res.msg,
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
    },
    //返回订单页
     backOrder:function(e){
          var that = this;
          var id = e.currentTarget.dataset.id;
          that.setData({
               loadingHidden:false,
          })

          wx.navigateBack({
               delta:1,
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
               id: id,
          })

          that.setData({
               loadingHidden: true,
          })
     }
})