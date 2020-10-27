import Vue from "vue";
import { Module, VuexModule, Getter, Mutation, Action } from "types-vue";
import { ActionContext } from "vuex";

import { peopleResultsInterface } from "@/interfaces/people";

@Module({ namespaced: true })
export default class extends VuexModule {
  _people: peopleResultsInterface = {} as peopleResultsInterface;
  _page?: number = 0;

  @Getter()
  getPeople(): peopleResultsInterface {
    return this._people;
  }

  @Getter()
  getPeoplePage(): number | undefined {
    return this._page;
  }

  @Mutation()
  setPeople(value: any): void {
    this._people = value;
  }

  @Mutation()
  setPeoplePage(value: number): void {
    this._page = value;
  }

  @Action({ useContext: true })
  async fetchPeople(
    context: ActionContext<any, any>,
    dataQuery: any
  ): Promise<void> {
    const url = `search.torre.co/people/_search/?currency=USD%24&page=${
      dataQuery.page}&periodicity=hourly&lang=${
      dataQuery.language}&size=10&aggregate=false&offset=${
      dataQuery.page * 10}`;
    try {
      context.commit("setStartProcessing", null, { root: true });
      const { data } = await Vue.http.post(url, {
        name: { term: dataQuery.search },
      });
      context.commit("setPeople", data);
      context.commit("setPeoplePage", dataQuery.page);
    } catch (error) {
      context.commit("setPeople", {} as peopleResultsInterface);
      context.commit("setPeoplePage", 0);
      // throw error;
      console.log("Error searching people: ", error);
    } finally {
      context.commit("setStopProcessing", null, { root: true });
    }
  }
}