// pages/article/article.js
const app=getApp();
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    this.setData
    ({
        wx:wx.request({
          url: app.get_request_url("detail", "goods"),
          method: "POST",
          data: { goods_id: 13 },
          dataType: "json",
          success(res)
          {
            console.log(res.data)
            console.log(res.data.data.goods)
            that.setData({
              goods_title: res.data.data.goods.title,
              goods_min_price: res.data.data.goods.min_price,
              goods_images: res.data.data.goods.images
            })
          }
              }),
      wx:wx.request({
        url: 'https://zdcd.online/api/article.php',
        data:{
          action:'article',
          articleId:options.id-1
        },
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          console.log(res.data)
          that.setData({
            article:res.data,
            content1: res.data.content.replace(/<img[^>]*>/gi, function (match, capture) {
              match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
              match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
              match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
              return match;
            }),
            content1:res.data.content.replace(
              /\<img/gi, '<img style="max-width:100%;height:auto" ')
          })},
        fail: function(res) {
          console.log("fail")
        },
        complete: function(res) {},
      })
            })
  },
  forgoods:function(e){
      var value = e.currentTarget.id || null;
      wx.navigateTo({ 
        url: value,
       });
      
  },
  /**

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function (){

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  videoErrorCallback: function (e) {

    console.log('视频错误信息:' + e.detail.errMsg);

  }
})