import Vue from 'vue'
import Swiper from '@/lib/v-swiper'

describe('Swiper.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Swiper)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
  })
})
