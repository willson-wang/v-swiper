<template>
    <div class="swiper-wrap" ref="swiper" :class="className">
        <div class="swiper-content" ref="swiperContent" :style="{ height }">
            <div
                v-for="(item, index) in newList"
                class="swiper-item"
                :class="[index === 1 && 'active']"
                :key="index"
                :data-offset="offset[index]"
                @click="selectItem(item)"
            >
                <img v-if="!isBroadcast" :src="item.img" :alt="'banner' + index" />
                <div class="swiper-txt" v-else :style="{ height, lineHeight: height }">
                    {{ item.txt }}
                </div>
            </div>
        </div>
        <div class="swiper-dots" v-if="showDots">
            <span
                v-for="(item, index) in list"
                :key="index"
                :class="[index === currentIndex ? 'active' : '']"
            ></span>
        </div>
        <div class="swiper-prev" v-if="isPrevShow" @click="changeItem('prev')">{{ lt }}</div>
        <div class="swiper-next" v-if="isNextShow" @click="changeItem('next')">{{ gt }}</div>
    </div>
</template>

<script>
// import Swiper from './swiper'
export default {
    name: 'slide',
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
        newHeight() {
            return this.height
        },
        newList() {
            const tempArr = JSON.parse(JSON.stringify(this.list))
            if (this.list.length !== 2) {
                const temp = tempArr.pop()
                tempArr.unshift(temp)
            }
            console.log(tempArr, this.list)
            this.setOffset(tempArr)
            return tempArr
        },
        onlyOne() {
            return this.list.length === 1
        },
        onlyTwo() {
            return this.list.length === 2
        }
    },
    data() {
        const width = document.documentElement.offsetWidth
        return {
            currentIndex: 0,
            width,
            slideDerection: null,
            touchStartInfo: {},
            touchMoveInfo: {},
            touchEndInfo: {},
            isTouchMoving: false,
            isGoing: false,
            offset: []
        }
    },
    watch: {
        currentIndex(val) {
            this.$emit('input', val)
        }
    },
    methods: {
        next() {
            this.slideDerection = 'nexted'
            this.currentIndex += 1
            this.go(this.currentIndex)
        },
        prev() {
            this.slideDerection = 'preved'
            this.currentIndex -= 1
            this.go(this.currentIndex)
        },
        go(idx) {
            this.isGoing = true
            if (this.loop) {
                if (idx > this.list.length - 1) {
                    if (this.list.length === 2) {
                        this.currentIndex = this.list.length - 1
                        this.isGoing = false
                        return
                    }
                    this.currentIndex = 0
                }
                if (idx < 0) {
                    if (this.list.length === 2) {
                        this.currentIndex = 0
                        this.isGoing = false
                        return
                    }
                    this.currentIndex = this.list.length - 1
                }
            } else {
                // 无缝轮播索引大于当前最大值及小于0时，禁止切换到下一张
                if (idx > this.list.length - 1) {
                    this.currentIndex = this.list.length - 1
                    this.isGoing = false
                    return
                }
                if (idx < 0) {
                    this.currentIndex = 0
                    this.isGoing = false
                    return
                }
            }
            this.forItems((item, key) => {
                console.log('this.duration', this.duration)
                this.setTransition(item, this.duration)
                let distance =
                    this.slideDerection === 'nexted'
                        ? this.offset[key] - this.width
                        : this.offset[key] + this.width
                console.log()
                this.setTransform(item, distance)
            })
        },
        transitionEndHandler(e) {
            if (this.list.length !== 2) {
                this.forItems((item, key) => {
                    this.setTransition(item)
                    let distance = this.offset[key]
                    this.setTransform(item, distance)
                })
                const temp = this.slideDerection === 'nexted' ? this.list.shift() : this.list.pop()
                this.slideDerection === 'nexted' ? this.list.push(temp) : this.list.unshift(temp)
            } else {
                this.setOffset(this.list)
            }
            this.isGoing = false
            console.log('transitionEndHandler')
        },
        checkTransitionEvent() {
            const el = document.createElement('div')
            const transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd'
            }

            for (let t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t]
                }
            }
        },
        setCountStep(index) {
            const currentIndex = this.currentIndex
            console.log('setCountPage', index, this.currentIndex, index - currentIndex)
            if (index > currentIndex) {
                const temp = this.list.splice(0, index - currentIndex)
                this.list.push(...temp)
            } else if (index < currentIndex) {
                const temp = this.list.splice(index - currentIndex)
                this.list.unshift(...temp)
            }
            this.currentIndex = index
        },
        handleTouchStart(e) {
            console.log('handleTouchStart')
            const touches = e.targetTouches[0]
            this.touchStartInfo = {
                pageX: touches.pageX,
                pageY: touches.pageY
            }
        },
        handleTouchMove(e) {
            if (this.isGoing) return
            this.isTouchMoving = true
            const touches = e.targetTouches[0]
            this.touchMoveInfo = {
                pageX: touches.pageX,
                pageY: touches.pageY
            }
            const moveDistanceX = this.touchMoveInfo.pageX - this.touchStartInfo.pageX
            if (
                (this.currentIndex === 0 && this.list.length === 2 && moveDistanceX >= 0) ||
                (this.currentIndex === this.newList.length - 1 &&
                    this.list.length === 2 &&
                    moveDistanceX <= 0)
            ) {
                return
            }
            // 非无缝轮播时，第一张且滑动距离大于0时，及最后一张距离小于0时return，禁止移动位置
            if (
                (this.currentIndex === 0 && !this.loop && moveDistanceX >= 0) ||
                (this.currentIndex === this.newList.length - 1 && !this.loop && moveDistanceX <= 0)
            ) {
                return
            }
            this.forItems(item => {
                this.setTransition(item)
                let distance = parseInt(item.dataset.offset, 10) + moveDistanceX
                this.setTransform(item, distance)
            })
        },
        handleTouchEnd(e) {
            if (this.isGoing) return
            console.log('handleTouchEnd')
            this.isTouchMoving = false
            const touches = e.changedTouches[0]
            this.touchEndInfo = {
                pageX: touches.pageX,
                pageY: touches.pageY
            }
            const direction = this.touchEndInfo.pageX - this.touchStartInfo.pageX
            if (direction > 50) {
                this.prev()
            } else if (direction < -50) {
                this.next()
            } else {
                this.forItems(item => {
                    this.setTransition(item)
                    let distance = parseInt(item.dataset.offset, 10)
                    this.setTransform(item, distance)
                })
            }
        },
        getChildrenEle() {
            const children = (this.$refs.swiperContent && this.$refs.swiperContent.children) || []
            return Array.from(children)
        },
        setTransition(item, duration = 0) {
            if (this.onlyOne) return
            const transition = `all ${duration}ms ease 0s`
            item.style.webkitTransition = transition
            item.style.transition = transition
        },
        setTransform(item, distance) {
            if (this.onlyOne) return
            let transform = `translate3d(${distance}px, 0, 0)`
            item.style.transform = transform
        },
        forItems(fn) {
            const itemEles = this.getChildrenEle()
            itemEles.forEach(fn)
        },
        handleResize() {
            clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(() => {
                console.log('handleResize')
                this.updateWidth()
                this.forItems((item, key) => {
                    this.setTransition(item)
                    let distance = this.offset[key]
                    this.setTransform(item, distance)
                })
            }, 100)
        },
        updateWidth() {
            this.width = this.$refs.swiper.offsetWidth || document.documentElement.offsetWidth
        },
        setOffset(list) {
            if (list.length === 2) {
                this.offset = this.list.map((item, index) => {
                    return this.slideDerection === 'nexted'
                        ? this.width * (index - 1)
                        : this.width * index
                })
                return
            }
            this.offset = list.map((item, index) => {
                return -this.width * (1 - index)
            })
        }
    },
    mounted() {
        const itemEles = this.getChildrenEle()
        const transitionEvent = this.checkTransitionEvent()
        itemEles[0] &&
            itemEles[0].addEventListener(transitionEvent, this.transitionEndHandler, false)
        this.$refs.swiper.addEventListener('touchstart', this.handleTouchStart, false)
        this.$refs.swiper.addEventListener('touchmove', this.handleTouchMove, false)
        this.$refs.swiper.addEventListener('touchend', this.handleTouchEnd, false)
        window.addEventListener('resize', this.handleResize, false)
        this.width = this.$refs.swiper.offsetWidth || document.documentElement.offsetWidth
        console.log('mounted')
        itemEles.forEach((item, key) => {
            if (this.onlyOne) return
            console.log(this.offset)
            let distance = this.offset[key]
            this.setTransform(item, distance)
        })
    },
    deactivated() {
        this.currentIndex = 0
    },
    beforeDestroy() {
        const itemEles = this.$refs.swiperContent.children
        const transitionEvent = this.checkTransitionEvent()
        itemEles[0] &&
            itemEles[0].removeEventListener(transitionEvent, this.transitionEndHandler, false)
    }
}
</script>

<style lang="less" scoped>
.swiper-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;

    .swiper-content {
        overflow: hidden;
        position: relative;
        .swiper-item {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            font-size: 30px;
            background-color: gray;
            color: #fff;
            transition: all 0 ease 0s;
            transform: translate3d(0, 0, 0);

            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }

        .swiper-txt {
            font-size: 14px;
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
            border-color: rgb(0, 174, 133);
        }
    }

    .swiper-prev,
    .swiper-next {
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
}
</style>
