# 网页脚本开发模板

适用于 [脚本猫](https://scriptcat.org/zh-CN) 脚本开发, 兼容 [篡改猴](https://www.tampermonkey.net/) 脚本开发.

> 本开发模板的主要维护 `TypeScript` 版本. 
>
> `JavaScript` 版本为 `TypeScript`  版本直接编译而来, 仅保证可正常开发打包项目, 某些功能 (如类型检查等) 因 `tsc` 编译导致的功能缺失不在维护范围内. 



## Feature

1. 符合现代 `JavaScript` 编码规则, 可读的打包文件.
2. 自动识别 `grant` 授权函数, 自动填写. 
3. 生产环境打包文件备份. 



## Usage

***前期准备***

1. 下载模板 `ts-template` / `js-template`, 将其复制到自己的项目库中. 
2. 重命名项目名. 
3. 在 `template/banner/UserScript.ts` 文件中, 修改脚本信息, 详细内容见 [修改 UserScript](#修改 UserScript).
4. 若脚本需要使用 ScriptCat 的用户配置功能, 在 `template/banner/UserConfig.ts` 文件中修改用户配置, 详细内容见 [修改 UserConfig](#修改 UserConfig). 

> 不会使用到 `package.json` 中的 `name` 字段和 `version` 字段, 无须对 `package.json` 进行修改. 

---

***项目开发***

5. `template/src/main.ts` 文件为项目的入口文件. 



---

***开发调试***

6. 开发完成脚本后, 在终端输入 `npm run dev` 命令可打包一个开发环境脚本, 路径为 `template/dist/<脚本名>.dev.js`. 

> 开发环境脚本与生产环境脚本的区别: 
>
> 1. 开发环境脚本会保留 `console.log` 打印, 生产环境脚本会删除 `console.log`. 生产环境的日志输出请使用 `console.info`
> 2. 开发环境的脚本的脚本名(`@name`)和版本号(`@version`)会自动添加 `-beta` 后缀, 方便辨识. 
> 3. 开发环境脚本的 `UserScript` 会自动携带本地文件引用 (`@require`), 方便调试. 



---

***打包发布***

7. 修改 `README.md` 文件, 对脚本进行说明.
8. 修改 `template/docx/更新日志.md` 文件, 对更新内容进行说明.
9. 在终端输入 `npm run build` 命令, 打开一个生产环境脚本, 路径为 `template/dist/<脚本名>.js` .

> 1. 生产环境脚本打包之后, 会同时复制一份储存到 `template/dist/<版本号>/<脚本名>.js` 路径中, 作为备份. 
> 2. 同一个版本号只能打包一次, 再次打包会提示报错, 这是为了避免错误覆盖的情况. 如果需要使用同一个版本号再次打包, 需要手动删除 `template/dist/<版本号>/<脚本名>.js` 文件. 



### 修改 UserScript

用户脚本信息为一个 Entry 数组, 即一份二维二项元组, 二项元组(`Entry`)的内容为: `[键名, 键值]`, 这个二项元组会被映射成以下用户脚本信息文本格式: 

```js
// @<键名>    <键值>
```

部分可重复的用户脚本信息 (如 `@match`) 的写入方式为重复写入, 即: 

```ts
const UserScript = [
	['grant', 'GM_setValue'],
    ['grant', 'GM_getValue'],
]
```

> 使用 Entry 数组而不是使用 Object 是为了数据最后映射成文本时能保留写入时的顺序. 

**用户脚本信息内容**

| 键名          | 类型     | 说明                             | 可重复 |
| ------------- | -------- | -------------------------------- | ------ |
| `name`        | `string` | 脚本名                           | 否     |
| `description` | `string` | 脚本描述                         | 否     |
| `version`     | `string` | 版本号                           | 否     |
| `namespace`   | `string` | 命名空间                         | 否     |
| `author`      | `string` | 脚本作者                         | 否     |
| `run-at`      | `string` | 脚本运行时                       | 否     |
| `icon`        | `string` | 脚本图标                         | 否     |
| `require`     | `string` | 脚本引用                         | 是     |
| `grant`       | `string` | 授权函数. *打包时自动填写可忽视* | 是     |
| `match`       | `string` | 脚本作用域                       | 是     |
| `connect`     | `string` | 脚本授权域名                     | 是     |
| `resource`    | `string` | 脚本引用资源                     | 是     |
| `license`     | `string` | 脚本许可证                       | 否     |
| `background`  | `string` | ScriptCat 后台脚本标记           | 否     |
| `crontab`     | `string` | ScriptCat 定时脚本定时设置       | 否     |



### 修改 UserConfig

> 同 [脚本名文档-用户配置](https://docs.scriptcat.org/docs/dev/config/) 的使用方式一样, 区别在于本模板使用 Object 格式写入内容并添加了类型提示. 

```ts
/**
 * ScriptCat 配置
 */
export declare interface IUserConfig {
	[ groupName: string ]: {
		[ configKey: string ]: UserConfigItemInterface
	};
}

export declare interface UserConfigItemInterface {
	/** 配置标题 */
	title: string;
	/** 配置描述 */
	description: string;
	/** 配置类型 */
	type: 'text' | 'checkbox' | 'number' | 'select' | 'mult-select' | 'textarea';
	/** 配置默认值 */
	default?: string | number | boolean | unknown[];
	/** 列表选择器的候选 (select 和 mult-select 可用) */
	values?: unknown[];
	/** 动态显示绑定的values,值是以$开头的key,value需要是一个数组 (select 和 mult-select 可用) */
	bind?: unknown[];
	/** 最小输入值 (text 和 number 可用) */
	min?: number;
	/** 最大输入值 (text 和 number 可用) */
	max?: number;
	/** 单位 (number 可用) */
	unit?: string;
	/** 是否显示为密码框 (text 可用) */
	password?: boolean;
}
```

