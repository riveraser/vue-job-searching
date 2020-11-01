<template>
  <v-row id="top-page">
    <SearchForm
      :search.sync="searchText"
      :label="$t('forms.jobSearch')"
      :resultText="resultText"
      :showReset="totalPages > 0 ? true : false"
      @do-search="searchJobs"
      @reset-form="clearSearch"
    ></SearchForm>
    <v-col cols="12" md="8" lg="9" v-if="totalPages === 0">
      <v-sheet rounded="lg" class="px-5 py-4">
        {{ $t("template.searchEmptyMessage") }}
      </v-sheet>
    </v-col>
    <v-col cols="12" md="8" lg="9" v-else>
      <v-card
        v-for="job in jobListing"
        v-bind:key="job.id"
        class="mx-auto mb-12"
      >
        <div class="d-flex flex-no-wrap justify-space-between" :id="job.id">
          <div>
            <v-card-title>{{ job.objective }}</v-card-title>
            <v-card-text>
              <div class="my-4 subtitle-1">
                {{
                  job.compensation && job.compensation.data
                    ? getCompensation(job.compensation.data)
                    : $t("template.toBeDefined")
                }}
                •
                {{ job.locations.toString() }}
              </div>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-title>{{ $t("template.experiences") }}</v-card-title>

            <v-card-text>
              <ShowMore :minHeight="88">
                <v-chip-group column>
                  <v-chip
                    v-for="skill in job.skills"
                    v-bind:key="`${job.id}-${skill.name}`"
                  >
                    {{ skill.experience }} - {{ skill.name }}
                  </v-chip>
                </v-chip-group>
              </ShowMore>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="deep-purple lighten-2"
                text
                :to="{
                  name: 'JobsDetail',
                  params: { id: job.id, pageTitle: job.objective }
                }"
              >
                {{ $t("navigation.seeDetails") }}
              </v-btn>
            </v-card-actions>
          </div>
          <div>
            <v-avatar class="ma-3" size="125" tile>
              <v-img
                v-if="
                  job.organizations.length > 0 && job.organizations[0].picture
                "
                :src="job.organizations[0].picture"
              ></v-img>
              <v-img
                v-else
                :src="require('@/assets/avatar.png')"
                class="gray"
              ></v-img>
            </v-avatar>
            <div class="overline mb-4 text-center">
              {{
                job.organizations.length > 0 && job.organizations[0].name
                  ? job.organizations[0].name
                  : ""
              }}
            </div>
          </div>
        </div>
      </v-card>
      <Pagination
        v-if="jobListing.length > 0"
        :totalPages="totalPages"
        :isProcessing="isProcessing"
        :currentPage.sync="currentPage"
        @page-change="changePage"
      ></Pagination>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, MapAction, MapGetter } from "types-vue";
import SearchForm from "@/components/SearchForm";
import Pagination from "@/components/Pagination";
import ShowMore from "@/components/ShowMore";

import { jobsResultsInterface } from "@/interfaces/jobs";
import helpers from "@/helpers";

@Component({
  components: {
    SearchForm,
    Pagination,
    ShowMore
  }
})
export default class Home extends Vue {
  private searchText?: string = "";
  private tempSearch?: string = "";
  private show?: boolean = false;
  private jobInfo?: unknown = {};
  private currentPage?: number = 1;

  @MapGetter()
  getLanguage?: string;

  @MapGetter()
  getProcessing?: boolean;

  @MapAction()
  stopLoading?: any;

  @MapGetter({ namespace: "jobs" })
  getSearchText?: string;

  @MapGetter({ namespace: "jobs" })
  getPage?: number;

  @MapGetter({ namespace: "jobs" })
  getJobs?: jobsResultsInterface;

  @MapAction({ namespace: "jobs" })
  fetchJobs?: any;

  @MapAction({ namespace: "jobs" })
  clearSearch?: any;

  mounted() {
    this.stopLoading();
    this.searchText = this.getSearchText;
    this.currentPage = this.getPage;
  }

  searchJobs() {
    this.currentPage = 1;
    this.fetchJobs({
      search: this.searchText?.trim(),
      page: this.currentPage,
      language: this.getLanguage
    });
  }

  changePage(value: number): void {
    this.searchText = this.getSearchText;
    this.fetchJobs({
      search: this.searchText?.trim(),
      page: value,
      language: this.getLanguage
    });
  }
  getCompensation(compensation: any): string {
    const ret = this.$t("template.toBeDefined").toString();

    const response = helpers.getCompensation(
      compensation,
      this.$t("template." + compensation.periodicity).toString()
    );

    return response === "" ? ret : response;
  }

  get jobListing(): unknown[] {
    return this.getJobs?.results || [];
  }
  get totalPages(): number {
    return this.getJobs?.total ? Math.ceil(this.getJobs?.total / 10) : 0;
  }
  get isProcessing(): boolean {
    return this.getProcessing || false;
  }

  get resultText(): string {
    if (this.getJobs) {
      try {
        return this.$t("forms.results")
          .toString()
          .replace("[QTY]", this.getJobs?.total.toString());
      } catch {
        return " ";
      }
    } else {
      return " ";
    }
  }
}
</script>
