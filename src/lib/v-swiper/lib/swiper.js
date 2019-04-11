const DEFAULT_OPTIONS = {
    direction: 'horizontal',
    showDots: false,
    dotsPosition: 'center',
    height: '180px',
    auto: false,
    loop: false,
    duration: 500,
    interval: 4000,
    animateInterval: 20,
    isTransition: true,
    minMovingDistance: 30,
    threshold: 50,
    isPrevShow: false,
    isNextShow: false,
    data: []
}

class Swiper {
    constructor(wrap, options) {
        this.options = Object.assign({}, DEFAULT_OPTIONS, options)
        const { loop, isTransition, on, end, direction, height, width, resize } = this.options
        const initTransform =
            direction === 'horizontal' ? window && window.innerWidth : parseInt(height)
        this.wrap = wrap
        this.swiperItem = this.wrap.children[0]
        this.data = this.options.data
        this.currentIndex = loop ? 1 : 0
        this.transformx = loop && isTransition ? `-${initTransform}px` : 0
        this.listWidths = []
        this.fixIndex = 0
        this.newDuration = isTransition ? this.duration : 0
        this.left = loop && !isTransition ? `-${initTransform}` : 0
        this.width = (width && parseInt(width)) || window.innerWidth
        this.on = on
        this.animateEnd = end
        this.resize = resize
        this._isMoved = false
        this._start = {}
        this._move = {}
        this._end = {}
        this.timer = null
        this.timer1 = null
        this.timer2 = null
        this.htmlFontSize =
            window.getComputedStyle(document.documentElement).fontSize ||
            (document.documentElement.currentStyle &&
                document.documentElement.currentStyle['font-size']) ||
            '75px'

        this.init()
    }

    move(key) {
        key === 'next' ? this.go(++this.currentIndex, 'next') : this.go(--this.currentIndex, 'prev')
    }

    go(index, turn) {
        let { isTransition, duration, loop, auto, direction } = this.options
        this.newDuration = isTransition ? duration : 0
        if (!loop) {
            if (index >= this.listWidths.length) {
                if (!auto) {
                    this.currentIndex = index = this.listWidths.length - 1
                    return
                } else {
                    this.currentIndex = index = 0
                }
            } else if (this.currentIndex < 0) {
                if (!auto) {
                    this.currentIndex = index = 0
                    return
                } else {
                    this.currentIndex = index = this.listWidths.length - 1
                }
            }
        }
        let other = turn === 'next' ? index - 1 : index + 1
        if (!loop && index === 0 && direction === 'horizontal') other = this.listWidths.length - 1
        isTransition ? this.setTransform(index, other) : this.setRequestAnimationFrame(index, other)
    }

    setRequestAnimationFrame(index, other) {
        const { duration, animateInterval } = this.options
        var speed = (this.listWidths[index] - this.listWidths[other]) / (duration / animateInterval)
        var target = -this.listWidths[index]
        this.fixCurrentIndex(index, index > other)
        this.setAnimationLeft(target, speed, () => {
            this.resetLeft(index, index > other)
        })
    }

    setAnimationLeft(target, speed, callback) {
        const { animateInterval } = this.options
        this.cancelAnimationFrame(this.timer)
        var animate = () => {
            this.left -= speed
            if ((speed > 0 && this.left >= target) || (speed < 0 && this.left <= target)) {
                this.timer = this.requestAnimationFrame(animate, animateInterval)
            } else {
                this.left = target
                this._isMoved = true
                this.cancelAnimationFrame(this.timer)
                callback && callback()
            }
            this.on &&
                this.on({
                    left: this.left,
                    newDuration: this.newDuration,
                    fixIndex: this.fixIndex,
                    currentIndex: this.currentIndex
                })
        }
        this.timer = this.requestAnimationFrame(animate, animateInterval)
    }

