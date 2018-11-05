## v-swiper

1. 基于 Vue2.x 开发，包含轮播图的基本功能
2. 轻量、高性能轮播插件。目前支持 无缝衔接自动轮播、无限轮播、手势轮播
3. 可选transition or requestAnimationFrame执行动画的方式
4. 无任何第三方依赖，原生 js 封装
5. 完整的单元测试

## 在线demo地址

[demo预览](https://willson-wang.github.io/v-swiper/dist/index.html)

## NPM

```
npm i v-swiper --save | yarn add v-swiper
```

## 引入插件

```
import Vue from 'vue'
import swiper from 'v-swiper'

new Vue({
    el: 'body',
    components: {swiper}
});
```

## 基本用法

```
<swiper :list="bannerList" height="180px" :loop="true" :auto="true"></swiper>
<div style="margin-top: 10px"></div>
<swiper :list="bannerList" height="180px" :loop="true" :auto="true" direction="vertical"></swiper>
<div style="margin-top: 10px"></div>
<div class="broadcast">
    <p></p>
    <swiper :isBroadcast="true" :showDots="false" :list="bannerList" height="30px" :loop="true" :auto="true">
    </swiper>
</div>
<div style="margin-top: 10px"></div>
<div class="broadcast">
    <p></p>
    <swiper :isBroadcast="true" :showDots="false" :list="bannerList" height="30px" :loop="true" :auto="true" direction="vertical"></swiper>
</div>

bannerList: [{
    url: 'javascript:',
    img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg',
    txt: '这是一条消息1,这是一条消息1，这是一条消息1，这是一条消息1'
}, {
    url: 'javascript:',
    img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg',
    txt: '这是一条消息2'
}, {
    url: 'javascript:',
    img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg',
    txt: '这是一条消息3'
}, {
    url: 'javascript:',
    img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5tg4hkj20gl087dgs.jpg',
    txt: '这是一条消息4'
}, {
    url: 'javascript:',
    img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl63v7dej20jc0a9754.jpg',
    txt: '这是一条消息5'
}, {
    url: 'javascript:',
    img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl6am6l6j20j70a7myf.jpg',
    txt: '这是一条消息6'
}]
```



## API

| 参数               |        说明                  | 类型    | 默认值       |
| ---               |         ---                  | ---    | ---         |
| list              | banner图片列表                | Array   | []          |
| direction         | 轮播图轮播方向                 | String  | ‘horizontal’ |
| showDots          | 是否显示dot                   | Boolean | true     |
| dotsPosition      | dot位置                      | String  | 'center'     |
| height            | 图片高度                      | String  | '180px'    |
| auto              | 是否自动轮播                   | Boolean | false     |
| loop              | 是否无缝轮播                   | loop    | false     |
| duration          | 轮播动画时长                   | Number  | 450       |
| interval          | 轮播动画间隔                   | Number  | 4000     |
| animateInterval   | requestAnimationFrame动画间隔 | Number  | 20        |
| isTransition      | 是否使用transition进行轮播动画  | Boolean | true     |
| minMovingDistance | touchmove最小距离             | Number  | 30        |
| threshold         | 切换到下一张最小移动间距         | Number  | 50        |
| isPrevShow        | 是否显示切换上一张箭头           | Boolean | false     |
| isNextShow        | 是否显示切换下一张箭头           | Boolean | false     |
| className         | 样式                          | String  | ''        |
| isBroadcast         | 是否已广播的形式展示                          | Boolean  | false        |


## EVENT

| 事件               |        说明                  |  返回值      |
| ---               |         ---                  | -----         |
| annimateEnd              | 每次轮播结束触发         |  当前swiper实例 |
| selectItem              | 当前点击的图片            |  currentIndex |