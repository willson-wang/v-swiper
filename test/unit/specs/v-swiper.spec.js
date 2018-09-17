import Swiper from '@/lib/v-swiper'
import { mount } from '@vue/test-utils'

describe('Swiper.vue', () => {
  // 测试渲染swiper-item数量
  it('renders swiper-item for each item in props.list', () => {
    const list = [{
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
    }, {
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
    }, {
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
    }]
    const wrapper = mount(Swiper, {
      propsData: {list}
    })
    expect(wrapper.findAll('.swiper-item').length).toEqual(list.length)
  })

  // 验证传入的props
  it('renders props when passed', () => {
    const prop = {
      isTransition: true,
      loop: false,
      list: [{
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
      }, {
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
      }, {
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
      }],
      isPrevShow: false,
      showDots: true
    }
    const wrapper = mount(Swiper, {
      propsData: {...prop}
    })
    expect(wrapper.find('.swiper-content').classes()).toContain('swiper-transition')
    expect(wrapper.is('.swiper-prev')).toBe(false)
    expect(wrapper.contains('.swiper-dots')).toBe(true)
  })

  // 验证swiper-item点击事件
  it('trigger swiper-item click', () => {
    const list = [{
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
    }, {
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
    }, {
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
    }]
    const mockFn = jest.fn()
    const wrapper = mount(Swiper, {
      propsData: {list},
      methods: {
        selectItem: mockFn
      }
    })
    wrapper.findAll('.swiper-item').trigger('click')
    expect(mockFn).toBeCalled()
    expect(mockFn).toHaveBeenCalledTimes(3)
  })

  // 验证next点击事件且loop为false结果
  it('trigger swiper-prev and swiper-next click', () => {
    const list = [{
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
    }, {
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
    }, {
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
    }]
    const wrapper = mount(Swiper, {
      propsData: {
        list,
        isPrevShow: true,
        isNextShow: true
      }
    })
    expect(wrapper.contains('.swiper-prev')).toBe(true)
    expect(wrapper.contains('.swiper-next')).toBe(true)
    wrapper.find('.swiper-prev').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(0)
    wrapper.find('.swiper-next').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(1)
    wrapper.find('.swiper-next').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(2)
    wrapper.find('.swiper-next').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(2)
  })

  // 验证next点击事件且loop为true结果
  it('trigger swiper-prev and swiper-next click', () => {
    const list = [{
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
    }, {
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
    }, {
      url: 'javascript:',
      img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
    }]
    const wrapper = mount(Swiper, {
      propsData: {
        list,
        isPrevShow: true,
        isNextShow: true,
        loop: true
      }
    })
    expect(wrapper.contains('.swiper-prev')).toBe(true)
    expect(wrapper.contains('.swiper-next')).toBe(true)
    expect(wrapper.vm.currentIndex).toBe(1)
    wrapper.find('.swiper-prev').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(0)
    expect(wrapper.vm.fixIndex).toBe(wrapper.vm.list.length - 1)
    wrapper.find('.swiper-next').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(1)
    expect(wrapper.vm.fixIndex).toBe(0)
    wrapper.find('.swiper-next').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(2)
    expect(wrapper.vm.fixIndex).toBe(1)
    wrapper.find('.swiper-next').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(3)
    expect(wrapper.vm.fixIndex).toBe(2)
    wrapper.find('.swiper-next').trigger('click')
    expect(wrapper.vm.currentIndex).toBe(wrapper.vm.newList.length - 1)
    expect(wrapper.vm.fixIndex).toBe(0)
  })
})
