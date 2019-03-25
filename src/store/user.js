import firebase from 'firebase'

export default {
    state: {
        user: {
            isAuth:false,
            userId:null
        }
    },
    mutations: {
        setUser(state, payload){
            state.user.isAuth = true;
            state.user.userId = payload;
        },
        unsetUser(state){
            state.user = {
                isAuth:false,
                userId: null
            }
        }
    },
    actions: {
        SIGNIN({commit},payload){
            commit('SET_PROCESSING',true);
            commit('CLEAR_ERROR');
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    commit('SET_PROCESSING',false);
                    /*commit('setUser',user.uid);*/
                })
                .catch(function(error) {
                    commit('SET_PROCESSING',false);
                    let errMsg = error.message;
                    if (errMsg === 'The email address is badly formatted.') {
                        commit('SET_ERROR', 'Не верный формат email');
                    }else commit('SET_ERROR',errMsg);
            });
        },
        STATE_CHANGED({commit},payload){
            if (payload){
                commit('setUser', payload.uid);
            }else {
                commit('unsetUser');
            }
        },
        LOGOUT(){
            firebase.auth().signOut();
        }
    },
    getters:{
        getIsAuthed: (state) => state.user.isAuth,
        getUserID: (state) => state.user.userId
    }
}
