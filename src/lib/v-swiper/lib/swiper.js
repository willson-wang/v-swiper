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
  constructor (wrap, options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options)
    const { loop, isTransition, on, end } = this.options
    this.wrap = wrap
    this.swiperItem = this.wrap.children[0]
    this.data = this.options.data
    this.currentIndex = loop ? 1 : 0
    this.transformx = loop && isTransition ? `-${window && window.innerWidth}px` : 0
    this.listWidths = []
    this.fixIndex = 0
    this.newDuration = isTransition ? this.duration : 0
    this.left = loop && !isTransition ? `-${window && window.innerWidth}` : 0
    this.width = window && window.innerWidth
    this.on = on
    this.animateEnd = end
    this._isMoved = false
    this.start = {}
    this.move = {}
    this.end = {}
    this.timer = null
    this.timer1 = null
    this.timer2 = null

    this.init()
  }

  go (index, turn) {
    let { isTransition, duration, loop, auto } = this.options
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
    if (!loop && index === 0) other = this.listWidths.length - 1
    isTransition ? this.setTransform(index, other) : this.setRequestAnimationFrame(index, other)
  }

  setRequestAnimationFrame (index, other) {
    const { duration, animateInterval } = this.options
    var speed = (this.listWidths[index] - this.listWidths[other]) / (duration / animateInterval)
    var target = -this.listWidths[index]
    this.fixCurrentIndex(index, index > other)
    this.setAnimationLeft(target, speed, () => {
      this.resetLeft(index, index > other)
    })
  }

  setAnimationLeft (target, speed, callback) {
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
      this.on && this.on({left: this.left, newDuration: this.newDuration, fixIndex: this.fixIndex, currentIndex: this.currentIndex})
    }
    this.timer = this.requestAnimationFrame(animate, animateInterval)
  }

  resetLeft (index, turn) {
    const { loop } = this.options
    if (!loop) return
    if (turn && index >= this.listWidths.length - 1) {
      this.currentIndex = index = 1
    } else if (!turn && index <= 0) {
      this.currentIndex = index = this.listWidths.length - 2
    }
    this.fixCurrentIndex(index, turn)
    this.left = `${-this.listWidths[index]}`
    this.on && this.on({left: this.left, newDuration: this.newDuration, fixIndex: this.fixIndex, currentIndex: this.currentIndex})
    this.animateEnd && this.animateEnd(this)
  }

  setTransform (index, other) {
    const target = -this.listWidths[index]
    this.fixCurrentIndex(index, index > other)
    this.setAnimationTransform(target)
    this.resetTranslate(index, index > other)
    this._isMoved = true
  }

  setAnimationTransform (target) {
    this.transformx = `${target}px`
    this.on && this.on({transformx: this.transformx, newDuration: this.newDuration, fixIndex: this.fixIndex, currentIndex: this.currentIndex})
  }

  resetTranslate (index, turn) {
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
        this.on && this.on({transformx: this.transformx,
          newDuration: this.newDuration,
          fixIndex: this.fixIndex,
          currentIndex: this.currentIndex})
        this.animateEnd && this.animateEnd(this)
      }, duration)
    }
  }

  requestAnimationFrame (callback, time) {
    return typeof window.requestAnimationFrame !== 'undefined' ? window.requestAnimationFrame(callback) : window.setTimeout(callback, time)
  }

  cancelAnimationFrame (timer) {
    return typeof window.cancelAnimationFrame !== 'undefined' ? window.cancelAnimationFrame(timer) : window.clearTimeout(timer)
  }

  touchstartHandler (e) {
    this.stop()
    this.start.x = e.changedTouches[0].pageX
    this.start.y = e.changedTouches[0].pageY
    this._isMoved = false
  }

  touchmoveHandler (e) {
    const { minMovingDistance, isTransition, direction } = this.options
    if (this.data.length === 1) return
    this.move.x = e.changedTouches[0].pageX
    this.move.y = e.changedTouches[0].pageY

    let distanceX = this.move.x - this.start.x
    let distanceY = this.move.y - this.start.y

    let distance = distanceY

    let isScrollY = Math.abs(distanceY) > Math.abs(distanceX)

    if (direction === 'horizontal' && !isScrollY) {
      distance = distanceX
    }

    if ((((minMovingDistance && Math.abs(distance) >= minMovingDistance) || !minMovingDistance) && !isScrollY) || this._isMoved) {
      isTransition && this.setAnimationTransform(distance - this.listWidths[this.currentIndex])
      !isTransition && this.setAnimationLeft(distance - this.listWidths[this.currentIndex], 10)
    }
    !isScrollY && e.preventDefault()
  }

  touchendHandler (e) {
    const { direction, threshold, isTransition, auto, interval } = this.options
    if (this.data.length === 1) return
    this.end.x = e.changedTouches[0].pageX
    this.end.y = e.changedTouches[0].pageY
    let distance = this.end.y - this.start.y
    if (direction === 'horizontal') {
      distance = this.end.x - this.start.x
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

  resizeHandler () {
    this.width = window && window.innerWidth
    this.setImgWidth()
    this.getListWidths()
  }

  setImgWidth () {
    const imgs = this.wrap.getElementsByTagName('img')
    Array.from(imgs).forEach((item) => {
      item.style.width = `${this.width}px`
    })
  }

  autoPlay () {
    const { interval } = this.options
    this.timer1 = setTimeout(() => {
      this.go(++this.currentIndex, 'next')
      this.autoPlay()
    }, interval)
  }

  stop () {
    this.timer1 && clearTimeout(this.timer1)
  }

  getDistance (distance) {
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

  getListWidths () {
    const tempArr = []
    for (let i = 0; i < this.data.length; i++) {
      tempArr.push(this.width * i)
    }
    this.listWidths = tempArr
  }

  fixCurrentIndex (val, turn) {
    const { loop } = this.options
    if (!loop) {
      this.fixIndex = this.currentIndex
      return
    }
    if (turn) {
      this.fixIndex = this.currentIndex >= this.listWidths.length - 1 ? 0 : this.currentIndex - 1
    } else {
      this.fixIndex = this.currentIndex <= 0 ? this.listWidths.length - 3 : this.currentIndex - 1
    }
  }

  bindEvent () {
    this.wrap.addEventListener('touchstart', this.touchstartHandler.bind(this), false)
    this.wrap.addEventListener('touchmove', this.touchmoveHandler.bind(this), false)
    this.wrap.addEventListener('touchend', this.touchendHandler.bind(this), false)
    window.addEventListener('resize', this.resizeHandler.bind(this), false)
  }

  unbindEvent () {
    this.wrap.removeEventListener('touchstart', this.touchstartHandler.bind(this), false)
    this.wrap.removeEventListener('touchmove', this.touchmoveHandler.bind(this), false)
    this.wrap.removeEventListener('touchend', this.touchendHandler.bind(this), false)
  }

  destroy () {
    this.cancelAnimationFrame(this.timer)
    clearTimeout(this.timer1)
    clearTimeout(this.timer2)
    this.unbindEvent()
  }

  init () {
    if (!this.data.length) return
    this.getListWidths()
    this.bindEvent()
    this.options.auto && this.autoPlay()
  }
}

export default Swiper
