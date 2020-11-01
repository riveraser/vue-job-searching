<template>
  <v-row id="top-page">
    <v-col
      cols="12"
      md="10"
      lg="8"
      xl="6"
      offset-md="1"
      offset-lg="2"
      offset-xl="3"
    >
      <v-row>
        <v-col>
          <GoBackBtn></GoBackBtn>
        </v-col>
        <v-col class="text-right">
          <v-btn text depressed small color="blue" @click="sheet = !sheet">
            {{ $t("navigation.contactUser") }}
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-sheet v-if="isProcessing" rounded="lg" class="px-5 py-4">
        <v-skeleton-loader
          class="mx-auto"
          type="article, actions, list-item-two-line, table-tfoot"
        ></v-skeleton-loader>
      </v-sheet>
      <v-sheet v-else rounded="lg" class="px-5 py-4">
        <h1>{{ peopleDetail.objective }}</h1>
        <v-card class="mx-auto" flat>
          <v-img
            :src="
              peopleDetail.person && peopleDetail.person.picture
                ? peopleDetail.person.picture
                : 'https://cdn.vuetifyjs.com/images/cards/server-room.jpg'
            "
            class="main-background"
          >
            <v-row align="end" class="fill-height main-back ">
              <v-col cols="12" sm="3" class="picture-info-header">
                <v-avatar class="profile ml-2" color="wgite" size="180">
                  <v-img
                    v-if="
                      peopleDetail.person &&
                        peopleDetail.person.pictureThumbnail
                    "
                    :src="peopleDetail.person.pictureThumbnail"
                  ></v-img>
                  <v-img
                    v-else
                    :src="require('@/assets/avatar.png')"
                    class="gray"
                  ></v-img>
                </v-avatar>
              </v-col>
              <v-col class="py-0 text-info-header">
                <v-list-item color="rgba(0, 0, 0, .4)" dark>
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      <h1 class="name-title">
                        {{ peopleDetail.person.name }}
                      </h1>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <h3 class="name-headline">
                        {{ peopleDetail.person.professionalHeadline }}
                      </h3>
                      <p
                        v-if="
                          peopleDetail.person &&
                            peopleDetail.person.links &&
                            peopleDetail.person.links.length > 0
                        "
                      >
                        <v-btn
                          class="ml-2"
                          text
                          icon
                          color="lighten-2"
                          v-for="link in peopleDetail.person.links"
                          v-bind:key="link.id"
                          :href="link.address"
                          target="_blank"
                        >
                          <v-icon>{{ getLinkIcons(link.name) }}</v-icon>
                        </v-btn>
                      </p>
                      <span
                        v-if="
                          peopleDetail.person && peopleDetail.person.location
                        "
                      >
                        {{ peopleDetail.person.location.name }}
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-card color="#888890" dark flat>
                <v-card-title
                  v-if="
                    peopleDetail.opportunities &&
                      peopleDetail.opportunities.length > 0
                  "
                  class="headline"
                >
                  {{ getJobInterest(peopleDetail.opportunities) }}
                </v-card-title>
                <v-card-title v-else class="headline">
                  {{ $t("template.noData") }}
                </v-card-title>

                <v-card-subtitle>
                  {{ $t("template.fullTimeEmployment") }}
                </v-card-subtitle>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card color="#888890" dark flat>
                <v-card-title class="headline">
                  {{ getFreelanceInterest(peopleDetail.opportunities) }}
                </v-card-title>
                <v-card-subtitle>
                  {{ $t("template.freelanceGigs") }}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-card-text v-if="peopleDetail.person.summaryOfBio">
            {{ peopleDetail.person.summaryOfBio }}
          </v-card-text>
          <v-card-text>
            <b>{{ $t("template.languages") }}</b
            >:
            <span
              v-if="peopleDetail.languages && peopleDetail.languages.length > 0"
            >
              <v-chip
                class="ma-2"
                v-for="language in peopleDetail.languages"
                v-bind:key="language.code"
              >
                <v-avatar left color="white">
                  <span
                    :class="
                      `flag-icon flag-icon-${
                        language.code === 'en' ? 'gb' : language.code
                      }`
                    "
                  ></span>
                </v-avatar>
                {{ language.language }}
              </v-chip>
            </span>
            <span v-else>
              {{ $t("template.noData") }}
            </span>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <h3 class="text--primary">{{ $t("template.currentSkills") }}</h3>
            <ShowMore
              :minHeight="90"
              v-if="peopleDetail.strengths && peopleDetail.strengths.length > 0"
            >
              <v-chip-group
                v-if="
                  peopleDetail.strengths && peopleDetail.strengths.length > 0
                "
                column
              >
                <v-chip
                  v-for="skill in peopleDetail.strengths"
                  v-bind:key="`${skill.code}-${skill.name}`"
                  ><v-avatar left class="green"> {{ skill.weight }} </v-avatar
                  >{{ skill.name }}</v-chip
                >
              </v-chip-group>
            </ShowMore>
            <div v-else>- {{ $t("template.noData") }} -</div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="text--primary">{{ $t("template.jobs") }}</h3>
                <ShowMore
                  :minHeight="350"
                  v-if="peopleDetail.jobs && peopleDetail.jobs.length > 0"
                >
                  <v-timeline align-top dense>
                    <v-timeline-item
                      v-for="jobs in peopleDetail.jobs"
                      :key="jobs.id"
                      large
                    >
                      <template v-slot:icon>
                        <v-avatar
                          v-if="
                            jobs.organizations &&
                              jobs.organizations.length > 0 &&
                              jobs.organizations[0].picture
                          "
                          :title="jobs.organizations[0].name"
                        >
                          <img :src="jobs.organizations[0].picture" />
                        </v-avatar>

                        <v-avatar v-else color="gray">
                          <strong>{{
                            getAvatarChars(jobs.organizations[0].name)
                          }}</strong>
                        </v-avatar>
                      </template>
                      <div>
                        <div class="font-weight-normal">
                          {{ jobs.fromYear }} {{ jobs.fromMonth }} -
                          <span v-if="jobs.toYear || jobs.toMonth"
                            >{{ jobs.toYear }} {{ jobs.toMonth }}
                          </span>
                        </div>
                        <div>
                          <h4>{{ jobs.name }}</h4>
                        </div>
                        <div
                          class="caption mb-1"
                          v-if="
                            jobs.organizations && jobs.organizations.length > 0
                          "
                        >
                          @{{ jobs.organizations[0].name }}
                        </div>
                        <p v-if="jobs.additionalInfo">
                          {{ jobs.additionalInfo }}
                        </p>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </ShowMore>
                <div v-else>- {{ $t("template.noData") }} -</div>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col cols="12" md="5">
                <h3 class="text--primary">{{ $t("template.education") }}</h3>
                <ShowMore
                  :minHeight="350"
                  v-if="
                    peopleDetail.education && peopleDetail.education.length > 0
                  "
                >
                  <v-timeline align-top dense>
                    <v-timeline-item
                      v-for="education in peopleDetail.education"
                      :key="education.id"
                      large
                    >
                      <template v-slot:icon>
                        <v-avatar
                          v-if="
                            education.organizations &&
                              education.organizations.length > 0 &&
                              education.organizations[0].picture
                          "
                          :title="education.organizations[0].name"
                        >
                          <img :src="education.organizations[0].picture" />
                        </v-avatar>

                        <v-avatar v-else color="gray">
                          <strong>{{
                            getAvatarChars(education.organizations[0].name)
                          }}</strong>
                        </v-avatar>
                      </template>
                      <div>
                        <div class="font-weight-normal">
                          {{ education.fromYear }} {{ education.fromMonth }} -
                          <span v-if="education.toYear || education.toMonth"
                            >{{ education.toYear }} {{ education.toMonth }}
                          </span>
                        </div>
                        <div>
                          <h4>{{ education.name }}</h4>
                        </div>
                        <div
                          class="caption mb-1"
                          v-if="
                            education.organizations &&
                              education.organizations.length > 0
                          "
                        >
                          @{{ education.organizations[0].name }}
                        </div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </ShowMore>
                <div v-else>- {{ $t("template.noData") }} -</div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <div class="text-center">
              <v-btn color="blue" dark @click="sheet = !sheet">
                {{ $t("navigation.contactUser") }}
              </v-btn>
              <v-bottom-sheet v-model="sheet">
                <v-sheet class="text-center" height="200px">
                  <v-btn class="mt-6" text color="red" @click="sheet = !sheet">
                    {{ $t("navigation.close") }}
                  </v-btn>
                  <div class="py-3">
                    {{ $t("template.applyJobText") }}
                  </div>
                  <v-btn
                    class="mb-6"
                    text
                    color="primary"
                    :href="
                      `https://bio.torre.co/en/${peopleDetail.person.publicId}`
                    "
                    target="_blank"
                  >
                    {{ $t("navigation.proceed") }}
                  </v-btn>
                </v-sheet>
              </v-bottom-sheet>
            </div>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, MapAction, MapGetter, Watch } from "types-vue";
