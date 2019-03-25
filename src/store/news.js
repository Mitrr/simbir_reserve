import Vue from 'vue'

export default {
    state: {
        news:[]
    },
    mutations: {
        SET_NEWS(state, payload){
            state.news = payload;
        },
        ADD_TODO(state,payload){
            state.news.push(payload);
        }
    },
    actions:{
      LOAD_NEWS({commit}){
          Vue.$db.collection('todos').get()
              .then(querySnapshot => {
                  let news = [];
                  querySnapshot.forEach(s => {
                      const data = s.data();
                      let oneNews = {
                          id:s.id,
                          title:data.title,
                          description:data.description,
                          priority:data.priority,
                          planTime:data.planTime,
                          inWorkTime:data.inWorkTime,
                          status:data.status
                      };
                      news.push(oneNews);
                  });
                  commit('SET_NEWS', news);
              })
              .catch(err => console.log(err))
      },
        ADD_TODO({commit},payload){
          Vue.$db.collection('todos').add(payload);
        },
        EDIT_TODO({commit},payload){
          Vue.$db.collection('todos').doc(payload.id).set({
              planTime:payload.planTime,
              inWorkTime:payload.inWorkTime,
              status:payload.status
          },{ merge: true });
            this.$store.dispatch('LOAD_NEWS');
        },
        SET_STATUS({commit},payload){
          Vue.$db.collection('todos').doc(payload.id).set({
              status:payload.status
          },{merge:true});
        }
    },
    getters: {
        getNews:(state) => state.news
    }
}
