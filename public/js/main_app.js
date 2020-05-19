Vue.component('nodo_pos', {
    props: ['ip', 'mac', 'nombre'],
    template: `
    <div class="grid-y grid-margin-y nodo_tablet">
        <i class="fas fa-tablet-alt fa-7x text-center large-6 cell"></i>
        <h5 class="large-2 cell">nombre: {{ nombre }}</h5>
        <h5 class="large-2 cell">ip: {{ ip }}</h5>
        <h5 class="large-2 cell">mac: {{ mac }}</h5>
    </div>
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