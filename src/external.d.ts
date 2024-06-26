/* eslint-disable @typescript-eslint/ban-types */
/*eslint @typescript-eslint/no-explicit-any: ["off"]*/

interface ObjectConstructor {
  assign(target: any, source: any): any;
  assign<T>(target: any, source: T): T;
}

interface DebugModule {
  debugMode: boolean;
  verboseMode: boolean;
  log: Function;
  verbose: Function;
  debug: Function;
  error: Function;
  dumpCallStack: Function;
  setDebugModule: (key: string, value: any, item?: number) => void;
}

declare let Debug: DebugModule;

declare module "vue-select";
declare module "vue-tree-list";
declare module "uuid";
declare module "color-util";