import GoBackBtn from "@/components/GoBackBtn.vue";
import ShowMore from "@/components/ShowMore";

import _GroupBy from "lodash/groupBy";
import helpers from "@/helpers";

@Component({
  components: {
    GoBackBtn,
    ShowMore
  }
})
export default class Home extends Vue {
  private detailId?: string = "";
  private sheet?: boolean = false;

  @MapGetter()
  getProcessing?: boolean;

  @MapAction()
  stopLoading: any;

  @MapGetter({ namespace: "people" })
  getPeopleDetail: any | undefined;

  @MapAction({ namespace: "people" })
  fetchPeopleDetail?: any;

  beforeMount() {
    this.detailId = this.$route.params.id;
    this.fetchPeopleDetail(this.detailId);
  }
  mounted() {
    this.stopLoading();
  }

  getLinkIcons(linkName: string): string {
    switch (linkName) {
      case "twitter":
        return "mdi-twitter";
      case "linkedin":
        return "mdi-linkedin";
      case "github":
        return "mdi-github";
      case "gitlab":
        return "mdi-gitlab";
      default:
        return "mdi-link";
    }
  }
  getAvatarChars(name: string): string {
    return helpers.getAvatarChars(name);
  }

  getJobInterest(data: any): any {
    const jobs = _GroupBy(data, "interest").jobs;

    if (jobs) {
      const response: any = helpers.getUserJobInterestRate(jobs);
      if (response.rate === "") {
        return this.$t(`template.${response.message}`);
      } else {
        return (
          response.rate +
          " / " +
          this.$t("template." + response.periodicity).toString() +
          ` (${response.currency.replace("$", "")})`
        );
      }
    } else {
      return this.$t("template.noData").toString();
    }
  }