    resetLeft(index, turn) {
        const { loop } = this.options
        if (!loop) return
        if (turn && index >= this.listWidths.length - 1) {
            this.currentIndex = index = 1
        } else if (!turn && index <= 0) {
            this.currentIndex = index = this.listWidths.length - 2
        }
        this.fixCurrentIndex(index, turn)
        this.left = `${-this.listWidths[index]}`
        this.on &&
            this.on({
                left: this.left,
                newDuration: this.newDuration,
                fixIndex: this.fixIndex,
                currentIndex: this.currentIndex
            })
        this.animateEnd && this.animateEnd(this)
    }

    setTransform(index, other) {
        const target = -this.listWidths[index]
        this.fixCurrentIndex(index, index > other)
        this.setAnimationTransform(target)
        this.resetTranslate(index, index > other)
        this._isMoved = true
    }

    setAnimationTransform(target) {
        this.transformx = `${target}px`
        this.on &&
            this.on({
                transformx: this.transformx,
                newDuration: this.newDuration,
                fixIndex: this.fixIndex,
                currentIndex: this.currentIndex
            })
    }

    resetTranslate(index, turn) {
        let { loop, duration } = this.options
        if (!loop) return
        if ((turn && index >= this.listWidths.length - 1) || (!turn && this.currentIndex <= 0)) {
            setTimeout(() => {
                if (turn && index >= this.listWidths.length - 1) {
                    this.currentIndex = index = 1
                } else if (!turn && this.currentIndex <= 0) {
                    this.currentIndex = index = this.listWidths.length - 2
                }
                this.transformx = `${-this.listWidths[index]}px`
                this.newDuration = 0
                this.fixCurrentIndex(index, turn)
                this.on &&
                    this.on({
                        transformx: this.transformx,
                        newDuration: this.newDuration,
                        fixIndex: this.fixIndex,
                        currentIndex: this.currentIndex
                    })
                this.animateEnd && this.animateEnd(this)
            }, duration)
        }
    }

    requestAnimationFrame(callback, time) {
        return typeof window.requestAnimationFrame !== 'undefined'
            ? window.requestAnimationFrame(callback)
            : window.setTimeout(callback, time)
    }

    cancelAnimationFrame(timer) {
        return typeof window.cancelAnimationFrame !== 'undefined'
            ? window.cancelAnimationFrame(timer)
            : window.clearTimeout(timer)
    }

    touchstartHandler(e) {
        const { forbidTouchStart } = this.options
        if (forbidTouchStart) return
        this.stop()
        this._start.x = e.changedTouches[0].pageX
        this._start.y = e.changedTouches[0].pageY
        this._isMoved = false
    }

    touchmoveHandler(e) {
        const { minMovingDistance, isTransition, direction, forbidTouchStart } = this.options
        if (this.data.length === 1 || forbidTouchStart) return
        this._move.x = e.changedTouches[0].pageX
        this._move.y = e.changedTouches[0].pageY

        let distanceX = this._move.x - this._start.x
        let distanceY = this._move.y - this._start.y

        let distance = distanceY

        let isScrollY = Math.abs(distanceY) > Math.abs(distanceX)

        if (direction === 'horizontal' && !isScrollY) {
            distance = distanceX
        }

        if (
            (minMovingDistance && Math.abs(distance) >= minMovingDistance) ||
            !minMovingDistance ||
            this._isMoved
        ) {
            isTransition &&
                this.setAnimationTransform(distance - this.listWidths[this.currentIndex])
            !isTransition &&
                this.setAnimationLeft(distance - this.listWidths[this.currentIndex], 10)
        }
        e.preventDefault()
    }

    touchendHandler(e) {
        const { direction, threshold, isTransition, auto, interval } = this.options
        if (this.data.length === 1) return
        this._end.x = e.changedTouches[0].pageX
        this._end.y = e.changedTouches[0].pageY
        let distance = this._end.y - this._start.y
        if (direction === 'horizontal') {
            distance = this._end.x - this._start.x
        }

        distance = this.getDistance(distance)
        if (distance > threshold) {
            this.go(--this.currentIndex, 'prev')
        } else if (distance < -threshold) {
            this.go(++this.currentIndex, 'next')
        } else {
            !isTransition && this.setAnimationLeft(-this.listWidths[this.currentIndex], -10)
            isTransition && this.setAnimationTransform(-this.listWidths[this.currentIndex])
        }
        clearTimeout(this.timer2)
        this.timer2 = setTimeout(() => {
            auto && this.autoPlay()
        }, interval)
    }

