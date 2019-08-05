const DEFAULT_OPTIONS = {
    currentIndex: 0,
    width: 0,
    slideDerection: '',
    list: [],
    interval: 4000,
    auto: false,
    loop: false,
    direction: 'horizontal',
    showDots: false,
    dotsPosition: 'center',
    duration: 500,
    minMovingDistance: 30
}

let uid = 0

class Swiper {
    constructor(props) {
        const opt = Object.assign({}, DEFAULT_OPTIONS, props)
        const {
            currentIndex,
            width,
            slideDerection,
            list,
            wrap,
            duration,
            interval,
            auto,
            loop,
            direction,
            minMovingDistance
        } = opt
        this.currentIndex = currentIndex
        this.width = width
        this.slideDerection = slideDerection
        this._touchStartInfo = {}
        this._touchMoveInfo = {}
        this._touchEndInfo = {}
        this.isTouchMoving = false
        this.list = list
        this.wrap = wrap
        this.duration = duration
        this._eventHandler = {}
        this.interval = interval
        this.auto = auto
        this.loop = loop
        this.minMovingDistance = minMovingDistance
        this.direction = direction
        this.onlyOne = this.list.length === 1
        this.uid = uid += 1
        this.destoryed = false
        this.transitionEvent = this.checkTransitionEvent()
        if (!this.list.length) {
            return
        }
        this._init()
        this._auto()
        this._bindEvent()
    }

    _init() {
        this._updateWidth()
        this.getSwiperItem()
        this.setOffset()
        this.setInitTransform()
    }

    _auto() {
        this._stop()
        if (this.auto && !this.destoryed && this.list.length > 1) {
            this.timer = setTimeout(() => {
                this.next()
            }, this.interval)
        }
    }

    _stop() {
        this.timer && clearTimeout(this.timer)
    }

    _bindEvent() {
        const swiperItem = this.getSwiperItem()
        const swiper = this.getSwiper()
        this.bindTransitionEndHandler = this.transitionEndHandler.bind(this)
        swiperItem[0] &&
            swiperItem[0].addEventListener(
                this.transitionEvent,
                this.bindTransitionEndHandler,
                false
            )
        swiper.addEventListener('touchstart', this.handleTouchStart.bind(this), false)
        swiper.addEventListener('touchmove', this.handleTouchMove.bind(this), false)
        swiper.addEventListener('touchend', this.handleTouchEnd.bind(this), false)
        window.addEventListener('orientationchange', this.handleTouchResize.bind(this), false)
    }

    _unbindEvent() {
        const swiper = this.getSwiper()
        this.forItems((item) => {
            item.removeEventListener(this.transitionEvent, this.bindTransitionEndHandler, false)
        })
        swiper.removeEventListener('touchstart', this.handleTouchStart, false)
        swiper.removeEventListener('touchmove', this.handleTouchMove, false)
        swiper.removeEventListener('touchend', this.handleTouchEnd, false)
        window.removeEventListener('orientationchange', this.handleTouchResize.bind(this), false)
    }

    on(event, callback) {
        if (this._eventHandler[event]) {
            console.error('event不能重复注册')
        }
        if (typeof callback !== 'function') {
            console.error('callback需要是function')
        }
        this._eventHandler[event] = callback
        return this
    }

    _updateWidth() {
        const swiper = this.getSwiper()
        this.width =
            this.direction === 'horizontal'
                ? swiper.offsetWidth || document.documentElement.offsetWidth
                : swiper.offsetHeight
    }

    next() {
        this.slideDerection = 'nexted'
        this.currentIndex += 1
        this.go(this.currentIndex)
    }

    prev() {
        this.slideDerection = 'preved'
        this.currentIndex -= 1
        this.go(this.currentIndex)
    }

    go(idx) {
        this._stop()
        if (idx > this.list.length - 1) {
            this.currentIndex = 0
        }
        if (idx < 0) {
            this.currentIndex = this.list.length - 1
        }
        // 设置切换transform,同时设置this.duration，开启过度动画
        this.forItems((item, key) => {
            this.setTransition(item, this.duration)
            let distance =
                this.slideDerection === 'nexted'
                    ? this._offset[key] - this.width
                    : this._offset[key] + this.width
            if (!this.loop && this.auto && this.currentIndex === 0) {
                distance = key * this.width
            }
            this.setTransform(item, distance)
        })
        this._auto()
    }

    setDom(opration, node, parentNode, brotherNode) {
        // parentNode.insertBefore(newNode, referenceNode)
        // node.removeChild(child)
        // node.appendChild(child)
        switch (opration) {
        case 'remove':
            parentNode.removeChild(node)
            break
        case 'append':
            parentNode.appendChild(node)
            break
        case 'insertBefore':
            parentNode.insertBefore(node, brotherNode)
            break
        default:
            console.log('无匹配操作')
        }
        return node
    }

