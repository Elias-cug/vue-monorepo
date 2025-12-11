# 工具函数

Vue Monorepo 提供了一套丰富的工具函数库，涵盖了日常开发中的常用功能，包括数据处理、格式化、验证、DOM 操作等。

## 核心特性

- 📦 **模块化组织** - 按功能分类，按需引入
- 🎯 **TypeScript** - 完整的类型定义
- 🚀 **高性能** - 优化的算法实现
- 🧪 **充分测试** - 单元测试覆盖
- 📖 **文档完善** - 详细的使用说明
- 🔧 **可扩展** - 支持自定义扩展

## 日期时间

### 格式化

```typescript
import { formatDate, formatTime, formatDateTime } from '@lee/utils';

// 日期格式化
formatDate(new Date()); // '2024-12-11'
formatDate('2024-12-11', 'YYYY/MM/DD'); // '2024/12/11'
formatDate(Date.now(), 'YYYY年MM月DD日'); // '2024年12月11日'

// 时间格式化
formatTime(new Date()); // '14:30:00'
formatTime('2024-12-11 14:30:00', 'HH:mm'); // '14:30'

// 日期时间格式化
formatDateTime(new Date()); // '2024-12-11 14:30:00'
formatDateTime(Date.now(), 'MM/DD HH:mm'); // '12/11 14:30'
```

### 相对时间

```typescript
import { timeAgo, timeFromNow } from '@lee/utils';

// 过去时间
timeAgo('2024-12-10'); // '1天前'
timeAgo(Date.now() - 3600000); // '1小时前'
timeAgo(Date.now() - 60000); // '1分钟前'

// 未来时间
timeFromNow('2024-12-12'); // '1天后'
timeFromNow(Date.now() + 3600000); // '1小时后'

// 自定义格式
timeAgo(date, {
  locale: 'en', // 英文
  short: true, // 简短格式: '1d'
});
```

### 日期计算

```typescript
import { addDays, subtractDays, daysBetween, isWeekend } from '@lee/utils';

// 日期加减
const tomorrow = addDays(new Date(), 1);
const yesterday = subtractDays(new Date(), 1);
const nextWeek = addDays(new Date(), 7);

// 计算间隔
daysBetween('2024-12-01', '2024-12-11'); // 10

// 判断周末
isWeekend(new Date()); // true/false
isWeekend('2024-12-14'); // true (周六)
```

## 数字处理

### 格式化

```typescript
import { formatNumber, formatCurrency, formatPercent } from '@lee/utils';

// 数字格式化
formatNumber(1234567.89); // '1,234,567.89'
formatNumber(1234567.89, 2); // '1,234,567.89'
formatNumber(1234.5, 2); // '1,234.50'

// 货币格式化
formatCurrency(1234.56); // '¥1,234.56'
formatCurrency(1234.56, 'USD'); // '$1,234.56'
formatCurrency(1234.56, 'EUR'); // '€1,234.56'

// 百分比格式化
formatPercent(0.1234); // '12.34%'
formatPercent(0.1234, 1); // '12.3%'
formatPercent(1.5); // '150%'
```

### 单位转换

```typescript
import { formatBytes, formatDuration } from '@lee/utils';

// 字节格式化
formatBytes(1024); // '1 KB'
formatBytes(1024 * 1024); // '1 MB'
formatBytes(1024 * 1024 * 1024); // '1 GB'
formatBytes(1536, 2); // '1.50 KB'

// 时长格式化
formatDuration(60); // '1分钟'
formatDuration(3661); // '1小时1分钟1秒'
formatDuration(86400); // '1天'
formatDuration(90061, { format: 'HH:mm:ss' }); // '25:01:01'
```

### 数学计算

```typescript
import { sum, average, median, clamp, round } from '@lee/utils';

// 统计计算
sum([1, 2, 3, 4, 5]); // 15
average([1, 2, 3, 4, 5]); // 3
median([1, 2, 3, 4, 5]); // 3

// 范围限制
clamp(5, 0, 10); // 5
clamp(-5, 0, 10); // 0
clamp(15, 0, 10); // 10

// 精确四舍五入
round(1.2345, 2); // 1.23
round(1.2356, 2); // 1.24
```

## 字符串处理

### 格式转换

```typescript
import { camelCase, kebabCase, snakeCase, pascalCase } from '@lee/utils';

// 驼峰
camelCase('hello-world'); // 'helloWorld'
camelCase('hello_world'); // 'helloWorld'
camelCase('HelloWorld'); // 'helloWorld'

// 短横线
kebabCase('helloWorld'); // 'hello-world'
kebabCase('HelloWorld'); // 'hello-world'

// 下划线
snakeCase('helloWorld'); // 'hello_world'
snakeCase('hello-world'); // 'hello_world'

// 帕斯卡
pascalCase('hello-world'); // 'HelloWorld'
pascalCase('hello_world'); // 'HelloWorld'
```

