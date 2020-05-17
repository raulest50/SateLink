Vue.component('nodo_pos', {
    props: [],
    template: `
    <i class="fas fa-tablet-alt"></i>
    `,
    methods: {
        Emit_Apagar(){
            console.log("apagar  " + this.estado.name);
            socket.emit('browserApagar', this.estado.name);
        },
        Emit_Prender(){
            console.log("prender  " + this.estado.name);
            socket.emit('browserPrender', this.estado.name);
        }
    },
})



var MiApp = new Vue({
    el: '#app',
    data:{
        chat:'',
        usr_name:''
    },
    created(){
        console.log('vue created');
    },
    mounted(){
        console.log('vue moounted');
    }
});