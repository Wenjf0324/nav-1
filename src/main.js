const $siteList = $(".siteList");
const $lastLi = $siteList.find("li.last");
const siteList = localStorage.getItem("siteList"); //读取localStorage的数据项目
const xObject = JSON.parse(siteList); //字符串转换为对象
const hashMap = xObject || [
  { logo: "W", url: "https://wangdoc.com/" },
  { logo: "B", url: "https://bootcdn.cn/" },
  { logo: "J", url: "https://www.jquery123.com" },
  { logo: "V", url: "https://v3.vuejs.org" },
  { logo: "I", url: "https://www.iconfont.cn" },
  { logo: "G", url: "https://github.com" },
];
const searchWaysHash = [
  {
    way: "百度",
    placeholder: "百度搜索",
    action: "https://www.baidu.com/s",
    query: "wd",
  },
  {
    way: "bing",
    placeholder: "bing 搜索",
    action: "https://cn.bing.com/search",
    query: "q",
  },
  {
    way: "谷歌",
    placeholder: "Google 搜索",
    action: "https://www.google.com/search",
    query: "q",
  },
  {
    way: "搜狗",
    placeholder: "搜狗搜索",
    action: "https://www.sogou.com/sogou",
    query: "query",
  },
  {
    way: "360",
    placeholder: "360 搜索",
    action: "https://www.so.com/s",
    query: "q",
  },
];

//渲染搜索方式列表
const renderSearchWays = () => {
  const $searchWays = $(".searchWays");
  const $searchForm = $(".searchForm");
  const $input = $(".searchForm > input");

  searchWaysHash.forEach((item, index) => {
    const $li = $(`<li>${item.way}</li>`).appendTo($searchWays);
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
renderSearchWays();

//简化url
const simplifyUrl = (url) => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, ""); //使用正则表达式 删除‘/’开头的内容
};

//渲染站点
const render = () => {
  $siteList.find("li:not(.last)").remove(); //删除旧的站点
  hashMap.forEach((node, index) => {
    //插值法
    const $li = $(`<li>
          <div class="site">
            <div class="logo">${node.logo}</div>
            <div class="link">${simplifyUrl(node.url)}</div>
            <div class="close">
              <svg class="icon">
                <use xlink:href="#icon-close"></use>
              </svg>
            </div>
          </div>
        </li>`).insertBefore($lastLi);
    //跳转页面，代替 a 标签
    $li.on("click", () => {
      window.open(node.url);
    });
    //删除站点
    $li.on("click", ".close", (e) => {
      e.stopPropagation(); //阻止冒泡，防止点击close时页面跳转
      hashMap.splice(index, 1);
      render();
    });
  });
};

render();

$(".addButton").on("click", () => {
  let url = window.prompt("请输入你要添加的网址：");
  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    logoType: "text",
    url: url,
  });
  render();
});

//用户关闭页面之前触发
window.onbeforeunload = () => {
  // console.log("页面要关闭了");
  const string = JSON.stringify(hashMap); //将hashMap转换为字符串（localStorage只能存字符串）
  localStorage.setItem("siteList", string);
};

//键盘导航
$(document).on("keypress", (e) => {
  console.log(e.key);
  const { key } = e; //const key = e.key 变量名和属性名一样时可以用析构赋值
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