### 字符串操作

```typescript
import { truncate, capitalize, trimAll, escape } from '@lee/utils';

// 截断
truncate('这是一段很长的文本', 10); // '这是一段很长...'
truncate('Hello World', 5, '***'); // 'Hello***'

// 首字母大写
capitalize('hello world'); // 'Hello world'
capitalize('HELLO WORLD', true); // 'Hello World' (每个单词)

// 去除所有空格
trimAll('  hello  world  '); // 'helloworld'

// HTML 转义
escape('<script>alert("XSS")</script>');
// '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

## 数组操作

### 数组处理

```typescript
import { unique, chunk, flatten, shuffle, groupBy } from '@lee/utils';

// 去重
unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
unique([{ id: 1 }, { id: 1 }], 'id'); // [{ id: 1 }]

// 分块
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// 扁平化
flatten([1, [2, [3, [4]]]]); // [1, 2, [3, [4]]]
flatten([1, [2, [3, [4]]]], 2); // [1, 2, 3, [4]]
flatten([1, [2, [3, [4]]]], Infinity); // [1, 2, 3, 4]

// 随机打乱
shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]

// 分组
const users = [
  { name: 'Alice', age: 25, role: 'admin' },
  { name: 'Bob', age: 30, role: 'user' },
  { name: 'Charlie', age: 25, role: 'user' },
];
groupBy(users, 'role');
// {
//   admin: [{ name: 'Alice', ... }],
//   user: [{ name: 'Bob', ... }, { name: 'Charlie', ... }]
// }
```

### 树形结构

```typescript
import { arrayToTree, treeToArray, findTreeNode } from '@lee/utils';

// 数组转树
const list = [
  { id: 1, name: '根节点', parentId: null },
  { id: 2, name: '子节点1', parentId: 1 },
  { id: 3, name: '子节点2', parentId: 1 },
];
const tree = arrayToTree(list);

// 树转数组
const array = treeToArray(tree);

// 查找节点
const node = findTreeNode(tree, node => node.id === 2);

// 过滤树
const filtered = filterTree(tree, node => node.visible);
```

## 对象操作

### 对象处理

```typescript
import { pick, omit, deepClone, deepMerge } from '@lee/utils';

// 选择属性
const obj = { a: 1, b: 2, c: 3 };
pick(obj, ['a', 'c']); // { a: 1, c: 3 }

// 排除属性
omit(obj, ['b']); // { a: 1, c: 3 }

// 深拷贝
const cloned = deepClone(obj);

// 深合并
const merged = deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 });
// { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

### 路径操作

```typescript
import { get, set, has, unset } from '@lee/utils';

const obj = { a: { b: { c: 1 } } };

// 获取值
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'

// 设置值
set(obj, 'a.b.d', 2); // obj.a.b.d = 2

// 判断存在
has(obj, 'a.b.c'); // true

// 删除属性
unset(obj, 'a.b.c'); // 删除 obj.a.b.c
```

## 验证工具

### 数据验证

```typescript
import { isEmail, isPhone, isIdCard, isUrl } from '@lee/utils';

// 邮箱验证
isEmail('test@example.com'); // true
isEmail('invalid-email'); // false

// 手机号验证（中国）
isPhone('13812345678'); // true
isPhone('12345678901'); // false

// 身份证验证（中国）
isIdCard('110101199003070134'); // true

// URL 验证
isUrl('https://example.com'); // true
isUrl('ftp://file.com'); // true
isUrl('not-a-url'); // false
```

### 类型判断

```typescript
import { isArray, isObject, isEmpty, isNil } from '@lee/utils';

// 类型判断
isArray([1, 2, 3]); // true
isObject({ a: 1 }); // true
isObject([]); // false

// 空值判断
isEmpty(''); // true
isEmpty([]); // true
isEmpty({}); // true
isEmpty(null); // true
isEmpty(0); // false

// null 或 undefined
isNil(null); // true
isNil(undefined); // true
isNil(0); // false
```

## DOM 操作

### 元素操作

```typescript
import { addClass, removeClass, hasClass, toggleClass } from '@lee/utils';

const el = document.querySelector('.box');

// 类名操作
addClass(el, 'active');
removeClass(el, 'active');
toggleClass(el, 'active');
hasClass(el, 'active'); // true/false

// 样式操作
import { getStyle, setStyle } from '@lee/utils';

getStyle(el, 'width'); // '100px'
setStyle(el, 'width', '200px');
setStyle(el, {
  width: '200px',
  height: '100px',
});
```

