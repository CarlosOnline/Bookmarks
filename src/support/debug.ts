/*eslint @typescript-eslint/no-empty-function: ["off"]*/
/*eslint @typescript-eslint/no-explicit-any: ["off"]*/
/*eslint no-console: "off"*/

const DefaultDebug = {
  debugMode: false,
  verboseMode: false,
  log: () => {},
  verbose: () => {},
  debug: () => {},
  error: () => {},
  dumpCallStack: () => {},
  setDebugModule: (_key: string, _value: any, _item?: number) => {},
};

let Debug = { ...DefaultDebug, ...console };

const debugMode =
  import.meta.env.VITE_DEBUG_MODE == "true" ||
  import.meta.env.VITE_DEBUG_MODE == "1";

const verboseMode =
  import.meta.env.VITE_VERBOSE_MODE == "true" ||
  import.meta.env.VITE_VERBOSE_MODE == "1";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function dumpCallStack() {
  const stack = new Error().stack;
  Debug.log("PRINTING CALL STACK");
  Debug.log(stack);
}

function setDebugModule(
  key: string,
  value: any,
  item: string | number = undefined
) {
  const windowObj = window as any;

  let name = key;
  value = value || null;

  const parts = key.replace(/([^a-z0-9-]+)/gi, "").split("-");
  const capitalized = parts.map((item) => capitalize(item)).join("");

  if (item) {
    name = "g_" + capitalized;
    if (!windowObj[name]) windowObj[name] = {};

    windowObj[name][item] = value;
    return;
  }

  switch (key.toLowerCase()) {
    case "app":
      name = "g_App";
      break;
    case "serverdata":
      name = "g_ServerData";
      break;
    case "wizard":
      name = "g_Wizard";
      break;
    default:
      name = "g_" + capitalized;
      break;
  }

  windowObj[name] = value;
  //Debug.log("setDebugModule", name, value?.toString().substr(0, 20));
}

if (debugMode) {
  Debug = {
    ...Debug,
    ...{
      debugMode,
      verboseMode,
      dumpCallStack,
      setDebugModule,
    },
    ...console,
  };
}

const windowObj = window as any;
windowObj.Debug = Debug;
console.log("Debug", Debug);

export function initializeDebugModule() {}
