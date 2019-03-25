import Vue from 'vue'
import Router from 'vue-router'
import News from './components/News'
import Login from './components/Login'
import Logout from './components/Logout'
import NewsDetails from "./components/NewsDetails";

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
        redirect:'/news'
    },
      {
          path: '/news',
          name: 'news',
          component: News,
          meta:{requiresAuth:true}
      },
      {
          path: '/login',
          name: 'login',
          component: Login
      },
      {
          path: '/logout',
          name: 'logout',
          component: Logout
      },
      {
          path: '/news/:id',
          props: true,
          name:'tododetails',
          component: NewsDetails
      }
  ]
})
