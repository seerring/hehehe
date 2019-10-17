// pages/idxSubpackage/pages/comments/comments.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        curIndex:0,
        lvList:[
            '/pages/common/images/icon-yellow.png',
            '/pages/common/images/icon-yellow.png',
            '/pages/common/images/icon-yellow.png',
            '/pages/common/images/icon-yellow.png',
            '/pages/common/images/icon-yellow.png',
        ],
        list:[
            { id: 1, title: '全部', num: 2 },
            { id: 2, title: '有图', num: 1 },
            { id: 3, title: '追评',num: 1 },
            { id: 4, title: '有效实用',num: 1 }
        ],
        commentList:[
            { id: 1, avatar: '/images/userAvatar.png', uname: '朱小明', lvList: ['/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png'], comDate: '2018-11-28 13:47 195ml', comText: '无限回购!之前用的亦博的神仙水，感觉很浪费，这个性价比很高了!已经囤了好几瓶了！', comImgList: ['/images/goodsImg5.png', '/images/goodsImg5.png', '/images/goodsImg5.png']},
            { id: 2, avatar: '/images/userAvatar.png', uname: '朱小明', lvList: ['/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png'], comDate: '2018-11-28 13:47 195ml', comText: '无限回购!之前用的亦博的神仙水，感觉很浪费，这个性价比很高了!已经囤了好几瓶了！', comImgList: ['/images/goodsImg5.png', '/images/goodsImg5.png', '/images/goodsImg5.png'] },
            { id: 3, avatar: '/images/userAvatar.png', uname: '朱小明', lvList: ['/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png', '/pages/common/images/icon-yellow.png'], comDate: '2018-11-28 13:47 195ml', comText: '无限回购!之前用的亦博的神仙水，感觉很浪费，这个性价比很高了!已经囤了好几瓶了！', comImgList: ['/images/goodsImg5.png', '/images/goodsImg5.png', '/images/goodsImg5.png'] },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    //查看评论
    tabFun:function(e){
        console.log(e);
        var that = this;
        var index = e.currentTarget.dataset.index;
        that.setData({
            curIndex: index,
        })
    }
})