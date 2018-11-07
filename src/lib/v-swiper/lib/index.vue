<template>
  <div class="swiper-wrap" ref="swiper" :class="className" :style="{height}">
    <div class="swiper-content clearfix" ref="swiperContent" :style="styleObj" :class="[isTransition ? 'swiper-transition' : '']">
      <div v-for="(item, index) in newList" class="swiper-item" :key="index" @click="selectItem(item)">
        <img v-if="!isBroadcast" :src="item.img" :alt="'banner' + index" :style="{width, height}">
        <div class="swiper-txt" v-else :style="{width, height, lineHeight: height}">
          {{item.txt}}
        </div>
      </div>
    </div>
    <div class="swiper-dots" v-if="showDots">
      <span v-for="(item, index) in list" :key="index" :class="[index === fixIndex ? 'active' : '']"></span>
    </div>
    <div class="swiper-prev" v-if="isPrevShow" @click="changeItem('prev')">&lt;</div>
    <div class="swiper-next" v-if="isNextShow" @click="changeItem('next')">&gt;</div>
  </div>
</template>

<script>
import Swiper from './swiper'
export default {
  name: 'swiper',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    showDots: {
      type: Boolean,
      default: true
    },
    dotsPosition: {
      type: String,
      default: 'center'
    },
    height: {
      type: String,
      default: '180px'
    },
    auto: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 450
    },
    interval: {
      type: Number,
      default: 4000
    },
    animateInterval: {
      type: Number,
      default: 20
    },
    isTransition: {
      type: Boolean,
      default: true
    },
    minMovingDistance: {
      type: Number,
      default: 30
    },
    threshold: {
      type: Number,
      default: 50
    },
    isPrevShow: {
      type: Boolean,
      default: false
    },
    isNextShow: {
      type: Boolean,
      default: false
    },
    className: {
      type: String
    },
    initWidth: String,
    isBroadcast: {
      type: Boolean,
      default: false
    },
    forbidTouchStart: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    newList () {
      if (this.loop && this.list.length) {
        const tempArr = JSON.parse(JSON.stringify(this.list))
        tempArr.unshift(this.list[this.list.length - 1])
        tempArr.push(this.list[0])
        return tempArr
      }
      return this.list
    },
    styleObj () {
      const transformx = this.direction === 'horizontal' ? this.transformx : 0
      const transformy = this.direction === 'horizontal' ? 0 : this.transformx
      const left = this.direction === 'horizontal' ? this.left : 0
      const top = this.direction === 'horizontal' ? 0 : this.left
      const width = this.direction === 'horizontal' ? parseInt(this.width) * this.newList.length + 'px' : '100%'
      return {
        width,
        transform: `translate3d(${transformx}, ${transformy}, 0)`,
        transitionDuration: `${this.newDuration}ms`,
        left: left + 'px',
        top: top + 'px'
      }
    }
  },
  data () {
    let height = this.remHeightToPx();
    const initTransform = this.direction === 'horizontal' ? (this.initWidth || window.innerWidth) : parseFloat(height)
    const width = this.direction === 'horizontal' ? (this.initWidth || window.innerWidth + 'px') : '100%'
    return {
      width,
      currentIndex: this.loop ? 1 : 0,
      transformx: this.loop && this.isTransition ? `-${initTransform}px` : 0,
      fixIndex: 0,
      newDuration: this.isTransition ? this.duration : 0,
      left: this.loop && !this.isTransition ? `-${initTransform}` : 0
    }
  },
  watch:{
    list (val) {
      this.$nextTick(() => {
        this.recomputed()
        this.initSwiper()
      })
    }
  },
  methods: {
    changeItem (key) {
      this.swiper.move(key)
    },
    selectItem (item) {
      this.$emit('selectItem', {...item, currentIndex: this.fixIndex})
    },
    initSwiper () {
      this.swiper = new Swiper(this.$refs.swiper, {
        auto: this.auto,
        loop: this.loop,
        data: this.newList,
        isTransition: this.isTransition,
        direction: this.direction,
        height: this.height,
        width: this.width,
        interval: this.interval,
        forbidTouchStart: this.forbidTouchStart,
        on: (res) => {
          this.transformx = res.transformx
          this.newDuration = res.newDuration
          this.fixIndex = res.fixIndex
          this.left = res.left
          this.currentIndex = res.currentIndex
        },
        end: (res) => {
          this.$emit('annimateEnd', res)
        },
        resize: () => {
          this.recomputed()
        }
      })
    },
    recomputed () {
      const rect = this.$refs.swiper && this.$refs.swiper.getBoundingClientRect()
      let height = this.remHeightToPx()
      this.width = rect.width + 'px'
      const initTransform = this.direction === 'horizontal' ? rect.width : parseFloat(height)
      this.transformx = this.loop && this.isTransition ? `-${initTransform}px` : 0
      this.left = this.loop && !this.isTransition ? `-${initTransform}` : 0
    },
    remHeightToPx () {
      let htmlFontSize = window.getComputedStyle(document.documentElement).fontSize || (document.documentElement.currentStyle && document.documentElement.currentStyle['font-size']) || '75px'
      let reg = /rem/ig
      return reg.test(this.height) ? parseFloat(this.height) * parseInt(htmlFontSize) : this.height
    }
  },
  mounted () {},
  beforeDestroy () {
    this.swiper.destroy()
  }
}
</script>

<style lang="less" scoped>
.swiper-wrap {
  width: 100%;
  position: relative;
  overflow: hidden;

  .swiper-content {
    position: relative;
    >div {
      float: left;
      font-size: 0;
    }

    .swiper-txt {
      font-size: 14px;
      color: #e64848;
      margin: 0;
      text-align: left;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      // hack 安卓下line-height布局中的bug
      &::before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 0;
          height: 100%;
          margin-top: 3px;
      }
    }
  }

  .swiper-dots {
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%, 0);
    font-size: 0;
    padding: 0 5px;
    span {
      display: inline-block;
      vertical-align: middle;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: transparent;
      margin-right: 5px;
      border: 1px solid #fff;

      &:last-of-type {
        margin-right: 0;
      }
    }

    .active {
      background-color: rgb(0, 174, 133);
      border-color:  rgb(0, 174, 133);
    }
  }

  .swiper-transition {
      transition: all 0.5s ease 0s;
  }

  .swiper-prev, .swiper-next {
    position: absolute;
    top: 50%;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    text-align: center;
    margin-top: -15px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .swiper-prev {
    left: 5%;
  }

  .swiper-next {
    right: 5%;
  }

  .clearfix::after {
      display: block;
      content: '';
      clear: both;
  }
}
</style>
