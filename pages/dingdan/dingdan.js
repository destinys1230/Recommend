const util = require('../../utils/util.js')

var arr = new Array();         //先声明一维
for (var i = 0; i < 4; i++)          //一维长度为4
  arr[i] = new Array();    //在声明二维
var shuju_value = new Array();         //先声明一维
for (var i = 0; i < 4; i++)          //一维长度为4
  shuju_value[i] = new Array();    //在声明二维
Page({

  data: {
    currtab: 0,
    swipertab: [{ name: '待付款', index: 0 }, { name: '已支付', index: 1 }],
    list: arr,
    management_good: false,
    select_all: false,
    middlearr: [],
    boolean: true
  },

  chaxun: function (now_j, res_data) {
    var nums = 0;
    let that = this;
    console.log(res_data)
    var now_i = res_data[now_j].paid;
    var val1_string = res_data[now_j].valstr.substring(0, 2);
    var val1 = parseInt(val1_string);
    var val2_string = res_data[now_j].valstr.substring(2, 4);
    var val2 = parseInt(val2_string);

    shuju_value[now_i][now_j] = { val1: val1, val2: val2, valstr: res_data[now_j].valstr, commontime: res_data[now_j].genTime };
    //console.log(shuju_value[now_i][now_j]);
    wx.request({
      url: 'https://zdcd.online/api/recsys.php',
      data: {
        action: 'explain',
        set: 1,
        result: 1,
        val: 1,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log(res.data);
        //console.log(now_i);
        //console.log(now_j);
        arr[now_i][now_j] = { name: res.data, status: res.data, money: res_data[now_j].price, checked: false };
        if (now_j + 1 < res_data.length)
          that.chaxun(now_j + 1, res_data)
        else {
          that.setData({
            list: arr,
          })
          console.log(that.data.list);
        }
      }
    })

  },

  lishi_select: function (e) {
    let that = this;
    if (that.data.management_good == true)
      that.select(e);
    else
      that.lishipage(e);
  },


  lishipage: function (e) {
    let that = this;
    console.log(e);
    var now_index_i = that.data.currtab;
    var now_index_j = e.currentTarget.dataset.index;
    wx.setStorageSync('prepage', 1);
    wx.setStorageSync('programSet', now_index_i + 1)

    wx.setStorageSync('val1', shuju_value[now_index_i][now_index_j].val1)
    wx.setStorageSync('val2', shuju_value[now_index_i][now_index_j].val2)
    wx.setStorageSync('valstr', shuju_value[now_index_i][now_index_j].valstr)

    wx.navigateTo({
      url: '../answer/answer',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let that = this;
    for (var i = 0; i <2; i++)          //一维长度为4
      arr[i] = [];    //在声明二维


    for (var i = 0; i < 2; i++)          //一维长度为4
      shuju_value[i] = [];    //在声明二维
    for (var i = 0; i < 2; i++) {
      wx.request({
        url: 'https://zdcd.online/api/db.php',
        data: {
          action: 'order',
          unionId: wx.getStorageSync('unionid'),
          paid: i
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          console.log(res.data);
          //console.log(res.data.length);
          if (res.data.length > 0)
            that.chaxun(0, res.data);
        }
      })
    }
  },


  // 管理商品
  management: function () {
    let that = this;
    that.setData({
      management_good: true,
    })
  },
  finish_management: function () {
    let that = this;
    that.setData({
      management_good: false,
    })
  },
  // 选择
  select: function (e) {
    var that = this;
    let arr2 = [];
    if (that.data.management_good == false) {
      return;
    } else {
      var arrs = that.data.list;
      var index = e.currentTarget.dataset.index;
      arrs[that.data.currtab][index].checked = !arrs[that.data.currtab][index].checked;
      console.log(arrs[that.data.currtab]);

      for (let i = 0; i < arrs[that.data.currtab].length; i++) {
        if (arrs[that.data.currtab][i].checked) {
          arr2.push(arrs[that.data.currtab][i])
        }
      };
      that.setData({
        list: arrs,
        middlearr: arr2
      })
    }
  },
  // 删除
  deleteitem: function () {
    var that = this;
    let arrs = that.data.list;
    let arr2 = [];
    console.log(arr);
    for (let i = 0; i < arrs[that.data.currtab].length; i++) {
      if (arrs[that.data.currtab][i].checked == true) {
        wx.request({
          url: 'https://zdcd.online/api/db.php',
          data: {
            unionId: wx.getStorageSync('unionid'),
            time: shuju_value[that.data.currtab][i].commontime,
            star: 1,
            action: 'del',

          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function (res) {
            that.onLoad();
          }
        })
      } else if (arrs[that.data.currtab][i].checked == false) {
        arr2.push(arrs[that.data.currtab][i]);
      }
    }
    arrs[that.data.currtab] = arr2;
    that.setData({
      list: arrs,
      middlearr: []
    })
  },
  // 全选
  select_all: function () {
    let that = this;
    that.setData({
      select_all: !that.data.select_all
    })
    if (that.data.select_all) {
      let arrs = that.data.list;
      let arr2 = [];
      for (let i = 0; i < arrs[that.data.currtab].length; i++) {
        if (arrs[that.data.currtab][i].checked == true) {
          arr2.push(arrs[that.data.currtab][i]);
        } else {
          arrs[that.data.currtab][i].checked = true;
          arr2.push(arrs[that.data.currtab][i]);
        }
      }
      that.setData({
        list: arrs,
        middlearr: arr2
      })
    }
  },
  // 取消全选
  select_none: function () {
    let that = this;
    that.setData({
      select_all: !that.data.select_all
    })
    let arrs = that.data.list;
    let arr2 = [];
    for (let i = 0; i < arrs[that.data.currtab].length; i++) {
      arrs[that.data.currtab][i].checked = false;
      arr2.push(arr[i]);
    }
    that.setData({
      list: arrs,
      middlearr: []
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */

  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
  },

  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },
  tabSwitch: util.throttle(function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
    this.setData({
      management_good: false,
      select_all: false,
      middlearr: [],
      boolean: true
    })

  }, 500),
    tabChange: util.throttle(function (e) {
    this.setData({ currtab: e.detail.current })
    this.setData({
      management_good: false,
      select_all: false,
      middlearr: [],
      boolean: true
    })
  }, 500),

})

