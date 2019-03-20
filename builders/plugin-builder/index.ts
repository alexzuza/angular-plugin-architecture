import { BrowserBuilder, NormalizedBrowserBuilderSchema } from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import * as fs from 'fs';
import { Observable } from 'rxjs';

import { BuilderConfiguration, BuildEvent } from '@angular-devkit/architect';

interface PluginBuilderSchema extends NormalizedBrowserBuilderSchema {
  /**
   * A string of the form `path/to/file#exportName` that acts as a path to include to bundle
   */
  modulePath: string;

  /**
   * A name of compiled bundle
   */
  pluginName: string;
}
export default class LazyBuilder extends BrowserBuilder {

  private options: PluginBuilderSchema;

  buildWebpackConfig(
    root: Path,
    projectRoot: Path,
    host: virtualFs.Host<fs.Stats>,
    options: PluginBuilderSchema,
  ) {
    if (!this.options.modulePath) {
      throw Error('Please define modulePath!');
    }

    if (!this.options.pluginName) {
      throw Error('Please provide pluginName!');
    }

    const config = super.buildWebpackConfig(root, projectRoot, host, options);

    delete config.entry.polyfills;
    delete config.optimization.runtimeChunk;
    delete config.optimization.splitChunks;
    delete config.entry.styles;

    config.externals = {
      rxjs: 'rxjs',
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common',
      // put here other common dependencies
    };

    const [modulePath, moduleName] = this.options.modulePath.split('#');
    fs.writeFileSync(config.entry.main[0], `import * as ngModule from '${modulePath}';
import { ${moduleName}NgFactory } from '${modulePath}.ngfactory';
export default ${moduleName}NgFactory;
`);

    config.output.library = 'ngPlugin';
    config.output.libraryTarget = 'umd';
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
    config.output.filename = `${this.options.pluginName}.js`;

    return config;
  }

  run(builderConfig: BuilderConfiguration<PluginBuilderSchema>): Observable<BuildEvent> {
    this.options = builderConfig.options;
    builderConfig.options.deleteOutputPath = false;

    return super.run(builderConfig);
  }
}

