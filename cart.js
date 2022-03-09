/* global axios bootstrap */
// eslint-disable-next-line
// 導入vue
import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "lomo1986";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;


//定義規則   規則的命名  對應9行.10行.11行當中的值
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 載入外部多國語系
loadLocaleFromURL('./zh_TW.json');

/// 設定語系
configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
  data() {
    return {
      cartData: {},
      products: [],
      productId: '',
      isLoadingItem:'',
    };
  },
  components: {
// 元件名稱是可以自行取名      後面的From/Field/ErrorMessage來自 10行中的VeeValidate
      VForm: Form,
      VField: Field,
      ErrorMessage: ErrorMessage,
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
    //取得購物車內容
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res) => {
        console.log(res);
        // this.products = res.data.products;
      });
    },
              // 參數預設值
    addToCart(id, qty=1)  {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios.post(`${apiUrl}/api/${apiPath}/cart`,{ data }).then((res) => {
        console.log(res);
        this.getCart();
        this.$refs.productModal.closeModal();
        this.isLoadingItem= '';
      });
    },
    // 刪除品項
    removeCartItem(id){
      this.isLoadingItem= id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`).then((res) => {
        console.log(res);
        this.getCart();
        this.isLoadingItem= '';
      });
    },
    updateCartItem(item)  {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`,{ data}).then((res) => {
        console.log(res);
        this.getCart();
        this.isLoadingItem = '';
      });
    },
    createOrder() {
        const url = `${apiUrl}/api/${apiPath}/order`;
        const order = this.form;
        axios.post(url, { data: order }).then((response) => {
          alert(response.data.message);
          // 欄位清空
          this.$refs.form.resetForm();
          this.getCart();
        }).catch((err) => {
          alert(err.data.message);
        });
      },
},
    // 將資料抓下來
  mounted() {
    this.getProducts();
    this.getCart();
  },
});
app.component('product-modal',{
  props: ['id'],
  template: '#userProductModal',
  data(){
    return {
      modal:{},
      product:{},
      qty:1,
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
    closeModal() {
      this.modal.hide();

    },
    getProduct(){
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`).then((res) => {
        console.log(res);
        this.product = res.data.product;
      });
    },
    addToCart(){
      this.$emit('add-Cart', this.product.id , this.qty);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },

});
app.mount("#app");
