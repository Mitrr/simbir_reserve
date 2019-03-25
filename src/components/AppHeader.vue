<template>
    <div>
        <v-navigation-drawer absolute temporary v-model="drawerFlag" class="hidden-md-and-up">
            <v-list>
                <v-list-tile v-for="(item,i) in menuItems" :key="i">
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app dark class="primary">
            <v-toolbar-side-icon @click.stop="drawerFlag = !drawerFlag" class="hidden-md-and-up"></v-toolbar-side-icon>
            <router-link to="/news" tag="span" class="logo-link">
                <v-toolbar-title class="headline">
                    <span>i</span>
                    <span class="font-weight-light">TODO</span>
                </v-toolbar-title>
            </router-link>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn v-for="(item,i) in menuItems"
                       flat
                       :key="i"
                       :to="item.route">
                    <v-icon left v-html="item.icon"></v-icon>
                    <span class="font-weight-light">{{item.title}}</span>
                </v-btn>
                <v-btn flat @click.prevent="logout" v-if="isUserAuthed">
                    <v-icon left>exit_to_app</v-icon>
                    <span class="font-weight-light">Выйти</span>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
    export default {
        name: "AppHeader",
        data(){
            return{
                drawerFlag: false,
            }
        },
        computed: {
            isUserAuthed(){
                return this.$store.getters.getIsAuthed;
            },
            menuItems(){
                return this.isUserAuthed ? [
                    {
                        icon: 'visibility',
                        title: 'Задачи',
                        route: '/news'
                    }
                ] : [
                    {
                        icon: 'input',
                        title: 'Войти',
                        route: '/login'
                    }
                ]
            }
        },
        methods: {
            logout(){
                this.$store.dispatch('LOGOUT');
            }
        }
    }
</script>

<style scoped>
 .logo-link{
     cursor: pointer;
 }
</style>
