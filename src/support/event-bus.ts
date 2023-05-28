import Vue from "vue";

const eventBusInstance = new Vue();

export const EventBus = {
  Changed: "changed",
  Deleted: "deleted",
  Loaded: "loaded",

  Instance: eventBusInstance,
};

/**
 *  EventBus Usage
 *  
     import { EventBus } from '@/support/event-bus';
     
     EventBus.Instance.$emit(EventBus.Changed, value);
     
     EventBus.Instance.$on(EventBus.Changed, value => {
         // do my thing
     });
*/
