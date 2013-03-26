function inlineWorkerPlugin() {
	this.plugin("normal-module-factory", function(nmf) {
		nmf.plugin("before-resolve", function(data, callback) {
			data.request = data.request.replace(/worker!/, "worker?inline!");
			callback(null, data);
		});
	});
}

module.exports = function(grunt) {
	grunt.initConfig({
		webpack: {
			test: {
				entry: "mocha!./test/client-tests",
			},
			"cover-test": {
				entry: "mocha!./test/cover-client-tests",
				module: {
					postLoaders: [{
						test: /./, // any
						exclude: [
							/node_modules.chai/,
							/node_modules.mocha-loader/,
							/node_modules.coverjs-loader/,
							/node_modules.webpack.buildin/
						],
						loader: "coverjs-loader"
					}]
				}
			},
			options: {
				output: {
					path: "assets"
				},
				module: {
					loaders: [
						{ test: /\.json$/, loader: "<%= 'json' %>" },
						{ test: /\.css$/, loader: "style!css" },
						{ test: /\.coffee$/, loader: "coffee-loader" }
					],
				},
				plugins: [
					inlineWorkerPlugin
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-webpack');
	
	grunt.registerTask('default', ['webpack:test']);
	grunt.registerTask('cover', ['webpack:cover-test']);
};