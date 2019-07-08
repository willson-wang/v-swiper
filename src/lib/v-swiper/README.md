## v-swiper

1. 基于 Vue2.x 开发，包含轮播图的基本功能
2. 轻量、高性能轮播插件。目前支持 无缝衔接自动轮播、无限轮播、手势轮播
3. 基于css3，transition实现的过度动画
4. 无任何第三方依赖，原生 js 封装
5. 完整的单元测试

## NPM

```
npm i v-swiper --save | yarn add v-swiper
```

## demo地址

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
<swiper :list="bannerList" height="180px" :loop="true" :auto="false" :showDots="true" v-model="swiperIndex" @selectItem="selectItem"></swiper>
<div style="margin-top: 10px"></div>
<swiper
    :list="bannerList"
    height="180px"
    :loop="true"
    :auto="true"
    direction="vertical"
></swiper>
<div style="margin-top: 10px"></div>
<div class="broadcast">
    <p></p>
    <swiper
        :isBroadcast="true"
        :showDots="false"
        :list="bannerList"
        height="30px"
        :loop="true"
        :auto="true"
    >
    </swiper>
</div>
<div style="margin-top: 10px"></div>
<div class="broadcast">
    <p></p>
    <swiper
        :isBroadcast="true"
        :showDots="false"
        :list="bannerList"
        height="30px"
        :loop="true"
        :auto="true"
        :minMovingDistance="10"
        direction="vertical"
    ></swiper>
</div>

bannerList: [
    {
        img: require('./assets/pic1.jpg'),
        href: '0',
        txt: '这是一条消息0'
    },
    {
        img: require('./assets/pic2.jpg'),
        href: '1',
        txt: '这是一条消息1'
    },
    {
        img: require('./assets/pic3.png'),
        href: '2',
        txt: '这是一条消息2'
    },
    {
        img: require('./assets/pic4.jpg'),
        href: '3',
        txt: '这是一条消息3'
    }
],
```



## api

| 参数               |        说明                  | 类型    | 默认值       |
| ---               |         ---                  | ---    | ---         |
| list              | banner图片列表                | Array   | []          |
| direction         | 轮播图轮播方向                 | String  | ‘horizontal’ |
| showDots          | 是否显示dot                   | Boolean | true     |
| height            | 图片高度                      | String  | '180px'    |
| auto              | 是否自动轮播                   | Boolean | false     |
| loop              | 是否无缝轮播                   | loop    | false     |
| duration          | 轮播动画时长                   | Number  | 450       |
| interval          | 轮播动画间隔                   | Number  | 4000     |
| minMovingDistance | touchmove最小距离             | Number  | 30        |
| className         | 样式                          | String  | ''        |
| isBroadcast         | 是否已广播的形式展示                          | Boolean  | false        |

## EVENT

| 事件               |        说明                  |  返回值      |
| ---               |         ---                  | -----         |
| swiperEnd              | 每次轮播结束触发         |  当前swiper实例 |
| selectItem              | 当前点击的图片            |  currentIndex |

