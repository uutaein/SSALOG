<template>
  <div>
    <v-btn
      tile
      :dark="!isDark"
      class="rounded-t-lg"
      :color="isDark ? ColorSet.Sub : 'blue-grey darken-3'"
      @click="$router.go(-1)"
      >뒤로가기</v-btn
    >
    <v-row justify="center">
      <v-col cols="12" class="pt-0">
        <v-card :dark="isDark" class="CardCss mb-4 pt-7 px-7" elevation="6" :outlined="isDark" tile>
          <img
            v-if="isSolved && pioneer !== nickname"
            class="corner"
            src="@/assets/images/corner/corner_success.png"
            title="이 문제를 푸셨습니다!"
            alt="success"
          />
          <img
            v-if="pioneer === nickname"
            class="corner"
            src="@/assets/images/corner/corner_pioneer.png"
            title="이 문제의 개척자이십니다!"
            alt="you are pioneer"
          />
          <v-card-title class="mb-7">
            <h1>{{ problemNumber }} - {{ problemTitle }}</h1>
          </v-card-title>
          <v-row>
            <v-col cols="4">
              <v-card-text>
                <h3><v-icon>mdi-shovel</v-icon>개척자</h3>
                <h2>
                  <v-avatar>
                    <v-img :src="`${$store.state.ImgURL}${pioneerImg}`"></v-img>
                  </v-avatar>
                  <span
                    style="cursor:pointer;"
                    @click="$router.push({ name: 'SSalogMain', params: { nickname: pioneer } })"
                    >{{ pioneer }}</span
                  >
                </h2>
              </v-card-text>
            </v-col>
            <v-col cols="4">
              <v-card-text>
                <h3><v-icon>mdi-clipboard-check-outline</v-icon>등록된 리뷰</h3>
                <h2>{{ numberOfSolutions }} 개</h2>
              </v-card-text>
            </v-col>
            <v-col cols="4" class="d-flex align-end justify-end">
              <v-card-actions>
                <a
                  target="_blank"
                  v-bind:href="`https://www.acmicpc.net/problem/${problemNumber}`"
                  style="text-decoration: none; "
                  title="클릭시 문제로 이동합니다."
                  >BOJ 로 열기</a
                >
                <v-icon>mdi-launch</v-icon>
              </v-card-actions>
            </v-col>
          </v-row>

          <v-divider class="mx-3"></v-divider>

          <v-row justify="center">
            <v-col cols="6">
              <v-card color="transparent" flat>
                <v-card-title>
                  <h5>언어별 평균스펙</h5>
                </v-card-title>
                <v-card-actions>
                  <v-row no-gutters class="align-center">
                    <v-col cols="2" class="d-flex justify-center">
                      <v-icon
                        class="animate__animated animate__bounce"
                        x-large
                        @click="changeLangIdx(false)"
                        >mdi-chevron-left</v-icon
                      >
                    </v-col>
                    <v-col cols="8">
                      <v-carousel
                        max-height="50vh"
                        hide-delimiters
                        :show-arrows="false"
                        v-model="langIdx"
                      >
                        <v-carousel-item v-for="(language, i) in languages" :key="i">
                          <v-card
                            :dark="isDark"
                            height="100%"
                            class="d-flex flex-column align-center justify-space-around"
                            flat
                            color="transparent"
                            light
                          >
                            <v-card-title>
                              <v-icon x-large>{{ selectedIco }}</v-icon>
                              <h3 class="my-0">{{ selectedLang }}</h3>
                            </v-card-title>
                            <v-card-title v-show="userAvgData.time">
                              <v-icon x-large>mdi-alarm</v-icon>
                              <h2 class="my-0">{{ userAvgData.time }} ms</h2>
                            </v-card-title>
                            <v-card-title v-show="userAvgData.time">
                              <v-icon x-large>mdi-memory</v-icon>
                              <h3 class="my-0">{{ userAvgData.memory }} kb</h3>
                            </v-card-title>
                            <v-card-title v-show="!userAvgData.time">
                              <img
                                :class="{ 'image-to-dark': isDark }"
                                src="@/assets/images/idk.png"
                                alt="idk"
                              />
                            </v-card-title>
                            <v-card-title class="text-center" v-show="!userAvgData.time">
                              <h6>해당언어로 등록된 리뷰가 없습니다.</h6>
                            </v-card-title>
                          </v-card>
                        </v-carousel-item>
                      </v-carousel>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center">
                      <v-icon
                        class="animate__animated animate__bounce"
                        x-large
                        @click="changeLangIdx(true)"
                        >mdi-chevron-right</v-icon
                      >
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="1"></v-col>
            <v-col cols="5">
              <v-card color="transparent" flat class="chart-container" max-width="2000vh">
                <v-card-title>
                  <h5>주요 풀이기법</h5>
                </v-card-title>
                <v-card-text class="mt-15">
                  <DoughNutChart
                    :width="450"
                    :height="400"
                    v-if="doughnutLoaded"
                    v-bind:chart-data="problemData"
                    v-bind:chart-options="chartOptions"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card :dark="isDark" :outlined="isDark" tile class="pa-7" elevation="4">
          <v-card-title>
            <h2>리뷰 목록</h2>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="blue-grey lighten-1" dark v-bind="attrs" v-on="on">
                  {{ selectedLang }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list :dark="isDark">
                <v-list-item
                  v-for="(language, idx) in languages"
                  :key="idx"
                  @click="chageLang(idx)"
                >
                  <v-list-item-title>{{ language.lang }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :loading="SolutionLoading"
              loading-text="풀이를 가져오는 중입니다..."
              :headers="headers"
              :page.sync="SolutionPage"
              hide-default-footer
              :items-per-page="SolutionPerPage"
              :items="solvedLists"
            >
              <template v-slot:item.nickname="{ item }">
                <span
                  style="cursor:pointer"
                  @click="
                    $router.push({
                      name: 'SSalogMain',
                      params: { nickname: item.nickname }
                    })
                  "
                  >{{ item.nickname }}</span
                >
              </template>
              <template v-slot:item.title="{ item }">
                <span
                  style="cursor:pointer"
                  @click="
                    $router.push({
                      name: 'LogDetail',
                      params: { nickname: item.nickname, id: item.scoring }
                    })
                  "
                  >{{ item.title }}</span
                >
              </template>
              <template v-slot:item.time="{ item }">
                <v-chip :color="getColor(item.time, 'time')">{{ item.time }}</v-chip>
              </template>
              <template v-slot:item.memory="{ item }">
                <v-chip :color="getColor(item.memory, 'memory')">{{ item.memory }}</v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import "@/assets/Main.css";
import { mapState } from "vuex";
import DoughNutChart from "../DoughnutChart.vue";

import "animate.css";

export default {
  name: "ProblemDetail",
  components: {
    DoughNutChart
  },
  data() {
    return {
      languages: [
        { lang: "Python", ico: "mdi-language-python" },
        { lang: "Java", ico: "mdi-language-java" },
        { lang: "C++", ico: null },
        { lang: "C", ico: null }
      ],
      pioneer: null,
      pioneerImg: "default.png",
      UserSolved: false,
      problemTitle: null,
      problemNumber: this.$route.params.id,
      numberOfSolutions: null,
      langIdx: 0,
      selectedLang: "Python",
      selectedIco: "mdi-language-python",
      userAvgData: {
        time: null,
        memory: null
      },
      // doughnutchart 관련 옵션
      doughnutLoaded: false,
      problemData: {
        labels: [],
        datasets: [
          {
            label: "문제 키워드",
            backgroundColor: ["#8dffb3", "#8087b5", "#7209b7", "#3a0ca3", "#4361ee"],
            data: []
          }
        ]
      },
      chartOptions: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false
      },
      // table 관련 data
      SolutionLoading: true,
      SolutionPage: 1,
      SolutionPageCount: 1,
      SolutionCount: null,
      SolutionPerPage: 10,
      headers: [
        {
          text: "작성자",
          sortable: false,
          filterable: false,
          value: "nickname"
        },
        { text: "제목", value: "title" },
        { text: "추천", value: "like" },
        { text: "시간(ms)", value: "time" },
        { text: "메모리(kb)", value: "memory" }
      ],
      solvedLists: []
    };
  },
  methods: {
    chageLang(idx) {
      this.selectedLang = this.languages[idx].lang;
    },
    async fetchSolutionNumb() {
      try {
        const { data } = await this.$http.get(
          `${this.$store.state.ServerURL}/newuser/search/detail_page_cnt`,
          {
            params: { problemid: this.problemNumber }
          }
        );
        this.numberOfSolutions = data;
      } catch (e) {
        console.error(e);
      }
    },
    changeLangIdx(flag) {
      if (flag) {
        if (this.langIdx === 3) {
          return;
        }
        this.langIdx += 1;
      } else {
        if (this.langIdx === 0) {
          return;
        }
        this.langIdx -= 1;
      }
      this.selectedLang = this.languages[this.langIdx].lang;
    },
    async fetchAvgData() {
      try {
        const { data } = await this.$http.get(
          `${this.$store.state.ServerURL}/newuser/search/detail_avg`,
          {
            params: {
              language: this.selectedLang,
              problemid: this.problemNumber
            }
          }
        );
        this.userAvgData.time = data.avg_time;
        this.userAvgData.memory = data.avg_memory;
        this.langIdx = this.languages.findIndex(i => i.lang === this.selectedLang);
        this.selectedIco = this.languages[this.langIdx].ico;
      } catch (e) {
        console.error(e);
      }
      this.fetchSolvingData();
    },
    // 풀이 데이터 import
    async fetchSolvingData() {
      try {
        this.SolutionLoading = true;
        const { data } = await axios.get(
          `${this.$store.state.ServerURL}/newuser/search/detail_list`,
          {
            params: {
              direction: "ASC",
              page: this.SolutionPage,
              problemid: this.problemNumber,
              size: 24, // 스크롤페이징은 나중에 할게
              language: this.selectedLang
            }
          }
        );
        this.solvedLists = data.content;
        this.SolutionPageCount = Number(data.totalPages);
        this.SolutionLoading = false;
      } catch (e) {
        console.error(e);
      }
    },
    // 문제 이름 받아오기
    async getProblemName() {
      const { data } = await axios.get(
        `${this.$store.state.ServerURL}/newuser/search/find_problemname/`,
        {
          params: {
            problemid: this.problemNumber
          }
        }
      );
      this.problemTitle = data.problemname;
      this.pioneer = data.starter;
      this.pioneerImg = data.starter_img ? data.starter_img : "default.png";
    },
    // 도넛 데이터 받아오기
    async fetchDoughnutData() {
      const res = await axios.get(`${this.$store.state.ServerURL}/newuser/search/detail_py`, {
        params: {
          problemid: this.$route.params.id,
          count: 5
        }
      });
      // eslint-disable-next-line
      for (const [key, value] of Object.entries(res.data)) {
        this.problemData.labels.push(key);
        this.problemData.datasets[0].data.push(value);
      }
      this.doughnutLoaded = true;
    },
    async fetchIsSolved() {
      if (this.username) {
        try {
          const { data } = await this.$http.get(`${this.ServerURL}/newuser/post/is_solved`, {
            params: {
              username: this.username,
              problemid: this.problemNumber
            }
          });
          if (data) {
            this.UserSolved = true;
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    getColor(content, type) {
      if (type === "time") {
        if (content > 1.5 * this.userAvgData.time) return "pink lighten-3";
        if (content > 1.2 * this.userAvgData.time) return "amber darken-1";
        if (content < 0.7 * this.userAvgData.time) return "green accent-2";
      } else {
        if (content > 1.5 * this.userAvgData.memory) return "pink lighten-3";
        if (content > 1.2 * this.userAvgData.memory) return "amber darken-1";
        if (content < 0.7 * this.userAvgData.memory) return "green accent-2";
      }
      return "transparent";
    }
  },
  mounted() {
    this.getProblemName();
    this.fetchSolutionNumb();
    this.fetchDoughnutData();
    this.fetchAvgData(true);
    this.fetchIsSolved();
  },
  computed: {
    ...mapState(["ServerURL", "username", "nickname", "ServerURL", "ColorSet", "isDark"]),
    isPioneer() {
      return this.nickname && this.pioneer === this.nickname;
    },
    isSolved() {
      return this.nickname && this.UserSolved;
    }
  },
  watch: {
    // eslint-disable-next-line
    SolutionPage: function() {
      this.fetchSolvingData();
    },
    selectedLang() {
      this.fetchAvgData();
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-container {
  flex-grow: 1;
  min-height: 0;

  > div {
    position: relative;
    height: 100%;
  }
}
.corner {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 7rem;
}
</style>
