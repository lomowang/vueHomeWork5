/* global axios bootstrap */
// eslint-disable-next-line
// 導入vue
import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "lomo1986";

const app = createApp({
  data() {
    return {
      cartData: {},
      products: [],
      productId: '',
    };
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res) => {
        console.log(res);
        this.products = res.data.products;
      });
    },
    openProductModal(id) {
      // 取得產品id 才可以將產品名稱秀出來
      this.productId = id;
                     // 取得dom元素資料
      this.$refs.productModal.openModal();

    },
  },
    // 將資料抓下來
  mounted() {
    this.getProducts();
  },
});

app.component('product-modal',{
  props: ['id'],
  template: '#userProductModal',
  data(){
    return {
      modal:{},
      product:{},
    };
  },
  // 監控上面的ID
  watch:{
    id() {
      this.getProduct();
    },

  },
  methods:{
    // 控制視窗展開
    openModal(){
      this.modal.show();
    },
    getProduct(){
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`).then((res) => {
        console.log(res);
        this.product = res.data.product;
      });
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },

});
app.mount("#app");
