// pages/mySubpackage/pages/refundDetails/refundDetails.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currIndex: -1,
        isShowModal: false,
        maxLen: 200,
        refundWay: '',
        status: '',
        statusList: ["未收到货", "已收到货"],
        imgLists: [],
        list1: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        var refundWay = options.name;
        if (refundWay == '退货退款') {
            wx.setNavigationBarTitle({
                title: '申请退货退款',
            })
        }
        if (refundWay == '仅退款') {
            wx.setNavigationBarTitle({
                title: '申请退款',
            })
        }
        var that = this;
        that.setData({
            refundWay: refundWay,
        })
    },
    //收货状态
    radioChange: function (e) {
        console.log(e);
        var that = this;
        var status = e.detail.value;
        that.setData({
            status: status,
        })
    },
    //退款描述
    maxSize: function (e) {
        console.log(e)
        var that = this;
        var maxLen = 200;
        var len = e.detail.value;
        maxLen -= len.length;
        that.setData({
            maxLen: maxLen,
        })
    },
    //上传图片
    addImg: function () {
        var that = this;
        wx.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var imgLists = res.tempFilePaths;
                console.log(imgLists)
                if (that.data.imgLists.length + imgLists.length < 4) {
                    for (var i = 0; i < imgLists.length; i++) {
                        that.data.imgLists.push(imgLists[i])
                    }
                    that.setData({
                        imgLists: that.data.imgLists,
                    })
                }
                else {
                    for (var i = 0; i < 4 - that.data.imgLists.length; i++) {
                        that.data.imgLists.push(imgLists[i])
                    }
                    that.setData({
                        imgLists: that.data.imgLists,
                    })
                }
            },
        })
    },
    //删除图片
    clickDel: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var imgLists = that.data.imgLists;
        imgLists.splice(index, 1);
        that.setData({
            imgLists: imgLists,
        })

    },
    chooseReason: function () {
        var that = this;
        var refundWay = that.data.refundWay;
        if (refundWay == '仅退款') {
            var status = that.data.status;
            if (status == '未收到货') {
                that.setData({
                    list1: [
                        { title: '未收到货，不想要了' },
                        { title: '我已拒收' }
                    ],
                    isShowModal: true,
                })
            }
            else if (status == '已收到货') {
                that.setData({
                    list1: [
                        { title: '商品质量问题' },
                        { title: '商品与页面描述不符' },
                        { title: '收到商品损坏' },
                        { title: '商品错发' },
                        { title: '商品漏发' }
                    ],
                    isShowModal: true,
                })
            }
            else {
                wx.showToast({
                    icon: 'none',
                    title: '请选择收货状态！',
                })
            }
        }
        else {
            that.setData({
                list1: [
                    { title: '商品质量问题' },
                    { title: '商品与页面描述不符' },
                    { title: '收到商品损坏' },
                    { title: '商品错发' },
                    { title: '商品漏发' },
                    { title: '无理由退货' },
                    { title: '我已拒收' }
                ],
                isShowModal: true,
            })
        }
    },
    closeModal: function () {
        var that = this;
        that.setData({
            isShowModal: false,
        })
    },
    //选择原因
    bindRefund: function (e) {
        console.log(e)
        var that = this;
        var index = e.currentTarget.dataset.index;
        that.setData({
            currIndex: index,
            isShowModal: false,
        })
    }
})