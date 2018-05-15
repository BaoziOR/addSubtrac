
var constValue = require('../../utils/constValue.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "../../resources/imgs/answer/",
    start: 0,
    num: 5, //倒计时数字
    interval: null,
    progressWidth: 634,
    subtraction: 0,
    minuend: 0,
    result: 0, //1表示正确，0表示错误
    operator: 0, //0表示减号， 1表示加号
    numIndex: 0,
    answer: 0, //0表示本题错误，1表示对
    time: 0,
    gameOver: 0 //0表示没结束，1表示失败结束, 2表示胜利结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ready();
  },

  ready: function() {
    var that = this;
    this.data.interval = setInterval(function() {
      that.countDown();
    }, 800);
  }, 

  countDown: function() {   
    if (this.data.num > 0) {
      this.data.num--;
      this.setData({
        num: this.data.num
      })
    } else if (this.data.num == 0) {
      clearInterval(this.data.interval);
      this.data.interval = null;
      this.data.start = 1;
      this.setData({
        start: this.data.start
      })
      this.nextSubject();
      /*
      var that = this;
      this.data.interval = setInterval(function() {
        that.answer();
      }, 200);*/
    }
  }, 

  answer: function() {
    if (this.data.progressWidth > 0) {
      this.data.progressWidth -= 634 / (this.data.time * 5) ;
      if (this.data.progressWidth <= 0) {
        this.data.progressWidth = 0;
      }
      this.setData({
        progressWidth: this.data.progressWidth
      })
      if (this.data.progressWidth <= 0) {
        this.gameOver(false);
      }
    }
  },

  correctButtonTap: function() {
    if (this.data.gameOver != 0) {
      return;
    }
    if (this.data.result == 1) { 
      if (this.data.numIndex >= constValue.MAX_SUBJECT_NUM) {
        this.gameOver(true);
        return;
      } 
      if (this.data.numIndex == 1) {
        var that = this;
        this.data.interval = setInterval(function () {
          that.answer();
        }, 200);
      }    
      this.nextSubject();
    } else {
      this.gameOver(false);
    }
  },

  wrontButtonTap: function() {
    if (this.data.gameOver != 0) {
      return;
    }
    console.log('wrong button tap.......')
    if (this.data.result == 0) {
      if (this.data.numIndex >= constValue.MAX_SUBJECT_NUM) {
        this.gameOver(true);
        return;
      }  
      if (this.data.numIndex == 1) {
        var that = this;
        this.data.interval = setInterval(function () {
          that.answer();
        }, 200);
      }       
      this.nextSubject();
    } else {
      this.gameOver(false);      
    }   
  },

  nextSubject: function() {
    this.data.numIndex++;
    this.data.progressWidth = 634;
    this.setData({
      progressWidth: this.data.progressWidth
    })
    var dataInfo = null;
    var offset = this.getOffset(this.data.numIndex);
    if (this.data.numIndex < 11) {
      dataInfo = this.ruleA(offset);
    } else if (this.data.numIndex < 16) {
      if (Math.random() < 0.5) {
        dataInfo = this.ruleA(offset);
      } else {
        dataInfo = this.ruleB(offset);
      }
    } else if (this.data.numIndex < 31) {
      var rand = Math.random();
      if (rand < 0.2) {
        dataInfo = this.ruleA(offset);
      } else if (rand < 0.4) {
        dataInfo = this.ruleB(offset);
      } else if (rand < 0.6) {
        dataInfo = this.ruleC(offset);
      } else if (rand < 0.9) {
        dataInfo = this.ruleD(offset);
      } else {
        dataInfo = this.ruleE(offset);
      }
    } else if (this.data.numIndex < 36) {
      var rand = Math.random();
      if (rand < 0.1) {
        dataInfo = this.ruleA(offset);
      } else if (rand < 0.2) {
        dataInfo = this.ruleB(offset);
      } else if (rand < 0.6) {
        dataInfo = this.ruleD(offset);
      } else {
        dataInfo = this.ruleE(offset);
      }
    } else {
      var rand = Math.random();
      if (rand < 0.5) {
        dataInfo = this.ruleE(offset);
      } else {
        dataInfo = this.ruleG(offset);
      }      
    }
    app.console.log(dataInfo);
    this.data.subtraction = dataInfo[0];
    this.data.minuend = dataInfo[2];
    this.data.operator = dataInfo[1];
    this.data.answer = dataInfo[3];
    this.data.result = dataInfo[4];
    this.data.time = this.getTime(this.data.numIndex);
    this.setData({
      progressWidth: this.data.progressWidth,
      subtraction: this.data.subtraction,
      minuend: this.data.minuend,
      answer: this.data.answer,
      operator: this.data.operator, 
      numIndex: this.data.numIndex    
    })
  },

  gameOver: function(win) {
    clearInterval(this.data.interval);
    if (win) {
      this.data.gameOver = 2;
    } else {
      this.data.gameOver = 1;
    }   
    this.setData({
      gameOver: this.data.gameOver 
    })
    app.updateMaxScoreAndDollNum(this.data.numIndex, win);
  },

  quitGame: function() {
    app.console.log('quit game')
    wx.redirectTo({
      url: '../main/main'
    })
  },

  ruleA: function(offset) {
    var add1 = Math.floor(Math.random() * 9) + 1;
    var add2 = Math.floor(Math.random() * 9) + 1;
    if (Math.random() < 0.5) {
      var answer = add1 + add2;
    } else {
      var answer = (add1 + add2) + Math.floor(Math.random() * 2 * offset) - offset;
    }   
    var ret = (add1 + add2) == answer ? 1 : 0;  
    return [add1, '+', add2, answer, ret];
  },

  ruleB: function(offset) {
    var num1 = Math.floor(Math.random() * 9) + 1;
    var num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    if (Math.random() < 0.5) {
      var answer = num1 - num2;
    } else {
      var answer = (num1 - num2) + Math.floor(Math.random() * 2 * offset) - offset;
    }    
    var ret = (num1 - num2) == answer ? 1 : 0;   
    return [num1, "-", num2, answer, ret];
  },

  ruleC: function(offset) {
    var num1 = Math.floor(Math.random() * 9) + 1;
    var num2 = Math.floor(Math.random() * (10 - num1)) + num1;
    if (Math.random() < 0.5) {
      var answer = (num1 - num2);
    } else {
      var answer = (num1 - num2) + Math.floor(Math.random() * 2 * offset) - offset;
    }   
    var ret = (num1 - num2) == answer ? 1 : 0;
    app.console.log('rulec')   
    return [num1, "-", num2, answer, ret];
  },

  ruleD: function (offset) {
    var num1 = Math.floor(Math.random() * 89) + 10;
    var num2 = Math.floor(Math.random() * 89) + 10;
    if (Math.random() < 0.5) {
      var answer = (num1 + num2);
    } else {
      if (Math.random() < 0.5) {
        var answer = (num1 + num2) + Math.floor(Math.random() * 2 * offset) - offset;
      } else {
        var answer = (num1 + num2) + (Math.random() < 0.5 ? 10 : -10);
      }      
    }    
    var ret = (num1 + num2) == answer ? 1 : 0;
    app.console.log('ruled')   
    return [num1, "+", num2, answer, ret];
  },

  ruleE: function (offset) {
    var num1 = Math.floor(Math.random() * 89) + 10;
    var num2 = Math.floor(Math.random() * 89) + 10;
    if (Math.random() < 0.5) {
      var answer = (num1 - num2);
    } else {
      if (Math.random() < 0.5) {
        var answer = (num1 - num2) + Math.floor(Math.random() * 2 * offset) - offset;
      } else {
        var answer = (num1 - num2) + (Math.random() < 0.5 ? 10 : -10);
      }
    }
    var ret = (num1 - num2) == answer ? 1 : 0;   
    return [num1, "-", num2, answer, ret];
  },

  ruleF: function (offset) {
    var num1 = Math.floor(Math.random() * 900) + 50;
    var num2 = Math.floor(Math.random() * 900) + 50;
    if (Math.random() < 0.5) {
      var answer = (num1 + num2);
    } else {
      if (Math.random() < 0.5) {
        var answer = (num1 + num2) + Math.floor(Math.random() * 2 * offset) - offset;
      } else {
        var answer = (num1 + num2) + (Math.random() < 0.5 ? 10: -10);
      }      
    }    
    var ret = (num1 + num2) == answer ? 1 : 0;
    app.console.log('rulee')   
    return [num1, "+", num2, answer, ret];
  },

  ruleG: function (offset) {
    var num1 = Math.floor(Math.random() * 900) + 50;
    var num2 = Math.floor(Math.random() * 900) + 50;
    if (Math.random() < 0.5) {
      var answer = (num1 - num2);
    } else {
      if (Math.random() < 0.5) {
        var answer = (num1 - num2) + Math.floor(Math.random() * 2 * offset) - offset;
      } else {
        var answer = (num1 - num2) + (Math.random() < 0.5 ? 10 : -10);
      }
    }
    var ret = (num1 - num2) == answer ? 1 : 0;  
    return [num1, "-", num2, answer, ret];
  },

  getOffset: function(num) {
    if (num < 11) {
      return 2;
    } else if (num < 16) {
      return 3;
    } else if (num < 31) {
      return 2;
    } else if (num < 36) {
      return 3;
    } 
    return 2;
  },

  getTime: function(num) {
    app.console.log('xxxxxxxxxxxxxxxget today dollnum')
    app.console.log(app.getTodayAllGotDollNum())
    if (app.getTodayAllGotDollNum() < 5) {
      if (num < 21) {
        return 5;
      } else if (num < 25) {
        return 3;
      } else if (num < 30) {
        return 2
      }
      return 1.5;
    } else {
      if (num < 21) {
        return 5;
      } else if (num < 25) {
        return 2.5;
      } 
      return 1.5;
    }    
    return 1.5;
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})