  getFreelanceInterest(data: any): any {
    const jobs = _GroupBy(data, "interest").gigs;
    if (jobs) {
      const response: any = helpers.getUserJobInterestRate(jobs);
      if (response.rate === "") {
        return this.$t(`template.${response.message}`);
      } else {
        return (
          response.rate +
          " / " +
          this.$t("template." + response.periodicity).toString() +
          ` (${response.currency.replace("$", "")})`
        );
      }
    } else {
      return this.$t("template.noData").toString();
    }
  }

  get peopleDetail() {
    return this.getPeopleDetail || {};
  }
  get isProcessing(): boolean {
    return this.getProcessing || false;
  }

  // Wills set the new title if we are refreshing the page
  @Watch("getPeopleDetail")
  onDataChanged(value: any): void {
    if (document.title.indexOf(this.getPeopleDetail.person.name) < 0) {
      document.title += " " + this.getPeopleDetail.person.name;
    }
  }
}
</script>
<style lang="less">
.main-background {
  max-height: 230px;
  /* Add the blur effect */
  > .v-image__image--cover {
    filter: blur(8px);
    -webkit-filter: blur(8px);
  }

  .main-back {
    background: rgba(0, 0, 0, 0.4);
    background: -moz-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.8) 9%,
      rgba(0, 0, 0, 0.17) 100%
    );
    background: -webkit-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.8) 9%,
      rgba(0, 0, 0, 0.17) 100%
    );
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.8) 9%,
      rgba(0, 0, 0, 0.17) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#000000",GradientType=1);
  }
  .text-info-header {
    text-align: right;
    .v-list-item__title,
    .v-list-item__subtitle {
      white-space: break-spaces;
    }
  }
  @media (max-width: 580px) {
    max-height: 100%;

    .picture-info-header {
      text-align: center;
    }
    .text-info-header {
      text-align: center;
      margin-bottom: 20px;
      .name-title,
      .name-headline {
        font-size: 1.2em !important;
      }
    }
  }
  @media (max-width: 360px) {
    .text-info-header {
      .v-list-item__subtitle {
        white-space: break-spaces;
      }
      .name-title,
      .name-headline {
        font-size: 0.9em !important;
      }
    }
  }
}
</style>
