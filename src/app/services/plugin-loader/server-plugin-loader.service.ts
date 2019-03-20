import { NgModuleFactory } from '@angular/core';
import { PluginLoaderService } from './plugin-loader.service';
import { PLUGIN_EXTERNALS_MAP } from './plugin-externals';

declare let global: any;

export class ServerPluginLoaderService extends PluginLoaderService {
  provideExternals() {
    const Module = global['require']('module');
    const originalRequire = Module.prototype.require;
    Module.prototype.require = function(name) {
      return (
        PLUGIN_EXTERNALS_MAP[name] || originalRequire.apply(this, arguments)
      );
    };
  }

  load<T>(pluginName): Promise<NgModuleFactory<T>> {
    const factory = global['require'](
      `./browser/assets/plugins/${pluginName}.js`
    ).default;
    return Promise.resolve(factory);
  }
}
