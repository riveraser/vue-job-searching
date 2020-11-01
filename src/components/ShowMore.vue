<template>
  <div class="show-more" :style="getStyle()">
    <div ref="hiddenContent" class="show-more-content">
      <slot></slot>
    </div>
    <v-expand-transition>
      <div class="show-more-actions" v-if="height > minHeight">
        <v-btn
          class="show-more-button"
          text
          x-small
          color="primary"
          @click="isExpanded = !isExpanded"
          >{{
            $t(isExpanded ? "navigation.showLess" : "navigation.showMore")
          }}
          <v-icon right dark v-if="isExpanded">
            mdi-arrow-up-bold-circle
          </v-icon>
          <v-icon right dark v-else>
            mdi-arrow-down-bold-circle
          </v-icon>
        </v-btn>
      </div>
    </v-expand-transition>
    <resize-observer @notify="onResize" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "types-vue";

@Component
export default class ShowMore extends Vue {
  private myElement: any;
  private isExpanded?: boolean = false;
  private width = 0;
  private height = 0;

  @Prop({
    type: Number,
    required: false,
    default: 88
  })
  minHeight?: number;

  mounted() {
    this.myElement = this.$refs.hiddenContent;
    this.height = this.myElement.offsetHeight;
  }
  onResize(event: any) {
    this.height = this.myElement.offsetHeight;
  }
  getStyle() {
    if (this.height > this.minHeight! && !this.isExpanded) {
      return `height: ${this.minHeight}px; padding-bottom: 10px;`;
    } else {
      return this.myElement ? `height: ${this.myElement.offsetHeight+20}px`: ``;
    }
  }
}
</script>

<style lang="less">
.show-more {
  position: relative;
  overflow: hidden;
  height: auto;
  padding-bottom: 25px;
  transition: height 0.4s ease-in-out;
  
  .show-more-actions {
    position: absolute;
    height: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    display: flex;
    background: -webkit-linear-gradient(
      270deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 75%
    );

    .show-more-button {
      align-self: flex-end;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
