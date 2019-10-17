// pages/cartSubpackage/pages/address/address.js
const hostUrl = require('../../../../config').hostUrl
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uid: '',
        sid: '',
        oid:'',
        adsList: [],
        inList: [],
        outList: [],
        way: '',
        id: '',
        showDelete: false,
        addressInfo: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.removeStorageSync('selected_address_id'); //重置选中的地址ID
        console.log(options)
        that.setData({
            oid: app.globalData.oid,
            uid: wx.getStorageSync("uid"),
            sid: wx.getStorageSync("clickId"),
            type: options.type,
            way: options.way
        })
        that.getShopInfo();
        that.getStore();
    },
    onShow:function(){
      var that = this;
      that.getAddress();
    },
    //商店信息
    getShopInfo() {
        var that = this;
        var data = {
            uid: that.data.uid,
            sid: that.data.sid,
            sub_type: 2,
            oid: that.data.oid,
        }
        wx.request({
            url: hostUrl + '/orderaddress',
            method: 'GET',
            data: data,
            success: function (res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        addressInfo: res.data,
                    })
                } else { }
            }
        })
    },
    //获取当前门店详情
    getStore() {
        var that = this;
        var params = that.data.sid
        wx.request({
            url: hostUrl + '/store/' + params,
            method: 'GET',
            data: {},
            success: function (res) {
                var res = res.data;
                if (res.code == 1) {
                    that.setData({
                        lng: res.data.lon,
                        lat: res.data.lat,
                    })
                    console.log("", that.data.lng)
                    that.getAddress()
                } else { }
            }
        })
    },
    //获取用户所有地址
    getAddress() {
        var that = this
        if (that.data.way == 1) {
            //获取可用地址
            var params = {
                uid: that.data.uid,
                type: 1,
                oid: that.data.oid,
                origin: that.data.lng + ',' + that.data.lat,
            }
            wx.request({
                url: hostUrl + '/address',
                method: 'GET',
                data: params,
                success: function (res) {
                    var res = res.data;
                    console.log("默认地址：", res)
                    if (res.code == 1) {
                        let ll = that.data.inList
                        that.setData({
                            adsList: res.data,
                        })
                        // console.log(that.data.adsList)
                        // if (that.data.adsList.length >0){
                        that.data.adsList.forEach(item => {
                            item.checked = false
                            // ll.push(item.id)
                            that.setData({
                                // inList: ll.join(),
                            })
                            that.outAds()
                        })
                        // that.outAds()
                        // }
                    } else {
                        that.setData({
                            inList: '',
                        })
                        that.outAds()
                    }
                }
            })
        }else {
            var params = {
                uid: that.data.uid,
                oid: that.data.oid
            }
            wx.request({
                url: hostUrl + '/address',
                method: 'GET',
                data: params,
                success: function (res) {
                    var res = res.data;
                    if (res.code == 1) {
                        that.setData({
                            adsList: res.data,
                        })
                    } else { }
                }
            })
        }
    },
    //获取不可用地址
    outAds() {
        var that = this;
        var params2 = {
            uid: that.data.uid,
            ids: that.data.inList,
            oid: that.data.oid
        }
        console.log(params2)
        wx.request({
            url: hostUrl + '/address',
            method: 'GET',
            data: params2,
            success: function (res) {
                var res = res.data;
                console.log("超出配送范围：", res)
                if (res.code == 1) {
                    that.setData({
                        outList: res.data,
                    })
                    // console.log(that.data.outList)
                } else { }
            },
            complete(){
                that.setData({
                    loadingHidden: true
                });
            }
        })
    },

    //切换地址
    selectAds(e){
        var that = this;
        var adsid = e.currentTarget.dataset.id    //地址ID
        wx.setStorageSync("selected_address_id", adsid); //切换地址ID
        wx.navigateBack({
            delta: 1
        })
    },
    //设置默认地址
    setDefaultAds(e) {
        var that = this;
        var index = e.currentTarget.dataset.index
        var params = that.data.adsList[index].id + '?uid=' + that.data.uid;
        wx.request({
            url: hostUrl + '/address/' + params,
            method: 'PUT',
            data: {},
            success: function (res) {
                var res = res.data;
                if (res.code == 1) {
                    that.data.adsList.forEach((item, index) => {
                        item.checked = false;
                    })
                    that.data.adsList[index].checked = true;
                    that.setData({
                        adsList: that.data.adsList,
                    })
                }
                if (that.data.way == 1) {
                    wx.showToast({
                        title: '地址切换成功!',
                        icon: 'none',
                    })
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '/pages/cartSubpackage/pages/subOrder/subOrder?type=' + that.data.type,
                        })
                    }, 1500)
                }
                else {
                    wx.showToast({
                        title: '地址切换成功!',
                        icon: 'none',
                    })
                }

            }
        })
    },
    //删除
    deleteAds(index) {
        var that = this;
        var index = index.currentTarget.dataset.index
        that.setData({
            id: index,
        })
        that.showWarn()
        // that.remove()
    },
    //提示
    showWarn() {
        var that = this
        wx.showModal({
            title: '提示',
            content: '确定要删除该地址吗？',
            confirmColor:"#1ccfcf",
            success(res) {
                console.log(res)
                if (res.confirm) {
                    that.remove()
                } else if (res.cancel) {
                }
            }
        })
    },
    remove() {
        var that = this
        console.log(1111111111)
        var index = that.data.id
        var params = that.data.adsList[index].id
        console.log(params)
        wx.request({
            url: hostUrl + '/address/' + params,
            method: 'DELETE',
            data: '',
            success: function (res) {
                var res = res.data;
                console.log(res)
                if (res.code == 1) {
                    that.data.adsList.splice(index, 1);
                    that.setData({
                        adsList: that.data.adsList,
                    })
                    wx.showToast({
                        title: '删除成功!',
                        icon: 'none',
                    })
                } else { }
            }
        })
    }
})