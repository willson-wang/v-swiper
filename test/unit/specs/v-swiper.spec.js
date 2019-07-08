import Swiper from '@/lib/v-swiper'
import { mount } from '@vue/test-utils'

describe('Swiper.vue', () => {
    // 测试渲染slide-item数量
    it('renders slide-item for each item in props.list', () => {
        const list = [
            {
                url: 'javascript:',
                img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
            },
            {
                url: 'javascript:',
                img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
            },
            {
                url: 'javascript:',
                img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
            }
        ]
        const wrapper = mount(Swiper, {
            propsData: { list }
        })
        expect(wrapper.findAll('.slide-item').length).toEqual(list.length)
    })

    // 验证传入的props
    it('renders props when passed', () => {
        const prop = {
            loop: false,
            list: [
                {
                    url: 'javascript:',
                    img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
                },
                {
                    url: 'javascript:',
                    img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
                },
                {
                    url: 'javascript:',
                    img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
                }
            ],
            showDots: true
        }
        const wrapper = mount(Swiper, {
            propsData: { ...prop }
        })
        expect(wrapper.contains('.swiper-dots')).toBe(true)
    })

    // 验证swiper-item点击事件
    it('trigger slide-item click', () => {
        const list = [
            {
                url: 'javascript:',
                img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
            },
            {
                url: 'javascript:',
                img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
            },
            {
                url: 'javascript:',
                img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
            }
        ]
        const mockFn = jest.fn()
        const wrapper = mount(Swiper, {
            propsData: { list },
            methods: {
                selectItem: mockFn
            }
        })
        wrapper.findAll('.slide-item').trigger('click')
        expect(mockFn).toBeCalled()
        expect(mockFn).toHaveBeenCalledTimes(3)
    })
})