    resizeHandler() {
        this.resize && this.resize()
        this.destroy()
        this.width = window && window.innerWidth
        this.init()
    }

    focusHandler() {
        this.options.auto && this.autoPlay()
    }

    blurHandler() {
        this.stop()
    }

    setImgWidth() {
        const imgs = this.wrap.getElementsByTagName('img')
        Array.from(imgs).forEach(item => {
            item.style.width = `${this.width}px`
        })
    }

    autoPlay() {
        const { interval } = this.options
        this.stop()
        var _move = () => {
            this.timer1 = setTimeout(() => {
                this.go(++this.currentIndex, 'next')
                _move()
            }, interval)
        }
        _move()
    }

    stop() {
        this.timer && clearTimeout(this.timer)
        this.timer1 && clearTimeout(this.timer1)
        this.timer2 && clearTimeout(this.timer2)
    }

    getDistance(distance) {
        const { loop } = this.options
        if (loop) {
            return distance
        } else {
            if (distance > 0 && this.currentIndex === 0) {
                return 0
            } else if (distance < 0 && this.currentIndex === this.data.length - 1) {
                return 0
            } else {
                return distance
            }
        }
    }

    getListWidthsOrHeight() {
        let { direction, height } = this.options
        const tempArr = []
        const reg = /rem/gi
        height = reg.test(height) ? parseFloat(height) * parseInt(this.htmlFontSize) : height
        for (let i = 0; i < this.data.length; i++) {
            let temp = direction === 'horizontal' ? this.width : parseFloat(height)
            tempArr.push(temp * i)
        }
        this.listWidths = tempArr
    }

    fixCurrentIndex(val, turn) {
        const { loop } = this.options
        if (!loop) {
            this.fixIndex = this.currentIndex
            return
        }
        if (turn) {
            this.fixIndex =
                this.currentIndex >= this.listWidths.length - 1 ? 0 : this.currentIndex - 1
        } else {
            this.fixIndex =
                this.currentIndex <= 0 ? this.listWidths.length - 3 : this.currentIndex - 1
        }
    }

    bindEvent() {
        this.wrap.addEventListener('touchstart', this.touchstartHandler.bind(this), false)
        this.wrap.addEventListener('touchmove', this.touchmoveHandler.bind(this), false)
        this.wrap.addEventListener('touchend', this.touchendHandler.bind(this), false)
        window.addEventListener('resize', this.resizeHandler.bind(this), false)
        window.addEventListener('focus', this.focusHandler.bind(this), false)
        window.addEventListener('blur', this.blurHandler.bind(this), false)
    }

    unbindEvent() {
        this.wrap.removeEventListener('touchstart', this.touchstartHandler.bind(this), false)
        this.wrap.removeEventListener('touchmove', this.touchmoveHandler.bind(this), false)
        this.wrap.removeEventListener('touchend', this.touchendHandler.bind(this), false)
        window.removeEventListener('resize', this.resizeHandler.bind(this), false)
        window.removeEventListener('focus', this.focusHandler.bind(this), false)
        window.removeEventListener('blur', this.blurHandler.bind(this), false)
    }

    destroy() {
        this.cancelAnimationFrame(this.timer)
        clearTimeout(this.timer1)
        clearTimeout(this.timer2)
        this.unbindEvent()
    }

    init() {
        if (!this.data.length) return
        this.getListWidthsOrHeight()
        this.unbindEvent()
        this.bindEvent()
        this.stop()
        this.options.auto && this.autoPlay()
    }
}

export default Swiper
