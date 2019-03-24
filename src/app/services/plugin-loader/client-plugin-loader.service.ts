import { Injectable, NgModuleFactory } from '@angular/core';
import { PluginLoaderService } from './plugin-loader.service';
import { PLUGIN_EXTERNALS_MAP } from './plugin-externals';
import { PluginsConfigProvider } from '../plugins-config.provider';

@Injectable()
export class ClientPluginLoaderService extends PluginLoaderService {
  constructor(private configProvider: PluginsConfigProvider) {
    super();
  }

  provideExternals() {
    Object.keys(PLUGIN_EXTERNALS_MAP).forEach(externalKey =>
      window['define'](externalKey, [], () => PLUGIN_EXTERNALS_MAP[externalKey])
    );
  }

  load<T>(pluginName): Promise<NgModuleFactory<T>> {
    const { config } = this.configProvider;
    if (!config[pluginName]) {
      throw Error(`Can't find appropriate plugin`);
    }

    const depsPromises = (config[pluginName].deps || []).map(dep => {
      return window['System']
        .import(config[dep].path)
        .then(m => {
          window['define'](dep, [], () => m.default);
        });
    });

    return Promise.all(depsPromises).then(() => {
        return window['System']
          .import(config[pluginName].path)
          .then(module => module.default.default);
      }
    );
  }
}
