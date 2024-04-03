### 下载依赖
npm i

### 本地启动开发程序
npm run dev

### 代码编译
npm run build


### 访问链接和参数说明
#### 纯文本内容展示
https://www.mashaojie.cn/card-3d/?name=%E9%A9%AC%E5%B0%91%E6%9D%B0&time=2023.01.01&code=H99999999&cardColor=0x2e0f7c&backgroundColor=0x0000ff
#### 照片贴图内容展示
https://www.mashaojie.cn/card-3d/?name=%E9%A9%AC%E5%B0%91%E6%9D%B0&time=2023.01.01&code=H99999999&cardColor=0x2e0f7c&backgroundColor=0x0000ff&isHeader=true

#### 参数说明
| 字段名            | 默认值           | 描述             |
| ----------------- | ---------------- | ---------------- |
| name              | '某某某'         | 姓名             |
| time              | '9999.99.99 加入' | 加入时间字符串   |
| code              | 'H00000000'      | 用户编号         |
| fontColor         | 0xffffff         | 字体颜色         |
| lightingColor     | '0xffff00'       | 闪电颜色         |
| cardColor         | '0x2e0f7c'       | 卡牌颜色         |
| backgroundColor   | '0x0000ff'       | 环境背景色       |
| lightIntensity    | 4                | 光照强度         |
| cardMetalness     | 1                | 卡牌金属度       |
| cardRoughness     | 0.35             | 卡牌粗糙度       |
| cameraX           | -12              | 相机x坐标        |
| cameraY           | 0                | 相机y坐标        |
| cameraZ           | 36               | 相机z坐标        |
|                   |                  |                 |
| isHeader          | false            | 是否展示         |
| header            | https://download.mashaojie.cn/image/header.png | 头像地址【isHeader为true时候生效】 |
| description       | XXX              | 个人介绍【isHeader为true时候生效】         |
| author            | 创建者            | 创建者【isHeader为true时候生效】           |

