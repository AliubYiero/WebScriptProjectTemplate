import { defineConfig } from 'vite';
import vitePluginRaw from 'vite-plugin-raw';
import { appendPromisePlugin, extractGrantPlugin } from './vite.plugin.config';
import {
	userScript,
} from './vite.util.config';

export default defineConfig( {
	esbuild: {
		minifySyntax: false,
		minifyIdentifiers: false,
		minifyWhitespace: false,
	},
	build: {
		// 不清空打包目录
		emptyOutDir: false,
		
		// rollup打包配置
		rollupOptions: {
			/*
			* 项目 io 配置
			* */
			input: 'src/main.ts',
			output: {
				format: 'es',
			},
			
			/*
			* 插件配置
			* */
			plugins: [
				// 自动提取 GM/CAT 授权函数
				extractGrantPlugin(),
				vitePluginRaw( {
					match: /\.(css|html)$/,
				} ),
				// 添加后台脚本 Promise 块
				appendPromisePlugin( Boolean( userScript.mapper.background || userScript.mapper.crontab ) ),
			],
		},
	},
	
} );
