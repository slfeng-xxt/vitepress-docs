# vite

## vite.config.ts

### 1. vite打包后静态资源路径控制

:::tip
vite中配置rollupOptions，可以控制打包后静态资源路径,即可去rollup官网查看[rollupOptions](https://rollupjs.org/configuration-options/#output-entryfilenames)
:::

```js
build: {
    rollupOptions: {
      output: {
          entryFileNames: 'assets/[name]-[hash].js', // 入口文件名
        chunkFileNames: 'assets/[name]-[hash].js', // chunk文件名
        // assetFileNames: 'assets/[name]-[hash][extname]', // 静态资源文件名
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|gif|svg)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }, // 分类处理静态资源文件
         manualChunks(id) { // 代码分割
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
}
```
