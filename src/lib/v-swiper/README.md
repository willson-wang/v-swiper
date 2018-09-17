## v-swiper

1. 基于 Vue2.x 开发，包含轮播图的基本功能
2. 轻量、高性能轮播插件。目前支持 无缝衔接自动轮播、无限轮播、手势轮播
3. 可选transition or requestAnimationFrame执行动画的方式
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
<div class="swiper-wrap" ref="swiper" :class="className" :style="{height}">
    <div class="swiper-item clearfix" ref="swiperItem" :style="styleObj" :class="[isTransition ? 'swiper-transition' : '']">
      <div v-for="(item, index) in newList" :key="index" >
        <img :src="item.img" :alt="'banner' + index" :style="{width: width + 'px', height}">
      </div>
    </div>
    <div class="swiper-dots">
      <span v-for="(item, index) in list" :key="index" :class="[index === fixIndex ? 'active' : '']"></span>
    </div>
    <div class="swiper-prev" v-if="isPrevShow" @click="changeItem('prev')">&lt;</div>
    <div class="swiper-next" v-if="isNextShow" @click="changeItem('next')">&gt;</div>
</div>

this.swiper = new Swiper(this.$refs.swiper, {
    auto: this.auto,
    loop: this.loop,
    data: this.newList,
    isTransition: this.isTransition,
    on: (res) => {
        this.transformx = res.transformx
        this.newDuration = res.newDuration
        this.fixIndex = res.fixIndex
        this.left = res.left
        this.currentIndex = res.currentIndex
    }
    })
```



## api

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

## EVENT

| 事件               |        说明                  |  返回值      |
| ---               |         ---                  | -----         |
| annimateEnd              | 每次轮播结束触发         |  当前swiper实例 |
| selectItem              | 当前点击的图片            |  currentIndex |

