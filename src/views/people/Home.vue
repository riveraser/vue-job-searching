<template>
  <v-row id="top-page">
    <SearchForm
      :search.sync="searchText"
      :label="$t('forms.peopleSearch')"
      :resultText="resultText"
      :showReset="totalPages > 0 ? true : false"
      @do-search="searchPeople"
      @reset-form="clearSearch"
    ></SearchForm>
    <v-col cols="12" md="8" lg="9" v-if="totalPages === 0">
      <v-sheet rounded="lg" class="px-5 py-4">
        {{ $t("template.searchEmptyMessage") }}
      </v-sheet>
    </v-col>
    <v-col v-else cols="12" md="8" lg="9">
      <v-card
        v-for="people in peopleListing"
        v-bind:key="people.username"
        class="mx-auto mb-12"
      >
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title>
              {{ people.name }}
              -
              <h6>{{ people.locationName }}</h6>
            </v-card-title>
            <v-card-text>
              <div class="subtitle-1">
                {{ people.professionalHeadline }}
              </div>
              <div>
                {{ $t("template.fullTimeEmployment") }} :
                <span
                  v-if="people.compensations && people.compensations.employee"
                >
                  <strong>{{ getRate(people.compensations.employee) }} </strong>
                </span>
                <span v-else>
                  <strong>{{ $t("template.noData") }}</strong>
                </span>
              </div>
              <div>
                {{ $t("template.freelanceGigs") }} :
                <span
                  v-if="people.compensations && people.compensations.freelancer"
                >
                  <strong>{{
                    getRate(people.compensations.freelancer)
                  }}</strong>
                </span>
                <span v-else>
                  <strong>{{ $t("template.noData") }}</strong>
                </span>
              </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
            <v-card-title>{{ $t("template.currentSkills") }}</v-card-title>

            <v-card-text v-if="people.skills && people.skills.length > 0">
              <ShowMore :minHeight="88">
                <v-chip-group column>
                  <v-chip
                    v-for="skill in people.skills"
                    v-bind:key="skill.name"
                  >
                    <v-avatar left class="green">
                      {{ skill.weight }}
                    </v-avatar>
                    {{ skill.name }}
                  </v-chip>
                </v-chip-group>
              </ShowMore>
            </v-card-text>
            <v-card-text v-else> - {{ $t("template.noData") }} - </v-card-text>

            <v-card-actions>
              <v-btn
                color="deep-purple lighten-2"
                text
                :to="{
                  name: 'PeopleDetail',
                  params: { id: people.username, pageTitle: people.name }
                }"
              >
                {{ $t("navigation.seeDetails") }}
              </v-btn>
            </v-card-actions>
          </div>
          <div>
            <v-avatar v-if="people.picture" class="ma-3" size="100">
              <v-img :src="people.picture"></v-img>
            </v-avatar>
            <v-avatar v-else class="ma-3" color="orange" size="100">
              <span class="white--text headline">{{
                getAvatarChars(people.name)
              }}</span>
            </v-avatar>
            <div class="overline mb-4 text-center"></div>
          </div>
        </div>
      </v-card>
      <Pagination
        v-if="peopleListing.length > 0"
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

import { peopleResultsInterface } from "@/interfaces/people";
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
  private currentPage?: number = 1;
  private tempSearch?: string = "";
  private show?: boolean = false;
  private peopleInfo: any = {};

  @MapGetter()
  getLanguage?: string;

  @MapGetter()
  getProcessing?: boolean;

  @MapAction()
  stopLoading?: any;

  @MapGetter({ namespace: "people" })
  getSearchText?: string;

  @MapGetter({ namespace: "people" })
  getPage?: number;

  @MapGetter({ namespace: "people" })
  getPeople?: peopleResultsInterface;

  @MapAction({ namespace: "people" })
  fetchPeople?: any;

  @MapAction({ namespace: "people" })
  clearSearch?: any;

  mounted() {
    this.stopLoading();
    this.searchText = this.getSearchText;
    this.currentPage = this.getPage;
  }

  searchPeople() {
    this.currentPage = 1;
    this.fetchPeople({
      search: this.searchText?.trim(),
      page: this.currentPage,
      language: this.getLanguage
    });
    this.tempSearch = this.searchText;
  }

  getAvatarChars(name: string): string {
    return helpers.getAvatarChars(name);
  }

  getRate(data: any): string {
    return (
      helpers.toCurrency(data.amount, data.currency) +
      " / " +
      this.$t(`template.${data.periodicity}`) +
      ` (${data.currency.replace("$", "")})`
    );
  }

  changePage(value: number): void {
    this.searchText = this.getSearchText;
    this.fetchPeople({
      search: this.searchText?.trim(),
      page: value,
      language: this.getLanguage
    });
  }

  get peopleListing(): unknown[] {
    return this.getPeople?.results || [];
  }
  get totalPages(): number {
    return this.getPeople?.total ? Math.ceil(this.getPeople?.total / 10) : 0;
  }
  get isProcessing(): boolean {
    return this.getProcessing || false;
  }

  get resultText(): string {
    if (this.getPeople) {
      try {
        return this.$t("forms.results")
          .toString()
          .replace("[QTY]", this.getPeople?.total.toString());
      } catch (err) {
        return " ";
      }
    } else {
      return " ";
    }
  }
}
</script>
