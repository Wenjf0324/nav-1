const $siteList = $(".siteList");
const $lastLi = $siteList.find("li.last");
const x = localStorage.getItem("x"); //读取localStorage的数据项目
const xObject = JSON.parse(x); //字符串转换为对象
const hashMap = xObject || [
  { logo: "W", url: "https://www.w3school.com.cn" },
  { logo: "J", url: "https://www.jquery123.com" },
  { logo: "V", url: "https://v3.vuejs.org" },
  { logo: "I", url: "https://www.iconfont.cn" },
  { logo: "G", url: "https://github.com" },
];

//简化url
const simplifyUrl = (url) => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, ""); //使用正则表达式 删除‘/’开头的内容
};

const render = () => {
  $siteList.find("li:not(.last)").remove();
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
    $li.on("click", () => {
      window.open(node.url); //打开新窗口
    });
    //删除网站
    $li.on("click", ".close", (e) => {
      e.stopPropagation(); //阻止冒泡
      hashMap.splice(index, 1);
      render();
    });
  });
};

render();

$(".addButton").on("click", () => {
  let url = window.prompt("请问你要添加的网址是啥？");
  if (url.indexOf("http") !== 0) {
    url = "https://" + url;
  }
  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    logoType: "text",
    url: url,
  });
  render();
});

window.onbeforeunload = () => {
  //当窗口即将被关闭时会触发该事件
  const string = JSON.stringify(hashMap); //将hashMap转换为字符串（localStorage只能存字符串）
  localStorage.setItem("x", string); //增加数据项目
};

$(document).on("keypress", (e) => {
  const { key } = e; //const key = e.key;
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
