import Theme from "vitepress/theme";
import "./style/var.css";
// import './style/custom-block.css'
// 添加图片预览功能 方式一：
// import mediumZoom from "medium-zoom";
// import { onMounted } from "vue";
// 添加图片预览功能 方式二：https://www.shakecode.com/zh/blog/other/vitepress-plugin-image-viewer
import "viewerjs/dist/viewer.min.css";
import imageViewer from "vitepress-plugin-image-viewer";
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue";
import { useRoute } from 'vitepress';

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp(ctx);
    // 注册全局组件（可选）
    // ctx.app.component('vImageViewer', vImageViewer);
},
  setup() {
    const route = useRoute();
    // 启用插件
    imageViewer(route);
    // onMounted(() => {
    //   // 添加图片预览功能
    //   mediumZoom("[data-zoomable]", { background: "var(--vp-c-bg)" });
    // });
  },
};
