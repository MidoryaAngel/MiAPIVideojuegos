const appDescripcion = Vue.createApp({
    data() {
        return {
            juego: JSON.parse(localStorage.getItem('juegoDetalle')) || null
        };
    },
    mounted() {
        if (!this.juego) {
            alert('No hay datos del juego seleccionado');
            window.location.href = 'index.html'; // Redirige a la página principal si no hay datos del juego
        }
    }
});

const descripcionApp = appDescripcion.mount("#descripcion-contenedor");
