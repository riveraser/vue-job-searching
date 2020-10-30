<template>
  <v-row>
    <SearchForm
      :search.sync="searchText"
      :label="$t('forms.peopleSearch')"
      :resultText="resultText"
      @do-search="searchPeople"
    ></SearchForm>
    <v-col cols="12" md="8" lg="9">
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
              <div class="my-4 subtitle-1">
                {{ people.professionalHeadline }}
              </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
            <v-card-title>Skills</v-card-title>

            <v-card-text>
              <v-chip-group column>
                <v-chip v-for="skill in people.skills" v-bind:key="skill.name">
                  <v-avatar left class="green">
                    {{ skill.weight }}
                  </v-avatar>
                  {{ skill.name }}
                </v-chip>
              </v-chip-group>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="deep-purple lighten-2"
                text
                @click="showDetail(people.username)"
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
      <v-pagination
        v-if="peopleListing.length > 0"
        v-model="currentPage"
        :length="totalPages"
        circle
        total-visible="10"
        :disabled="isProcessing"
      ></v-pagination>
    </v-col>
    <DialogInfo :show.sync="show" @change-state="cancelForm($event)">
      <template v-slot:header>
        {{ $t("template.details") }} - {{ peopleInfo.objective }}
      </template>

      <p class="mt-2"></p>
      <div>
        <h2>Mas informacion aqui si hay tiempo agregar mas detalles</h2>
      </div>
      <div>
        <h4>Details:</h4>
        <p v-for="detail in peopleInfo.details" v-bind:key="detail.code">
          {{ detail.content }}
        </p>
      </div>
      <div>
        <h3>Strengths</h3>
        <v-chip-group column>
          <v-chip
            v-for="strength in peopleInfo.strengths"
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
  private peopleInfo: any = {};

  @MapGetter()
  getLanguage?: string;

  @MapGetter()
  getProcessing?: boolean;

  @MapAction()
  stopLoading?: any;

  @MapGetter({ namespace: "people" })
  getPeople?: jobsResultsInterface;

  @MapGetter({ namespace: "people" })
  getPeopleDetail?: any;

  @MapAction({ namespace: "people" })
  fetchPeople?: any;

  @MapAction({ namespace: "people" })
  fetchPeopleDetail?: any;

  @MapAction({ namespace: "people" })
  getPeoplePage?: number;

  mounted() {
    this.stopLoading();
  }

  searchPeople() {
    this.currentPage = 1;
    this.fetchPeople({
      search: this.searchText?.trim(),
      page: this.currentPage - 1,
      language: this.getLanguage
    });
    this.tempSearch = this.searchText;
  }

  async showDetail(id: string) {
    this.peopleInfo = { strengths: [] };
    await this.fetchPeopleDetail(id);
    if (this.getPeopleDetail) {
      this.peopleInfo = this.getPeopleDetail;
      this.show = true;
    }
  }
  cancelForm(resp: any) {
    this.show = false;
  }

  getAvatarChars(name: string): string {
    const arrTempo = name.split(" ");
    let ret;
    switch (arrTempo.length) {
      case 1:
        ret = arrTempo[0].slice(0, 2);
        break;
      case 2:
        ret = arrTempo[0].slice(0, 1) + "" + arrTempo[1].slice(0, 1);
        break;
      default:
        ret = arrTempo[0].slice(0, 1) + "" + arrTempo[2].slice(0, 1);
    }
    return ret.toUpperCase();
  }

  @Watch("currentPage")
  onPageChanged(value: number): void {
    this.searchText = this.tempSearch;
    this.fetchPeople({
      search: this.searchText?.trim(),
      page: value - 1,
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