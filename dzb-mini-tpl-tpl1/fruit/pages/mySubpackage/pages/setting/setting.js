// pages/mySubpackage/pages/setting/setting.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingHidden: false,//加载
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({ loadingHidden: true, })
    },

  // 退出登录
    logout: function () {
        var oid = wx.getStorageSync('oid');
        wx.showModal({
            title: '提示',
            content: '您确定要退出吗？',
            confirmColor:'#1ccfcf',
            success(res) {
                if (res.confirm) {
                    wx.clearStorageSync();
                    wx.reLaunch({
                        url: '/pages/common/pages/login/login?oid=' + oid
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }

})