<template>
  <v-row>
    <SearchForm
      :search.sync="searchText"
      :label="$t('forms.jobSearch')"
      @do-search="searchJobs"
    ></SearchForm>
    <v-col cols="12" md="8" lg="9">
      <v-card
        v-for="n in [1, 2, 3, 4, 5]"
        v-bind:key="n"
        
        class="mx-auto mb-12"
      >
        <template slot="progress">
          <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-img
          height="250"
          src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
        ></v-img>

        <v-card-title>Cafe Badilico {{ n }} </v-card-title>

        <v-card-text>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="4.5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>

            <div class="grey--text ml-4">
              4.5 (413)
            </div>
          </v-row>

          <div class="my-4 subtitle-1">
            $ • Italian, Cafe
          </div>

          <div>
            Small plates, salads & sandwiches - an intimate setting with 12
            indoor seats plus patio seating.
          </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>Tonight's availability</v-card-title>

        <v-card-text>
          <v-chip-group
            
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip>5:30PM</v-chip>

            <v-chip>7:30PM</v-chip>

            <v-chip>8:00PM</v-chip>

            <v-chip>9:00PM</v-chip>
          </v-chip-group>
        </v-card-text>

        <v-card-actions>
          <v-btn color="deep-purple lighten-2" text >
            Reserve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, MapAction } from "types-vue";
import SearchForm from "@/components/SearchForm";

@Component({
  components: {
    SearchForm
  }
})
export default class Home extends Vue {
  private searchText?: string = "";

  @MapAction({ namespace: "jobs" })
  fetchJobs: any;

  searchJobs() {
    console.log("Looking for jobs now: ", this.searchText);
    this.fetchJobs(this.searchText);
  }
}
</script>
