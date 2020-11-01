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
            {{ $t("navigation.quickApply") }}
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
        <h1>{{ jobDetail.objective }}</h1>
        <v-card class="mx-auto" flat tile>
          <v-img
            :src="
              jobDetail.attachments &&
              jobDetail.attachments.length > 0 &&
              jobDetail.attachments[0].address
                ? jobDetail.attachments[0].address
                : 'https://cdn.vuetifyjs.com/images/cards/server-room.jpg'
            "
            class="main-background"
          >
            <v-row align="end" class="fill-height main-back ">
              <v-col cols="12" sm="6" class="picture-info-header">
                <v-avatar class="profile ml-2" color="grey" size="200" tile>
                  <v-img
                    v-if="
                      jobDetail.organizations &&
                        jobDetail.organizations.length > 0 &&
                        jobDetail.organizations[0].picture
                    "
                    :src="jobDetail.organizations[0].picture"
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
                      <h1>
                        {{
                          jobDetail.organizations &&
                          jobDetail.organizations.length > 0 &&
                          jobDetail.organizations[0].name
                            ? jobDetail.organizations[0].name
                            : " - "
                        }}
                      </h1>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <h3>{{ getLocation }}</h3>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
          <v-divider></v-divider>
          <v-card-text>
            <h3>
              <span class="text--primary"
                >{{ $t("template.compensation") }}:
              </span>
              <span class="subtitle-1"> {{ getCompensation }} </span>
              -
              <span class="text--primary"> {{ $t("template.deadline") }} </span>
              <span class="subtitle-1">
                {{ jobDetail.deadline | formatDate }}
              </span>
            </h3>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <h3 class="text--primary">{{ $t("template.experiences") }}</h3>
            <v-chip-group column>
              <v-chip
                v-for="skill in jobDetail.strengths"
                v-bind:key="`${skill.code}-${skill.name}`"
                >{{ skill.name }} - {{ skill.experience }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <h3 class="text--primary">{{ $t("template.description") }}</h3>
            <div
              v-for="(value, name, index) in detailedDescription"
              v-bind:key="index"
              class="mt-4"
            >
              <h4>{{ $t(`template.${name}`) }}</h4>
              <p v-for="(v, indexv) in value" v-bind:key="index - indexv">
                - {{ v.content }}
              </p>
            </div>
          </v-card-text>
          <v-card-actions>
            <div class="text-center">
              <v-btn color="blue" dark @click="sheet = !sheet">
                {{ $t("navigation.quickApply") }}
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
                      `https://torre.co/en/jobs/${jobDetail.id}-${jobDetail.slug}`
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
import _GroupBy from "lodash/groupBy";
import helpers from "@/helpers";

@Component({
  components: {
    GoBackBtn
  }
})
export default class Home extends Vue {
  private detailId?: string = "";
  private sheet?: boolean = false;

  @MapGetter()
  getProcessing?: boolean;

  @MapAction()
  stopLoading: any;

  @MapGetter({ namespace: "jobs" })
  getJobsDetail: any | undefined;

  @MapAction({ namespace: "jobs" })
  fetchJobsDetail?: any;

  beforeMount() {
    this.detailId = this.$route.params.id;
    this.fetchJobsDetail(this.detailId);
  }
  mounted() {
    this.stopLoading();
  }

  get getLocation(): string {
    const place = this.jobDetail.place;
    let locations = "";

    if (place) {
      if (place.location && place.location.length > 0) {
        place.location.forEach((element: any) => {
          locations += ` ${element.id}`;
        });
      }
      if (place.anywhere) {
        locations += " | " + this.$t("template.anywhere");
      }
      if (place.remote) {
        locations += " | " + this.$t("template.remote");
      }
    } else {
      locations = " - ";
    }
    return locations;
  }

  get getCompensation(): string {
    const compensation = this.jobDetail.compensation;
    const ret = this.$t("template.toBeDefined").toString();
    let response = "";
    if (compensation) {
      response = helpers.getCompensation(
        compensation,
        this.$t("template." + compensation.periodicity).toString()
      );
    }
    return response === "" ? ret : response;
  }

  get jobDetail() {
    return this.getJobsDetail || {};
  }
  get isProcessing(): boolean {
    return this.getProcessing || false;
  }
  get detailedDescription() {
    const details = this.jobDetail.details;
    return _GroupBy(details, "code");
  }

  // Wills set the new title if we are refreshing the page
  @Watch("getJobsDetail")
  onDataChanged(value: any): void {
    if (document.title.indexOf(this.getJobsDetail.objective) < 0) {
      document.title += " " + this.getJobsDetail.objective;
    }
  }
}
</script>
<style lang="less">
.main-background {
  max-height: 230px;

  .main-back {
    background-color: rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 580px) {
    max-height: 100%;

    .picture-info-header {
      text-align: center;
    }
    .text-info-header {
      text-align: center;
    }
  }
}
</style>
