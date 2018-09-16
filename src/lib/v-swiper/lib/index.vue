<template>
  <div class="swiper-wrap" ref="swiper" :class="className" :style="{height}">
    <div class="swiper-item clearfix" ref="swiperItem" :style="styleObj" :class="[isTransition ? 'swiper-transition' : '']">
      <div v-for="(item, index) in newList" :key="index" @click="selectItem(item)">
        <img :src="item.img" :alt="'banner' + index" :style="{width: width + 'px', height}">
      </div>
    </div>
    <div class="swiper-dots">
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
      default: []
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    showDots: {
      type: Boolean,
      default: false
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
      default: false
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
    }
  },
  computed: {
    width () {
      return typeof window !== 'undefined' && window.innerWidth
    },
    newList () {
      if (this.loop) {
        const tempArr = JSON.parse(JSON.stringify(this.list))
        tempArr.unshift(this.list[this.list.length - 1])
        tempArr.push(this.list[0])
        return tempArr
      }
      return this.list
    },
    styleObj () {
      return {
        width: this.width * this.newList.length + 'px',
        transform: `translate3d(${this.transformx}, 0, 0)`,
        transitionDuration: `${this.newDuration}ms`,
        left: this.left + 'px'
      }
    }
  },
  data () {
    return {
      currentIndex: this.loop ? 1 : 0,
      transformx: this.loop && this.isTransition ? `-${window && window.innerWidth}px` : 0,
      fixIndex: 0,
      newDuration: this.isTransition ? this.duration : 0,
      left: this.loop && !this.isTransition ? `-${window && window.innerWidth}` : 0
    }
  },
  methods: {
    changeItem (key) {
      key === 'next' ? this.go(++this.currentIndex, 'next') : this.go(--this.currentIndex, 'prev')
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
        on: (res) => {
          this.transformx = res.transformx
          this.newDuration = res.newDuration
          this.fixIndex = res.fixIndex
          this.left = res.left
          this.currentIndex = res.currentIndex
        },
        end: (res) => {
          this.$emit('annimateEnd', res)
        }
      })
    }
  },
  mounted () {
    this.initSwiper()
  },
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

  .swiper-item {
    position: relative;
    >div {
      float: left;

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
