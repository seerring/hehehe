// pages/idxSubpackage/pages/limitTime/limitTime.js
const hostUrl = require('../../../../config').hostUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        backTopVal: false,
        paged: 1,
        proLists: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCommissionList();
    },
    getCommissionList: function () {
        var that     = this;
        var paged    = that.data.paged;
        var proLists = that.data.proLists;
        var oid      = wx.getStorageSync('oid');
        wx.request({
            url: hostUrl + '/commission',
            data: {
                'oid': oid,
                'paged': paged
            },
            method: 'GET',
            success: function (result) {
                console.log(result.data);
                var res = result.data;
                if (res.code == 1) {
                    var datas = res.data;
                    for (var i = 0; i < datas.length; i++) {
                        proLists.push(datas[i]);
                    }
                    that.setData({ proLists: proLists })
                    paged++;
                    that.setData({ paged: paged })
                } else {
                    that.setData({
                        isempty: true //显示底线
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
    //监听滚动条坐标
    onPageScroll(e) {
        var that = this;
        var scrollTop = e.scrollTop;
        var backTopVal = scrollTop > 0 ? true : false;
        that.setData({
            backTopVal: backTopVal,
        })
    },
    //返回顶部
    backTop() {
        //控制滚动
        wx.pageScrollTo({
            scrollTop: 0,
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        console.log(res);
        var that   = this
        var uid    = wx.getStorageSync('uid');
        var oid    = wx.getStorageSync('oid');
        if (res.from === 'button') {
            // 来自页面内转发按钮
            var goods_title = res.target.dataset.item.product_name;
            var sharePt = res.target.dataset.item.product_images;
            var pid = res.target.dataset.item.id;
            console.log(res.target);
            console.log("2222");
        }
        return {
            path: 'pages/idxSubpackage/pages/proDetails/proDetails?oid=' + oid + '&id=' + pid + '&shareuid=' + uid + '&from=share',
            title: goods_title,
            imageUrl: sharePt
        }
    }
})