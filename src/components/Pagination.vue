<template>
  <v-pagination
    v-model="selectedPage"
    :length="totalPages"
    circle
    :total-visible="totalVisible"
    :disabled="isProcessing"
  ></v-pagination>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "types-vue";

@Component
export default class Pagination extends Vue {
  private totalVisible = 10;
  private actualPage?: number = 1;

  @Prop()
  currentPage?: number;

  @Prop()
  totalPages?: number;

  @Prop()
  isProcessing?: boolean;

  @Watch("currentPage")
  onPageChanged(value: number): void {
    this.$emit("page-change", value);
    this.$vuetify.goTo("#top-page", {
      duration: 100,
      offset: 0,
      easing: "easeInOutCubic"
    });
  }
  get selectedPage() {
    return this.currentPage || 1;
  }
  set selectedPage(val: number) {
    this.$emit("update:currentPage", val);
  }
}
</script>