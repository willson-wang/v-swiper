<template>
    <div class="slide-wrap" ref="box" :class="{ className }">
        <div class="slide-content" ref="slide" :style="{ height }" :currentIndex="currentIndex">
            <div
                class="slide-item"
                v-for="(item, index) in newList"
                :class="[index === 1 && 'active']"
                :key="index"
                @click="selectItem(item)"
            >
                <div
                    v-if="!isBroadcast"
                    class="slide-item__img"
                    :style="{ backgroundImage: 'url(' + item.img +')' }"
                ></div>
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
    </div>
</template>

<script>
/**
 *  2 0 1
 *  0 1 2
 *  1 2 0
 *  2 0 1
 *
 *  2 0 1
 *  1 2 0
 *  0 1 2
 *  2 1 0
 *
 *  -375 -750
 *  0 -375
 *  375 0
 *
 *  -375 0
 *  0 375
 *  375 750
 *
 *  -375 -750
 *  0 -375
 *  375 0
 *  750 375
 *
    -750
    0
    750
    1500
    2250
    3000

    0 1 2 3 4 5

    5 0 1 2 3 4  cur = 0
    1 2 3 4 5 0
    2 3 4 5 0 1

    0 1 2 3 4 5  cur = 1  idx = 4
    3 4 5 0 1 2

    3 4 5 0 1 2  cur = 4 idx = 2
    1 2 3 4 5 0  cur = 2 idx = 1
    0 1 2 3 4 5

    0 1 2 3
  0 1 2 3
0 1 2 3
 *  */
import Swiper from './swiper'
export default {
    name: 'Swiper',
    props: {
        value: {
            type: Number,
            default: 0
        },
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        height: {
            type: [String, Number]
        },
        duration: {
            type: Number,
            default: 300
        },
        auto: {
            type: Boolean,
            default: true
        },
        showDots: {
            type: Boolean,
            default: false
        },
        loop: {
            type: Boolean,
            default: false
        },
        direction: {
            type: String,
            default: 'horizontal'
        },
        isBroadcast: {
            type: Boolean,
            default: false
        },
        minMovingDistance: {
            type: Number,
            default: 30
        },
        interval: {
            type: [Number, String],
            default: 4000
        },
        className: {
            type: String
        }
    },
    data() {
        const index = this.value >= this.list.length ? 0 : this.value
        return {
            currentIndex: index || 0,
            newList: []
        }
    },
    computed: {
        newHeight() {
            return this.height
        }
    },
    methods: {
        init(index = 0) {
            const vm = this
            this.swiper && this.swiper.destory()
            this.swiper = new Swiper({
                wrap: this.$refs.box,
                currentIndex: index,
                slideDerection: this.slideDerection,
                list: this.newList,
                duration: this.duration,
                auto: this.auto,
                loop: this.loop,
                direction: this.direction,
                minMovingDistance: this.minMovingDistance,
                interval: this.interval
            }).on('swiperEnd', function end(index) {
                let idx = index
                if (vm.loop && vm.list.length === 2) {
                    idx = index % 2
                }
                vm.currentIndex = idx
                vm.$emit('swiperEnd', this.swiper)
            })
        },
        reRender() {
            if (!this.$el) return
            this.swiper && this.swiper.destory()
            this.newList = this.getNewList()
            this.$nextTick(() => {
                this.currentIndex = 0
                if (this.newList.length) {
                  this.init(this.currentIndex)
                }
            })
        },
        getNewList() {
            let tempArr = JSON.parse(JSON.stringify(this.list))
            if (this.loop) {
                if (tempArr.length === 2) {
                    tempArr = [...tempArr, ...tempArr]
                }
                // 需要显示的元素永远处于第二个位置
                tempArr = [
                    ...tempArr.slice(this.currentIndex - 1),
                    ...tempArr.slice(0, this.currentIndex - 1)
                ]
            }
            return tempArr
        },
        selectItem(item) {
            item.currentIndex = this.currentIndex
            this.$emit('selectItem', item)
        }
    },
    watch: {
        currentIndex(val) {
            this.$emit('input', val)
        },
        list(val, oldVal) {
            if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
                this.reRender()
            }
        },
        auto(val) {
            if (!val) {
                this.swiper && this.swiper._stop()
            } else {
                this.swiper && this.swiper._auto()
            }
        }
    },
    created() {
        this.newList = this.getNewList()
    },
    mounted() {
        if (this.newList.length) {
            this.init(this.currentIndex)
        }
    },
    beforeDestory() {
        this.swiper && this.swiper.destroy()
    },
    activated() {
        this.swiper && this.auto && this.swiper._auto()
    },
    deactivated() {
        this.swiper && this.auto && this.swiper._stop()
    }
}
</script>

<style lang="less" scoped>
.slide-wrap {
    overflow: hidden;
    position: relative;
}
.slide-content {
    overflow: hidden;
    position: relative;
}
.slide-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 30px;
    line-height: 180px;
    background-color: #fff;
    color: #fff;
    transition: all 0 ease 0s;
    transform: translate3d(0, 0, 0);
}
.slide-item img {
    display: block;
    width: 100%;
    height: 100%;
}

.slide-item__img {
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.swiper-dots {
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%, 0);
    font-size: 0;
    padding: 0 5px;
}

.swiper-dots span {
    display: inline-block;
    vertical-align: middle;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: transparent;
    margin-right: 5px;
    border: 1px solid #fff;
}

.swiper-dots span&:last-of-type {
    margin-right: 0;
}

.swiper-dots .active {
    background-color: rgb(0, 174, 133);
    border-color: rgb(0, 174, 133);
}
.swiper-txt {
    font-size: 14px;
    margin: 0;
    text-align: left;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: #fff;
    color: #f58607;
}
// hack 安卓下line-height布局中的bug
.swiper-txt&::before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 100%;
    margin-top: 3px;
}
</style>
