import { Injectable, NgModuleFactory } from '@angular/core';
import { PluginLoaderService } from './plugin-loader.service';
import { PLUGIN_EXTERNALS_MAP } from './plugin-externals';
import { PluginsConfigProvider } from '../plugins-config.provider';

declare let global: any;

@Injectable()
export class ServerPluginLoaderService extends PluginLoaderService {
  constructor(private configProvider: PluginsConfigProvider) {
    super();
  }

  provideExternals() {
    const that = this;
    const Module = global['require']('module');
    const originalRequire = Module.prototype.require;
    Module.prototype.require = function(name) {
      if (that.configProvider.config[name]) {
        return global['require'](
          `./browser${that.configProvider.config[name].path}`
        );
      }
      return (
        PLUGIN_EXTERNALS_MAP[name] || originalRequire.apply(this, arguments)
      );
    };
  }

  load<T>(pluginName): Promise<NgModuleFactory<T>> {
    const { config } = this.configProvider;
    if (!config[pluginName]) {
      throw Error(`Can't find appropriate plugin`);
    }

    const factory = global['require'](`./browser${config[pluginName].path}`)
      .default;
    return Promise.resolve(factory);
  }
}
