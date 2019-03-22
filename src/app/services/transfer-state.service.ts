import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

let isBrowser: boolean;
let isServer: boolean;
let transferState: TransferState;

@Injectable({
  providedIn: 'root'
})
export class TransferStateService {
  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    transferState = state;
    isBrowser = isPlatformBrowser(this.platformId);
    isServer = isPlatformServer(this.platformId);
  }
}

export const preserveServerState = (
  keyName: string,
  emptyResult: any = null
) => {
  const key = makeStateKey(keyName);
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function() {
      if (isBrowser && transferState.hasKey(key)) {
        const state = transferState.get(key, emptyResult);
        return of(state);
      }

      return method.apply(this, arguments).pipe(
        tap(res => {
          if (isServer) {
            transferState.set(key, res);
          }
        })
      );
    };
  };
};
