<template>
    <div>
    <v-container grid-list-md v-if="todo" fluid>
        <v-layout wrap>
            <v-flex xs12 sm10 md10 offset-sm1>
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">{{todo.title}}</h3>
                            <div>Описание: {{todo.description}}</div>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <p><b>Статус:</b> <span>{{data.status}}</span></p>
                        <p><b>Приоритет:</b> {{todo.priority}}</p>
                        <p><b>Планируемое время:</b><span>{{data.planTime}}</span></p>
                        <p><b>Затраченное время:</b><span>{{data.inWorkTime}}</span></p>
                    </v-card-text>
                    <v-spacer></v-spacer>
                </v-card>
                <v-bottom-nav :active.sync="bottomNav" :value="true" absolute color="primary" dark>
                    <v-btn color="white" flat value="recent" to='/news' >
                        <span>Назад</span>
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-btn color="white" flat value="nearby" @click="editingDialog = !editingDialog">
                        <span>Редактировать</span>
                        <v-icon>build</v-icon>
                    </v-btn>
                </v-bottom-nav>
            </v-flex>
        </v-layout>
    </v-container>
        <v-dialog v-model="editingDialog" max-width="800px">
            <v-card>
                <v-card-title class="font-weight-bold">Редактирование Задачи</v-card-title>
                <v-card-text>
                    <v-text-field label="Планируемое время" v-model="data.planTime"></v-text-field>
                    <v-text-field label="Затраченное время" v-model="data.inWorkTime"></v-text-field>
                    <v-select label="Статус выполнения"  v-model="data.status" :items="categories" attach chips></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="save">Сохранить</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "NewsDetails",
        data(){
            return{
                bottomNav:'recent',
                editingDialog:false,
                interval:null,
                data:{
                    id: this.$route.params.id,
                    planTime:null,
                    inWorkTime:null,
                    status:null,
                },
                categories:['Выполнен','Поступил','В работе']
            }
        },
        props:{
            'id':{
                type:String,
                required: true
            }
        },
        computed:{
          todo(){
              let todo = this.$store.getters.getNews.find(n => n.id == this.id);
              this.data.planTime = todo.planTime;
              this.data.inWorkTime = todo.inWorkTime;
              this.data.status = todo.status;
              return todo;
          }
        },
        methods:{
            save:function () {
                this.editingDialog = false;
                this.$store.dispatch("EDIT_TODO",this.data);
            }
        }
    }
</script>

<style scoped>
    .font-weight-bold{
        font-size: 30px;
    }
</style>
