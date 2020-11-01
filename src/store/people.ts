import Vue from "vue";
import { Module, VuexModule, Getter, Mutation, Action } from "types-vue";
import { ActionContext } from "vuex";

import { peopleResultsInterface } from "@/interfaces/people";

@Module({ namespaced: true })
export default class extends VuexModule {
  _people: peopleResultsInterface = {} as peopleResultsInterface;
  _page?: number = 1;
  _peopleDetail?: any = {};
  _searchText?: string = "";

  @Getter()
  getPeople(): peopleResultsInterface {
    return this._people;
  }

  @Getter()
  getPeopleDetail(): any {
    return this._peopleDetail;
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
  setPeople(value: any): void {
    this._people = value;
  }

  @Mutation()
  setPeopleDetail(value: any): void {
    this._peopleDetail = value;
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
  async fetchPeople(
    context: ActionContext<any, any>,
    dataQuery: any
  ): Promise<void> {
    
    context.commit("setSearchText", dataQuery.search);
    context.commit("setPage", dataQuery.page);

    const url = `https://search.torre.co/people/_search/?currency=USD%24&page=${
      dataQuery.page}&periodicity=hourly&lang=${
      dataQuery.language}&size=10&aggregate=false&offset=${
      (dataQuery.page-1)* 10}`;
    try {
      context.commit("setStartProcessing", null, { root: true });
      const { data } = await Vue.http.post(url, {
        name: { term: dataQuery.search },
      });
      context.commit("setPeople", data);
    } catch (error) {
      context.commit("setPeople", {} as peopleResultsInterface);
      context.commit("setPage", 1);
      // throw error;
      console.log("Error searching people: ", error);
    } finally {
      context.commit("setStopProcessing", null, { root: true });
    }
  }
  @Action({ useContext: true })
  async fetchPeopleDetail(
    context: ActionContext<any, any>,
    userId: any
  ): Promise<void> {

    /*******************
     * 
     *  CORS ERROR, cannot fetch the data so the solution is to have a PHP file if needed: 
     *  const url = `https://sergiorivera.me/vue-search-jobs/getTorreUser.php?user=${userId}`;
     */
    //const url = `https://bio.torre.co/api/bios/${userId}`;
    const url = `https://sergiorivera.me/vue-search-jobs/getTorreUser.php?user=${userId}`;
    try {
      context.commit("setStartProcessing", null, { root: true });
      const { data } = await Vue.http.get(url);
      context.commit("setPeopleDetail", data);
      return data;
    } catch (error) {
      context.commit("setPeopleDetail", {} );
      // throw error;
      console.log("Error searching people: ", error);
      return;
    } finally {
      context.commit("setStopProcessing", null, { root: true });
    }
  }
  @Action({ commit: "setSearchText" })
  changeSearchText(value: string): string {
    return value;
  }

  @Action({ commit: "setPage" })
  changePage(value: number): number {
    return value;
  }

  @Action({ useContext: true })
  clearSearch(context: ActionContext<any, any>, value: number): void {
    context.commit("setPeople", {} as peopleResultsInterface);
    context.commit("setSearchText", "");
    context.commit("setPage", 1);
  }

}
