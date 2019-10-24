// pages/article-list/article-list.js
Page({

  /**
   * Page initial data
   */
  data: {
    articleList:[]

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
      // 加载loding
      this.setData({
        data_list_loding_status: 1,
      }),
    wx.request({
      url: 'https://zdcd.online/api/article.php?action=articleList',//请求地址
      header: {
        "Content-Type": "applciation/json"
      },
      method: 'GET',
      success: function (res) {
        wx.stopPullDownRefresh()
        console.log(res.data)
        that.setData({
          articleList: res.data,
        })
      },
      fail: function (err) {
        console.log("fail")
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },
  /**
   * searchdeatil function--called when article clicked
   */
  searchdetails:function(e)
  {
    console.log(e)
    var p = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/article/article?id='+p
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    
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
    this.onLoad
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

  }
})