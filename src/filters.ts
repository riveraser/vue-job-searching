import Vue from "vue";
import moment from "moment";

Vue.filter("formatDate", function(value: any, format: string) {
  if (value) {
    return moment(String(value)).format(format? format : "YYYY-MM-DD hh:mm a");
  }
});
