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
          <!-- v-btn text depressed small color="blue" @click="sheet = !sheet">
            {{ $t("navigation.quickApply") }}
            <v-icon>mdi-chevron-right</v-icon>
          </!-->
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
        <v-card class="mx-auto" flat tile>
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
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
          <v-divider></v-divider>
          <v-card-text v-if="peopleDetail.person.summaryOfBio">
            <p>{{ peopleDetail.person.summaryOfBio }}</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <h3 class="text--primary">{{ $t("template.currentSkills") }}</h3>
            <v-chip-group v-if="personSkill && personSkill.length > 0" column>
              <v-chip
                v-for="skill in personSkill"
                v-bind:key="`${skill.code}-${skill.name}`"
                ><v-avatar left class="green"> {{ skill.weight }} </v-avatar
                >{{ skill.name }}</v-chip>
              <v-chip
                color="pink"
                label
                text-color="white"
                v-if="peopleDetail.strengths.length > MAX_SKILL"
                @click="showAllSkills = !showAllSkills"
              >
                {{
                  $t(
                    !showAllSkills
                      ? "template.moreSkills"
                      : "template.lessSkills"
                  )
                }}
                <v-icon right v-if="!showAllSkills">mdi-plus</v-icon>
                <v-icon v-if="showAllSkills" right>mdi-minus</v-icon>
              </v-chip>
              
            </v-chip-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <h3 class="text--primary">{{ $t("template.description") }}</h3>
            <div class="mt-4">
              <h4>{{ $t(`template.${name}`) }}</h4>
              <p>
                -
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
                      `https://torre.co/en/jobs/${peopleDetail.id}-${peopleDetail.slug}`
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
  private showAllSkills?: boolean = false;
  private MAX_SKILL = 5;

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

  get peopleDetail() {
    return this.getPeopleDetail || {};
  }
  get isProcessing(): boolean {
    return this.getProcessing || false;
  }

  get personSkill() {
    if (this.peopleDetail.strengths) {
      if (this.showAllSkills) {
        return this.peopleDetail.strengths || [];
      } else {
        const notAll = this.peopleDetail.strengths.slice(
          0,
          this.peopleDetail.strengths.length > this.MAX_SKILL
            ? this.MAX_SKILL
            : this.peopleDetail.strengths
        );
        return notAll;
      }
    } else {
      return [];
    }
  }
  /*get detailedDescription() {
    const details = this.peopleDetail.details;
    return _GroupBy(details, "code");
  }*/
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
