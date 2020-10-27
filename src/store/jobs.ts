import Vue from "vue";
import {
  Module,
  VuexModule,
  Getter,
  Mutation,
  Action
} from "types-vue";
import { ActionContext } from "vuex";

import {jobsResults} from "@/interfaces/jobs";

@Module({ namespaced: true })
export default class extends VuexModule {
  _jobs: jobsResults = {} as jobsResults;
  _page?: number = 0;

  @Getter()
  getJobs(): jobsResults {
    return this._jobs;
  }

  @Getter()
  getJobsPage(): number | undefined {
    return this._page;
  }

  @Mutation()
  setJobs(value: any): void {
    this._jobs = value;
  }

  @Mutation()
  setJobsPage(value: number): void {
    this._page = value;
  }

  @Action({ useContext: true })
  async fetchJobs(
    context: ActionContext<any, any>,
    search: string,
    page = 0
  ): Promise<void> {
    const url = `search.torre.co/opportunities/_search/?&page=${page}`;
    try {
      context.commit("setStartProcessing", null, { root: true });
      const { data } = await Vue.http.post(url, { search: search });
      context.commit("setJobs", data);
      context.commit("setJobsPage", page);
    } catch (error) {
      context.commit("setJobs", {} as jobsResults);
      context.commit("setJobsPage", 0);
      // throw error;
      console.log("Error searching jobs: ", error);
    } finally {
      context.commit("setStopProcessing", null, { root: true });
    }
  }
}
