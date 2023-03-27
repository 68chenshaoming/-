import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/common.css";
//导入文本编辑器
import VueQuillEditor from "vue-quill-editor";
//文本编辑器的样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow themea
import "animate.css";
Vue.use(ElementUI);
Vue.use(VueQuillEditor);
Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
	router,
}).$mount("#app");
