// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $(".siteList");
var $lastLi = $siteList.find("li.last");
var siteList = localStorage.getItem("siteList"); //读取localStorage的数据项目

var xObject = JSON.parse(siteList); //字符串转换为对象

var hashMap = xObject || [{
  logo: "B",
  url: "https://bootcdn.cn/"
}, {
  logo: "I",
  url: "https://www.iconfont.cn"
}, {
  logo: "J",
  url: "https://www.jquery123.com"
}, {
  logo: "V",
  url: "https://v3.vuejs.org"
}, {
  logo: "W",
  url: "https://wangdoc.com/"
}];
var searchWaysHash = [{
  way: "百度",
  placeholder: "百度搜索",
  action: "https://www.baidu.com/s",
  query: "wd"
}, {
  way: "bing",
  placeholder: "bing 搜索",
  action: "https://cn.bing.com/search",
  query: "q"
}, {
  way: "谷歌",
  placeholder: "Google 搜索",
  action: "https://www.google.com/search",
  query: "q"
}, {
  way: "搜狗",
  placeholder: "搜狗搜索",
  action: "https://www.sogou.com/sogou",
  query: "query"
}, {
  way: "360",
  placeholder: "360 搜索",
  action: "https://www.so.com/s",
  query: "q"
}]; //渲染搜索方式列表

var renderSearchWays = function renderSearchWays() {
  var $searchWays = $(".searchWays");
  var $searchForm = $(".searchForm");
  var $input = $(".searchForm > input");
  searchWaysHash.forEach(function (item, index) {
    var $li = $("<li>".concat(item.way, "</li>")).appendTo($searchWays);

    if (index === 0) {
      $li.addClass("selected");
    }

    $li.on("click", function () {
      $(this).addClass("selected").siblings().removeClass("selected");
      $searchForm.attr("action", item.action);
      $input.attr("placeholder", item.placeholder);
      $input.attr("name", item.query);
    });
  });
};

renderSearchWays(); //简化url

var simplifyUrl = function simplifyUrl(url) {
  return url.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/.*/, ""); //使用正则表达式 删除‘/’开头的内容
}; //渲染站点


var render = function render() {
  $siteList.find("li:not(.last)").remove(); //删除旧的站点

  hashMap.forEach(function (node, index) {
    //插值法
    var $li = $("<li>\n          <div class=\"site\">\n            <div class=\"logo\">".concat(node.logo, "</div>\n            <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n            <div class=\"close\">\n              <svg class=\"icon\">\n                <use xlink:href=\"#icon-close\"></use>\n              </svg>\n            </div>\n          </div>\n        </li>")).insertBefore($lastLi); //跳转页面，代替 a 标签

    $li.on("click", function () {
      window.open(node.url);
    }); //删除站点

    $li.on("click", ".close", function (e) {
      e.stopPropagation(); //阻止冒泡，防止点击close时页面跳转

      hashMap.splice(index, 1);
      render();
    });
  });
};

render();
$(".addButton").on("click", function () {
  var url = window.prompt("请输入你要添加的网址：");

  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }

  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    logoType: "text",
    url: url
  });
  render();
}); //用户关闭页面之前触发

window.onbeforeunload = function () {
  // console.log("页面要关闭了");
  var string = JSON.stringify(hashMap); //将hashMap转换为字符串（localStorage只能存字符串）

  localStorage.setItem("siteList", string);
}; //键盘导航


$(document).on("keypress", function (e) {
  console.log(e.key);
  var key = e.key; //const key = e.key 变量名和属性名一样时可以用析构赋值

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.df0a7e95.js.map