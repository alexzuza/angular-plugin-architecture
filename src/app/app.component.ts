import {
  Compiler,
  Component,
  Injector,
  NgModuleFactory,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

// import { Compiler, Component, ComponentFactory, Injector, NgModuleFactory, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('targetRef', { read: ViewContainerRef, static: true }) vcRef: ViewContainerRef;

  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private pluginLoader: PluginLoaderService
  ) {}

  ngOnInit() {
    this.loadPlugin('plugin1');
  }

  loadPlugin(pluginName: string) {
    this.pluginLoader.load(pluginName).then(elementModuleOrFactory => {
        if (elementModuleOrFactory instanceof NgModuleFactory) {
          // if ViewEngine
          return elementModuleOrFactory;
        } else {
          try {
            // if Ivy
            return this.compiler.compileModuleAsync(elementModuleOrFactory);
          } catch (err) {
            throw err;
          }
        }
      })
      .then(moduleFactory => {
        try {
          const elementModuleRef = moduleFactory.create(this.injector);
          const moduleInstance = elementModuleRef.instance;

          const entryComponent = (moduleFactory.moduleType as any).entry;
          const compFactory = elementModuleRef.componentFactoryResolver.resolveComponentFactory(
            entryComponent
          );
          this.vcRef.createComponent(compFactory);
            } catch (err) {
          throw err;
        }
      });
  }
}
