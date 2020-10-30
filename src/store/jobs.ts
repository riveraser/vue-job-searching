import Vue from "vue";
import { Module, VuexModule, Getter, Mutation, Action } from "types-vue";
import { ActionContext } from "vuex";

import { jobsResultsInterface } from "@/interfaces/jobs";

@Module({ namespaced: true })
export default class extends VuexModule {
  _jobs: jobsResultsInterface = {} as jobsResultsInterface;
  _page?: number = 1;
  _jobsDetail?: any = {};
  _searchText?: string = "";

  @Getter()
  getJobs(): jobsResultsInterface {
    return this._jobs;
  }

  @Getter()
  getJobsDetail(): any {
    return this._jobsDetail;
  }

  @Getter()
  getSearchText(): string {
    return this._searchText!;
  }

  @Getter()
  getPage(): number | undefined {
    return this._page;
  }

  @Mutation()
  setJobs(value: any): void {
    this._jobs = value;
  }

  @Mutation()
  setJobsDetail(value: any): void {
    this._jobsDetail = value;
  }

  @Mutation()
  setPage(value: number): void {
    this._page = value;
  }

  @Mutation()
  setSearchText(value: string): void {
    this._searchText = value;
  }

  @Action({ useContext: true })
  async fetchJobs(
    context: ActionContext<any, any>,
    dataQuery: any
  ): Promise<void> {
    context.commit("setSearchText", dataQuery.search);
    context.commit("setPage", dataQuery.page);

    const url = `https://search.torre.co/opportunities/_search/?currency=USD%24&page=${
      dataQuery.page
    }&periodicity=hourly&lang=${
      dataQuery.language
    }&size=10&aggregate=false&offset=${(dataQuery.page - 1) * 10}`;
    try {
      context.commit("setStartProcessing", null, { root: true });
      const { data } = await Vue.http.post(url, {
        "skill/role": {
          text: dataQuery.search,
          experience: "potential-to-develop"
        }
      });
      context.commit("setJobs", data);
      context.commit("setPage", dataQuery.page);
    } catch (error) {
      context.commit("setJobs", {} as jobsResultsInterface);
      context.commit("setPage", 1);
      // throw error;
      console.log("Error searching jobs: ", error);
    } finally {
      context.commit("setStopProcessing", null, { root: true });
    }
  }

  @Action({ useContext: true })
  async fetchJobsDetail(
    context: ActionContext<any, any>,
    jobId: string
  ): Promise<void> {
    const url = `https://torre.co/api/opportunities/${jobId}`;
    try {
      context.commit("setStartProcessing", null, { root: true });
      const { data } = await Vue.http.get(url);
      context.commit("setJobsDetail", data);
      return data;
    } catch (error) {
      context.commit("setJobsDetail", {});
      // throw error;
      console.log("Error searching jobs: ", error);
      return;
    } finally {
      context.commit("setStopProcessing", null, { root: true });
    }
  }

  @Action({ commit: "setJobSearchText" })
  changeSearchText(value: string): string {
    return value;
  }

  @Action({ commit: "setPage" })
  changePage(value: number): number {
    return value;
  }

  @Action({ useContext: true })
  clearSearch(context: ActionContext<any, any>, value: number): void {
    context.commit("setJobs", {} as jobsResultsInterface);
    context.commit("setSearchText", "");
    context.commit("setPage", 1);
  }
}
