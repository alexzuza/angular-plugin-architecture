import { NgModule } from '@angular/core';
import {
  ServerModule,
  ServerTransferStateModule
} from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';
import { ServerPluginLoaderService } from './services/plugin-loader/server-plugin-loader.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule
],
  providers: [
    { provide: PluginLoaderService, useClass: ServerPluginLoaderService }
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