### 滚动操作

```typescript
import { scrollTo, scrollToTop, scrollToElement } from '@lee/utils';

// 滚动到指定位置
scrollTo({ top: 500, left: 0 });

// 滚动到顶部
scrollToTop();
scrollToTop({ duration: 500 }); // 动画时长

// 滚动到元素
const target = document.querySelector('#target');
scrollToElement(target);
scrollToElement(target, { offset: -100 }); // 偏移量
```

## 函数工具

### 防抖节流

```typescript
import { debounce, throttle } from '@lee/utils';

// 防抖
const debouncedFn = debounce(value => {
  console.log('搜索:', value);
}, 500);

// 节流
const throttledFn = throttle(e => {
  console.log('滚动位置:', e.target.scrollTop);
}, 200);

// 使用
input.addEventListener('input', debouncedFn);
window.addEventListener('scroll', throttledFn);
```

### 函数组合

```typescript
import { compose, pipe, curry, memoize } from '@lee/utils';

// 组合（从右到左）
const addThenMultiply = compose(
  x => x * 2,
  x => x + 1
);
addThenMultiply(3); // (3 + 1) * 2 = 8

// 管道（从左到右）
const processData = pipe(
  x => x + 1,
  x => x * 2
);
processData(3); // (3 + 1) * 2 = 8

// 柯里化
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
add(1, 2)(3); // 6

// 记忆化
const fibonacci = memoize(n => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

## URL 处理

```typescript
import { parseUrl, stringifyUrl, getUrlParams } from '@lee/utils';

// 解析 URL
const parsed = parseUrl('https://example.com/path?a=1&b=2#hash');
// {
//   protocol: 'https:',
//   host: 'example.com',
//   pathname: '/path',
//   search: '?a=1&b=2',
//   hash: '#hash',
//   query: { a: '1', b: '2' }
// }

// 构建 URL
stringifyUrl({
  url: 'https://example.com/path',
  query: { a: 1, b: 2 },
  hash: 'section',
});
// 'https://example.com/path?a=1&b=2#section'

// 获取查询参数
getUrlParams('https://example.com?a=1&b=2'); // { a: '1', b: '2' }
getUrlParams(); // 当前页面的查询参数
```

## 浏览器工具

### 剪贴板

```typescript
import { copyText, readClipboard } from '@lee/utils';

// 复制文本
await copyText('Hello World');

// 读取剪贴板
const text = await readClipboard();
```

### 文件处理

```typescript
import { downloadFile, readFile, selectFile } from '@lee/utils';

// 下载文件
downloadFile('data:text/plain;charset=utf-8,Hello', 'hello.txt');
downloadFile(blob, 'file.pdf');

// 读取文件
const file = await selectFile({ accept: '.jpg,.png' });
const content = await readFile(file, 'dataURL');
```

## 加密解密

```typescript
import { md5, sha256, base64Encode, base64Decode } from '@lee/utils';

// 哈希
md5('hello'); // '5d41402abc4b2a76b9719d911017c592'
sha256('hello'); // '2cf24dba5fb0a30e26e83b2ac5b9e29e...'

// Base64
base64Encode('hello'); // 'aGVsbG8='
base64Decode('aGVsbG8='); // 'hello'

// AES 加密
import { aesEncrypt, aesDecrypt } from '@lee/utils';

const encrypted = aesEncrypt('secret data', 'password');
const decrypted = aesDecrypt(encrypted, 'password');
```

## 颜色处理

```typescript
import { hexToRgb, rgbToHex, lighten, darken } from '@lee/utils';

// 颜色转换
hexToRgb('#1890ff'); // { r: 24, g: 144, b: 255 }
rgbToHex(24, 144, 255); // '#1890ff'

// 颜色调整
lighten('#1890ff', 0.2); // 亮度提高 20%
darken('#1890ff', 0.2); // 亮度降低 20%
```

## 最佳实践

1. **按需引入** - 只引入需要的函数，减少打包体积
2. **类型安全** - 使用 TypeScript 获得类型提示
3. **错误处理** - 合理处理可能的异常情况
4. **性能优化** - 对高频调用的函数使用缓存或优化
5. **扩展性** - 可以基于现有工具函数进行扩展

## API 参考

完整的 API 文档正在建设中。

## 相关资源

- [状态管理](/base/state) - 状态相关工具
- [请求模块](/base/service) - 网络请求工具
- [存储方案](/base/storage) - 存储相关工具
