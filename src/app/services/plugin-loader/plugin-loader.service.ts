import { NgModuleFactory } from '@angular/core';

export abstract class PluginLoaderService {
  protected constructor() {
    this.provideExternals();
  }

  abstract provideExternals(): void;

  abstract load<T>(pluginName): Promise<NgModuleFactory<T>>;
}
