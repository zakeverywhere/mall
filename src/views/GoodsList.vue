<template>
  <div>
    <nav-header> </nav-header>
    <nav-bread>
      <span>
        Goods
      </span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" @click="toggleSort('')" v-bind:class="{'cur':sortby==''}" class="default">Default</a>
          <a href="javascript:void(0)" @click="toggleSort('price')" v-bind:class="{'sort-up':sort!=='salePrice'}" class="price">
            Price 
            <svg class="icon icon-arrow-short" >
              <use href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="popFilterby">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterbyFlag}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" v-bind:class="{'cur':priceCheck == 'all'}" @click="setPriceCheck('all')">All</a>
              </dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" v-bind:class="{'cur':priceCheck == index}" @click="setPriceCheck(index)">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="goods in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+goods.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{goods.productName}}</div>
                    <div class="price">{{goods.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:void(0);" @click="addCart(goods.productId)" class="btn btn--m">add to cart</a>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- infinite scoll -->
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot='message'>please log in first</p>
      <div slot='btnGroup'>
        <a class='btn btn--m' href="javascript:void(0)" @click="mdShow=false"> Ok </a>
      </div>
    </Modal>
    <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <svg class="icon icon-ok">
        <use xlink:href="#icon-ok"></use>
      </svg>
      <p slot='message'>shopping cart added success</p>
      <div slot='btnGroup'>
        <a class='btn btn--m' href="javascript:void(0)" @click="mdShowCart=false"> keep shopping </a>
        <router-link class='btn btn--m' to="/cart"> view cart </router-link>
      </div>
    </Modal>
    <div class="md-overlay md-show" v-if="overlayFlag" @click="closeFilterBy"></div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import "@/assets/css/product.css"
import "@/assets/css/base.css"
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import Modal from '@/components/Modal'
import axios from 'axios'

export default {
  data() {
    return {
      goodsList: [],
      priceFilter: [{
          "startPrice": "0",
          "endPrice": "500"
        },
        {
          "startPrice": "500",
          "endPrice": "1000"
        },
        {
          "startPrice": "1000",
          "endPrice": "2000"
        },
        {
          "startPrice": "2000",
          "endPrice": "3000"
        },
        {
          "startPrice": "3000",
          "endPrice": "3000 +"
        },

      ],
      loading: true,
      priceCheck: "all",
      filterbyFlag: false,
      overlayFlag: false,
      sortby: "",
      mdShow: false,
      mdShowCart: false,
      busy: false,
      pageIndex: 1,
      pageSize: 8,
      sort: ""
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted: function() {
    this.getGoodsList()
  },
  methods: {
    getGoodsList(flag) {
      this.loading = true
      let startPrice = 'all'
      let endPrice = 'all'
      if (this.priceCheck === 'all') {

      } else {
        startPrice = parseInt(this.priceFilter[this.priceCheck].startPrice)
        endPrice = parseInt(this.priceFilter[this.priceCheck].endPrice)
      }

      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sort: this.sort,
        startPrice,
        endPrice
      }

      axios
        .get('/api/goods', { params })
        .then((res) => {
          this.loading = false
          let goods = res.data.results
          if (flag) {
            this.goodsList = this.goodsList.concat(goods)
            if (goods.length < 8) {
              this.busy = true
              return
            } else {
              this.busy = false
            }
            return
          }
          this.goodsList = goods
          this.busy = false
        }).catch((err) => {
          console.log(err)
        })
    },
    setPriceCheck(index) {
      this.priceCheck = index
      this.pageIndex = 1
      this.getGoodsList()
      this.closeFilterBy()
    },
    popFilterby() {
      this.filterbyFlag = true
      this.overlayFlag = true
    },
    closeFilterBy() {
      this.filterbyFlag = false
      this.overlayFlag = false
    },
    loadMore() {
      this.busy = true
      setTimeout(() => {
        this.pageIndex++
          this.getGoodsList(true)
      }, 500)
    },
    toggleSort(option) {
      this.pageIndex = 1
      switch (option) {
        case 'price':
          this.sortby = "price"
          if (this.sort == 'salePrice') {
            this.sort = '-' + this.sort
            break
          }
          this.sort = 'salePrice'
          break
        default:
          this.sortby = ''
          this.sort = ''
      }
      this.getGoodsList()
    },
    addCart(productId) {
      axios
        .post('/api/cart', {
          userId: 100000077,
          productId
        })
        .then((res) => {
          const data = res.data
          if (data.confirmation === 'success') {
            this.mdShowCart = true
            return
          }
          this.mdShow = true
        })
        .catch((err) => {
          console.log(err)
        })
    },
    closeModal() {
      this.mdShow = false
      this.mdShowCart = false
    }
  }
}

</script>
