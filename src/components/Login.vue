<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md6>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Вход в аккаунт</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-alert :value="error" type="warning">
                            {{error}}
                        </v-alert>
                        <v-form>
                            <v-text-field prepend-icon="person" name="login" label="Login" type="text" required v-model="login"></v-text-field>
                            <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password" required v-model="password"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click.prevent="signin" :disabled="processing || valid">Войти</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {
        name: "Login",
        data(){
            return{
                errFlag:false,
                login:null,
                password:null,
                valid:false,

                passwordRules: [
                    v => !!v || 'Введите пароль',
                    v => (v && v.length>=6) || 'Слишком короткий пароль'
                ],
                emailRules: [
                    v => !!v || 'Введите email',
                    v => /.+@.+/.test(v) || 'Неверный email'
                ]
            }
        },
        computed:{
            error(){
                return this.$store.getters.getError;
            },
            processing(){
                return this.$store.getters.getProcessing;
            },
            isUserAuthed(){
                return this.$store.getters.getIsAuthed;
            }
        },
        watch:{
            isUserAuthed(val){
                if (val===true){
                    this.$router.push('/news');
                    /*this.$router.push({name:'account',params:{userID}});*/
                }
            }
        },
        methods:{
            signin(){
                this.$store.dispatch('SIGNIN',{email:this.login, password:this.password})
            }
        }
    }
</script>

<style scoped>

</style>
