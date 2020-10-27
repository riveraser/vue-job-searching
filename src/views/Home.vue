<template>
  <v-row>
    <SearchForm
      :search.sync="searchText"
      :label="$t('forms.jobSearch')"
      :resultText="resultText"
      @do-search="searchJobs"
    ></SearchForm>
    <v-col cols="12" md="8" lg="9">
      <v-card
        v-for="job in jobListing"
        v-bind:key="job.id"
        class="mx-auto mb-12"
      >
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title>{{ job.objective }}</v-card-title>
            <v-card-text>
              <div class="my-4 subtitle-1">
                $ {{ job.compensantion || `To be defined` }} •
                {{ job.locations.toString() }}
              </div>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-title>Skills</v-card-title>

            <v-card-text>
              <v-chip-group column>
                <v-chip v-for="skill in job.skills" v-bind:key="skill.name">
                  {{ skill.experience }} - {{ skill.name }}
                </v-chip>
              </v-chip-group>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="deep-purple lighten-2"
                text
                @click="showDetail(job.id)"
              >
                {{ $t("navigation.seeDetails") }}
              </v-btn>
            </v-card-actions>
          </div>
          <div>
            <v-avatar class="ma-3" size="125" tile>
              <v-img
                :src="
                  job.organizations[0].picture
                    ? job.organizations[0].picture
                    : ''
                "
              ></v-img>
            </v-avatar>
            <div class="overline mb-4 text-center">
              {{ job.organizations[0].name }}
            </div>
          </div>
        </div>
      </v-card>
      <v-pagination
        v-if="jobListing.length > 0"
        v-model="currentPage"
        :length="totalPages"
        circle
        total-visible="10"
        :disabled="isProcessing"
      ></v-pagination>
    </v-col>
    <DialogInfo :show.sync="show" @change-state="cancelForm($event)">
      <template v-slot:header>
        {{ $t("template.details") }} - {{ jobInfo.objective }}
      </template>

      <p class="mt-2"></p>
      <div>
        <h2>Mas informacion aqui si hay tiempo agregar mas detalles</h2>
      </div>
      <div>
        <h4>Details:</h4>
        <p v-for="detail in jobInfo.details" v-bind:key="detail.code">
          {{ detail.content }}
        </p>
      </div>
      <div>
        <h3>Strengths</h3>
        <v-chip-group column>
          <v-chip
            v-for="strength in jobInfo.strengths"
            v-bind:key="strength.code"
          >
            {{ strength.name }} - {{ strength.experience }}
          </v-chip>
        </v-chip-group>
      </div>

      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn depressed outlined @click="cancelForm(false)" color="primary"
          >Ok</v-btn
        >
      </template>
    </DialogInfo>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, MapAction, MapGetter, Watch } from "types-vue";
import SearchForm from "@/components/SearchForm";
import DialogInfo from "@/components/DialogInfo";

import { jobsResultsInterface } from "@/interfaces/jobs";

@Component({
  components: {
    SearchForm,
    DialogInfo
  }
})
export default class Home extends Vue {
  private searchText?: string = "";
  private currentPage?: number = 1;
  private tempSearch?: string = "";
  private show?: boolean = false;
  private jobInfo: any = { strengths: [] };

  @MapGetter()
  getLanguage?: string;

  @MapGetter()
  getProcessing?: boolean;

  @MapGetter({ namespace: "jobs" })
  getJobs?: jobsResultsInterface;

  @MapGetter({ namespace: "jobs" })
  getJobsDetail?: jobsResultsInterface;

  @MapAction({ namespace: "jobs" })
  fetchJobs?: any;

  @MapAction({ namespace: "jobs" })
  fetchJobsDetail?: any;

  @MapAction({ namespace: "jobs" })
  getJobsPage?: number;

  searchJobs() {
    this.currentPage = 1;
    this.fetchJobs({
      search: this.searchText?.trim(),
      page: this.currentPage - 1,
      language: this.getLanguage
    });
    this.tempSearch = this.searchText;
  }
  async showDetail(id: string) {
    this.jobInfo = { strengths: [] };
    await this.fetchJobsDetail(id);
    if (this.getJobsDetail) {
      this.jobInfo = this.getJobsDetail;
      this.show = true;
    }
  }
  cancelForm(resp: any) {
    this.show = false;
  }

  @Watch("currentPage")
  onPageChanged(value: number): void {
    this.searchText = this.tempSearch;
    this.fetchJobs({
      search: this.searchText?.trim(),
      page: value - 1,
      language: this.getLanguage
    });
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
