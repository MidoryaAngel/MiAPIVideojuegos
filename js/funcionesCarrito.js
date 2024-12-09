const appCarrito = Vue.createApp({
    data() {
        return {
            carrito: JSON.parse(localStorage.getItem('carrito')) || []
        };
    },
    methods: {
        calcularTotalItem(item) {
            return item.cantidad * item.precioUnitario;
        },
        eliminarDelCarrito(index) {
            if (this.carrito[index].cantidad > 1) {
                this.carrito[index].cantidad--;
            } else {
                this.carrito.splice(index, 1);
            }
            this.guardarCarrito();
        },
        guardarCarrito() {
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        }
    },
    computed: {
        calcularSubtotal() {
            return this.carrito.reduce((acc, item) => acc + this.calcularTotalItem(item), 0);
        },
        calcularIVA() {
            return this.calcularSubtotal * 0.16;
        },
        calcularTotal() {
            return this.calcularSubtotal + this.calcularIVA;
        }
    },
    watch: {
        carrito: {
            handler() {
                this.guardarCarrito();
            },
            deep: true
        }
    }
});

const carritoApp = appCarrito.mount("#carrito-contenedor");
