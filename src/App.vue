<template>
    <div id="app">
        <swiper
            :list="bannerList"
            height="180px"
            :loop="true"
            :auto="false"
            :showDots="true"
            v-model="swiperIndex"
            @selectItem="selectItem"
        ></swiper>
        <div style="margin-top: 10px"></div>
        <swiper
            :list="bannerList"
            height="180px"
            :loop="true"
            :auto="true"
            direction="vertical"
        ></swiper>
        <div style="margin-top: 10px"></div>
        <div class="broadcast">
            <p></p>
            <swiper
                :isBroadcast="true"
                :showDots="false"
                :list="bannerList"
                height="30px"
                :loop="true"
                :auto="true"
            >
            </swiper>
        </div>
        <div style="margin-top: 10px"></div>
        <div class="broadcast">
            <p></p>
            <swiper
                :isBroadcast="true"
                :showDots="false"
                :list="bannerList"
                height="30px"
                :loop="true"
                :auto="true"
                :minMovingDistance="10"
                direction="vertical"
            ></swiper>
        </div>
    </div>
</template>

<script>
import swiper from './lib/v-swiper'

export default {
    name: 'App',
    components: {
        swiper
    },
    data() {
        return {
            bannerList: [
                {
                    img: require('./assets/pic1.jpg'),
                    href: '0',
                    txt: '这是一条消息0'
                },
                {
                    img: require('./assets/pic2.jpg'),
                    href: '1',
                    txt: '这是一条消息1'
                },
                {
                    img: require('./assets/pic3.png'),
                    href: '2',
                    txt: '这是一条消息2'
                },
                {
                    img: require('./assets/pic4.jpg'),
                    href: '3',
                    txt: '这是一条消息3'
                }
            ],
            swiperIndex: 4
        }
    },
    watch: {
        swiperIndex(val) {
            console.log('swiperIndex', val)
        }
    },
    methods: {
        selectItem(idx) {
            console.log(idx)
        }
    },
    computed: {}
}
</script>

<style>
body {
    margin: 0;
    padding: 0;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.broadcast {
    display: flex;
}

.broadcast > p {
    flex: 0 0 40px;
    height: 30px;
    margin: 0;
    background: url('./assets/broadcast.png') no-repeat center;
    background-size: 20px 20px;
}

.broadcast > div {
    flex: 1;
}
</style>
