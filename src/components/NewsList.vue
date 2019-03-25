<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container grid-list-lg>
        <v-layout wrap row>
            <v-flex xs12 sm12 md8 offset-md2>
                <v-container fluid>
                    <v-layout row>
                        <v-flex v-if="view!=='Scrum'">
                            <v-text-field label="Поиск по заголовку" v-model="search"></v-text-field>
                        </v-flex>
                        <v-flex v-if="view!=='Scrum'">
                            <v-select label="Статусы"  v-model="value" :items="categories" attach chips multiple></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex>
                            <v-select label="ВИД"  v-model="view" :items="views" attach chips></v-select>
                        </v-flex>
                        <v-flex v-if="view==='Подробный'">
                            <v-select label="СОРТИРОВКА"  v-model="sorting" :items="sorts" attach chips></v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

            <v-flex xs12 sm12 md10 offset-md1>
                <div v-if="view==='Подробный'">
                    <v-card v-for="news in filteredNews" :key="news.id" class="mb-4">
                        <v-container fill-height fluid>
                            <v-layout fill-height>
                                <v-flex xs12 align-end flexbox dark>
                                    <span class="headline">{{news.title}}</span>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <v-card-title>
                            <div>
                                <span><b>Приоритет:</b> {{news.priority}}</span><br>
                            </div>
                        </v-card-title>
                        <v-card-text>
                            <p><b>Описание:</b> {{news.description}}</p>
                            <p><b>Планируемое время:</b> {{news.planTime}}</p>
                            <p><b>Затраченное время:</b> {{news.inWorkTime}}</p>
                            <p><b>Статус:</b> {{news.status}}</p>
                        </v-card-text>
                        <v-divider light></v-divider>
                        <v-card-actions>
                            <v-btn flat color="orange" :to="'/news/'+news.id">Открыть</v-btn>
                        </v-card-actions>
                    </v-card>
                </div>

                <v-data-table v-if="view==='Краткий'"
                        :headers="headers"
                        :items="filteredNews"
                        class="elevation-1"
                >
                    <template v-slot:items="props">
                        <td @click="openDetails(props.item.id)"><span class="table-link">{{ props.item.title }}</span></td>
                        <!--<td class="text-xs-right">{{ props.item.description }}</td>-->
                        <td class="text-xs-right">{{ props.item.priority }}</td>
                        <td class="text-xs-right">{{ props.item.planTime }}</td>
                        <td class="text-xs-right">{{ props.item.inWorkTime }}</td>
                        <td class="text-xs-right">{{ props.item.status }}</td>
                    </template>
                </v-data-table>
            </v-flex>

            <v-flex v-if="view==='Scrum'" xs12 sm12 md10 offset-md1>
                <ScrumBoard :stages="categories" :blocks="newslist" @update-block="updateBlock">
                    <div v-for="stage in categories" :slot="stage" :key="stage">
                        <h2>
                            {{ stage }}
                        </h2>
                    </div>
                    <div v-for="item in newslist" :slot="item.id" :key="item.id">
                        <div class="item_header">
                            <strong>{{ item.title }}</strong>
                        </div>
                        <div class="item_descriprion">
                            Описание: {{item.description}}
                        </div>
                        <div>
                            Приоритет: {{item.priority}}
                        </div>
                        <div>
                            <v-btn :to="'/news/'+item.id">Подробнее</v-btn>
                        </div>
                    </div>
                </ScrumBoard>
            </v-flex>
        </v-layout>
    </v-container>

</template>

<script>
    import ScrumBoard from '@/components/ScrumBoard';
    import { debounce } from 'lodash';

    export default {
        name: "NewsList",
        components:{
          ScrumBoard
        },
        data(){
            return{
                search:null,
                interval:null,
                view:'Краткий',
                value:[],
                sorting:null,
                categories:['Поступил','В работе','Выполнен'],
                views:['Краткий','Подробный','Scrum'],
                sorts:['По возрастанию приоритета','По уменьшению приоритета','Без сортировки'],
                headers:[
                    {text:'Название',sortable: false},
                    /*{text:'Описание'},*/
                    {text:'Приоритет',value:'priority'},
                    {text:'Планируемое время',sortable: false},
                    {text:'Затраченное время',sortable: false},
                    {text:'Статус',sortable: false},
                ]
            }
        },
        computed:{
            newslist(){
                return this.$store.getters.getNews;
            },
            filteredNews(){
                var newslist = this.newslist;

                if (this.search){
                    newslist = newslist.filter(n => n.title.toLowerCase().indexOf(this.search.toLowerCase()) >=0);
                }

                if (this.value.length){
                    newslist = newslist.filter(n => this.value.filter(v => n.status.indexOf(v)!== -1).length > 0);
                }

                if (this.sorting === 'По возрастанию приоритета'){
                    newslist.sort((a,b) => {
                        if (a.priority > b.priority) return 1;
                        if (a.priority < b.priority) return -1;
                    });
                }
                if (this.sorting === 'По уменьшению приоритета') {
                    newslist.sort((a,b) => {
                        if (a.priority > b.priority) return -1;
                        if (a.priority < b.priority) return 1;
                    });
                }
                return newslist;
            }
        },
        methods:{
            stopRefresh:function () {
                if (this.interval){
                    window.clearInterval(this.interval);
                }
            },

            startRefresh:function () {
                this.stopRefresh();
                this.interval = window.setInterval(() => {
                    this.$store.dispatch('LOAD_NEWS');
                }, 500)

            },

            openDetails: function(id){
                this.$router.push({name:'tododetails',params:{id:id}});
            },

            updateBlock: debounce(function (id, status) {
                let payload = {
                    id:id,
                    status:status
                };
                this.$store.dispatch('SET_STATUS',payload);
            }, 500),
        },
        watch:{
            sorting:function (newVal,oldVal) {
                if (newVal === 'Без сортировки'){
                    this.sorting = null;
                }
            }
        },
        mounted() {
            this.startRefresh();

        },
        beforeDestroy() {
            this.stopRefresh();
        }
    }
</script>

<style lang="scss">
    .item_header{
        padding-left: 10px;
        font-size: 25px;
    }
    .item_descriprion{
        font-size: 18px;
        padding-left: 5px;
        padding-bottom: 10px;
    }
    .table-link{
        cursor: pointer;
        color: #101087;
    }
    @import '../assets/scrum_board';
    $on-hold: #FB7D44;
    $in-progress: #2A92BF;
    $approved: #00B961;
    * {
        box-sizing: border-box;
    }

    .drag-column {
    .drag-column-header > div {
        width: 100%;
    h2 > a {
        float: right;
    }
    }
    .drag-column-footer > div {
        margin-left: 10px;
    a {
        text-decoration: none;
        color: white;
    &:hover {
         text-decoration: underline;
     }
    }
    }
    &-Поступил {
    .drag-column-header,
    .is-moved,
    .drag-options {
        background: $on-hold;
    }
    }
    &-in-progress {
    .drag-column-header,
    .is-moved,
    .drag-options {
        background: $in-progress;
    }
    }
    &-Выполнен {
    .drag-column-header,
    .is-moved,
    .drag-options {
        background: $approved;
    }
    }
    }
    .section {
        padding: 20px;
        text-align: center;
    a {
        color: white;
        text-decoration: none;
        font-weight: 300;
    }
    h4 {
        font-weight: 400;
    a {
        font-weight: 600;
    }
    }
    }
</style>
