import {
  Component,
  Inject,
  Injector,
  OnInit,
  PLATFORM_ID,
  ViewContainerRef
} from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';
import { isPlatformServer } from '@angular/common';

const SSR_ENABLED = makeStateKey<boolean>('SSR_ENABLED');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private vcRef: ViewContainerRef,
    private injector: Injector,
    private pluginLoader: PluginLoaderService,
    @Inject(PLATFORM_ID) private readonly platformId: {},
    private transferState: TransferState
  ) {}

  ngOnInit() {
    const ssrEnable = this.transferState.get(SSR_ENABLED, false);
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(SSR_ENABLED, true);
    }
    if (!ssrEnable) {
      this.loadPlugin('plugin1');
    }
  }

  loadPlugin(pluginName: string) {
    this.pluginLoader.load(pluginName).then(moduleFactory => {
      const moduleRef = moduleFactory.create(this.injector);
      const entryComponent = (moduleFactory.moduleType as any).entry;
      const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
        entryComponent
      );
      this.vcRef.createComponent(compFactory);
    });
  }
}
