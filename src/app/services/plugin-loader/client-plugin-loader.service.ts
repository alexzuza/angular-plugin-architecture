import { NgModuleFactory } from '@angular/core';
import { PluginLoaderService } from './plugin-loader.service';
import { PLUGIN_EXTERNALS_MAP } from './plugin-externals';

export class ClientPluginLoaderService extends PluginLoaderService {
  provideExternals() {
    Object.keys(PLUGIN_EXTERNALS_MAP).forEach(externalKey =>
      window['define'](externalKey, [], () => PLUGIN_EXTERNALS_MAP[externalKey])
    );
  }

  load<T>(pluginName): Promise<NgModuleFactory<T>> {
    return window['System']
      .import(`/assets/plugins/${pluginName}.js`)
      .then(module => module.default.default);
  }
}