    transitionEndHandler(e) {
        // 如果开启无缝轮播，transition动画结束之后，调整元素位置
        if (this.loop) {
            let swiperItem = this.getSwiperItem()
            const { parentNode } = swiperItem[0]
            const temp =
                this.slideDerection === 'nexted'
                    ? this.setDom('remove', swiperItem[0], parentNode)
                    : this.setDom('remove', swiperItem[swiperItem.length - 1], parentNode)
            swiperItem = this.getSwiperItem()
            this.slideDerection === 'nexted'
                ? this.setDom('append', temp, parentNode)
                : this.setDom('insertBefore', temp, parentNode, swiperItem[0])
        }
        // 调整轮播元素transform，this.transtion = 0不设置动画
        this.forItems((item, key) => {
            this.setTransition(item)
            let distance = this._offset[key]
            if (!this.loop) {
                distance =
                    this.slideDerection === 'nexted' ? distance - this.width : distance + this.width
                if (this.auto && this.currentIndex === 0) {
                    distance = key * this.width
                }
            }
            this.setTransform(item, distance)
        })
        this.setOffset()
        // transition结束监听
        this._eventHandler.swiperEnd && this._eventHandler.swiperEnd.call(this, this.currentIndex)
        e.preventDefault()
    }

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
    }

    handleTouchStart(e) {
        const touches = e.targetTouches[0]
        this._touchStartInfo = {
            pageX: touches.pageX,
            pageY: touches.pageY
        }
    }

    handleTouchMove(e) {
        this.isTouchMoving = true
        const touches = e.targetTouches[0]
        this._touchMoveInfo = {
            pageX: touches.pageX,
            pageY: touches.pageY
        }
        const moveDistanceX = this._touchMoveInfo.pageX - this._touchStartInfo.pageX
        const moveDistanceY = this._touchMoveInfo.pageY - this._touchStartInfo.pageY
        const moveDistance = this.direction === 'horizontal' ? moveDistanceX : moveDistanceY
        // 设置移动距离
        this.forItems((item, index) => {
            this.setTransition(item)
            const distance = parseInt(item.dataset.offset, 10) + moveDistance
            this.setTransform(item, distance)
        })
    }

    handleTouchEnd(e) {
        this.isTouchMoving = false
        const touches = e.changedTouches[0]
        this._touchEndInfo = {
            pageX: touches.pageX,
            pageY: touches.pageY
        }
        const distanceX = this._touchEndInfo.pageX - this._touchStartInfo.pageX
        const distanceY = this._touchEndInfo.pageY - this._touchStartInfo.pageY
        const moveDistance = this.direction === 'horizontal' ? distanceX : distanceY
        // 是否需要切换到上一个or下一个
        if (
            moveDistance > this.minMovingDistance &&
            (this.loop || (!this.loop && this.currentIndex !== 0))
        ) {
            this.prev()
        } else if (
            moveDistance < -this.minMovingDistance &&
            (this.loop || (!this.loop && this.currentIndex !== this.list.length - 1))
        ) {
            this.next()
        } else {
            this.forItems(item => {
                this.setTransition(item)
                const distance = parseInt(item.dataset.offset, 10)
                this.setTransform(item, distance)
            })
        }
    }

    handleTouchResize() {
        setTimeout(() => {
            this._updateWidth()
            this.setOffset()
            this.setInitTransform()
        }, 100)
    }

    setTransition(item, duration = 0) {
        if (this.onlyOne) return
        const transition = `all ${duration}ms ease 0s`
        item.style.webkitTransition = transition
        item.style.transition = transition
    }

    setTransform(item, distance) {
        if (this.onlyOne) return
        const transform =
            this.direction === 'horizontal'
                ? `translate3d(${distance}px, 0, 0)`
                : `translate3d(0, ${distance}px, 0)`
        item.style.transform = transform
    }

    setOffset() {
        // 0 750 1500 2250
        // -750 0 750 1500
        // -1500 -750 0 750
        // -2250 -1500 -750 0
        // 设置元素的data-offset属性
        const temp = this.list.map((item, index) => {
            return this.loop ? -this.width * (1 - index) : this.width * (index - this.currentIndex)
        })
        this._offset = temp || []
        const swiperItem = this.getSwiperItem()
        this._offset.forEach((offset, index) => {
            swiperItem[index].setAttribute('data-offset', offset)
        })
    }

    getSwiperItem() {
        const children = this.wrap.querySelectorAll(`.slide-item`) || []
        return Array.from(children)
    }

    getSwiper() {
        return this.wrap || {}
    }

    forItems(fn) {
        const itemEles = this.getSwiperItem()
        itemEles.forEach(fn)
    }

    setInitTransform() {
        const itemEles = this.getSwiperItem()
        itemEles.forEach((item, key) => {
            if (this.onlyOne) return
            const distance = this._offset[key]
            this.setTransform(item, distance)
        })
    }

    destory() {
        this.destoryed = true
        this.list.length = 0
        this._stop()
        this._unbindEvent()
        this.currentIndex = 0
    }
}

export default Swiper
