<template>
    <div v-if="show">
        <NewsList></NewsList>
        <v-btn @click="dialog = !dialog" class="fab_btn" fab dark medium bottom right fixed color="light-blue">
            <v-icon dark>add</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-card-title class="font-weight-bold">Добавление Задачи</v-card-title>
                <v-card-text>
                    <v-text-field label="Название" v-model="data.title"></v-text-field>
                    <v-text-field label="Описание" v-model="data.description"></v-text-field>
                    <v-select label="Приоритет"  v-model="data.priority" :items="priorities" attach chips></v-select>
                    <v-text-field label="Планируемое время" v-model="data.planTime"></v-text-field>
                    <v-text-field label="Затраченное время" v-model="data.inWorkTime"></v-text-field>
                    <v-select label="Статус выполнения"  v-model="data.status" :items="categories" attach chips></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit">Сохранить</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import NewsList from './NewsList'
    export default {
        name: "News",
        components:{
            NewsList
        },
        data(){
            return{
                dialog:false,
                categories:['Выполнен','Поступил','В работе'],
                priorities:[1,2,3,4,5,6,7,8,9,10],
                data:{
                    title:null,
                    description:null,
                    priority:null,
                    planTime:null,
                    inWorkTime:null,
                    status:null
                }
            }
        },
        methods:{
            submit(){
                this.dialog = false;
                this.$store.dispatch("ADD_TODO",this.data);
            }
        },
        computed:{
            show(){
                return this.$store.getters.getIsAuthed;
            }
        }
    }
</script>

<style scoped>
 .fab_btn{
     margin-left: 15%;
 }
 .font-weight-bold{
     font-size: 30px;
 }
</style>
