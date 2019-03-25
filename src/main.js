import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import 'babel-polyfill'
import firebaseConfig from './config/firebase'
import firebase from 'firebase'
import 'firebase/firestore'

Vue.config.productionTip = false;

const fbApp = firebase.initializeApp(firebaseConfig);
const db = fbApp.firestore();
db.settings({
    timestampsInSnapshots: true
});
Vue.$db = db;

router.beforeEach((to,from,next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.getIsAuthed) {
            next({ name: 'login' });
        } else {
            next()
        }
    } else {
        next()
    }
});

new Vue({
  router,
  store,
  render: h => h(App),
    created(){
        firebase.auth().onAuthStateChanged(user => {
            this.$store.dispatch('STATE_CHANGED', user)
        });
        this.$store.dispatch('LOAD_NEWS');
    }
}).$mount('#app');


