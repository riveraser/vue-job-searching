<template>
  <v-dialog
    scrollable
    transition="scroll-y-transition"
    persistent
    v-model="showDialog"
    :max-width="maxwidth"
  >
    <v-card>
      <v-toolbar color="primary" dark flat dense>
        <v-toolbar-title>
          <h4>
            <slot name="header"></slot>
          </h4>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon large @click.stop="showDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-2">
        <slot></slot>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: Boolean,
    maxWidth: String
  },
  computed: {
    maxwidth() {
      return this.maxWidth || 600;
    },
    showDialog: {
      // getter
      get: function() {
        return this.show;
      },
      // setter
      set: function(newValue) {
        this.$emit("update:show", newValue);
      }
    }
  }
};
</script>
