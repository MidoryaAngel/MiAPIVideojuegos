const API_KEY = '2327317471914868835de9f660b171e0';
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}`;

const inst = Vue.createApp({
    data() {
        return {
            juegos: [], // Almacenará los datos de los juegos
            carrito: JSON.parse(localStorage.getItem('carrito')) || [], // Almacenará los juegos en el carrito
            filtros: {
                nombre: '',
                genero: ''
            },
            generos: [],
            categoriaSeleccionada: ''
        };
    },
    methods: {
        cargarJuegos() {
            // Llamada a la API de videojuegos
            axios.get(API_URL)
                .then(response => {
                    this.juegos = response.data.results.map(juego => ({
                        id: juego.id,
                        name: juego.name,
                        genres: juego.genres,
                        released: juego.released,
                        rating: juego.rating,
                        background_image: juego.background_image || 'https://via.placeholder.com/300x300?text=Sin+Imagen',
                        description: 'Descripción no disponible', // Si la API no proporciona descripción
                        showDescription: false, // Inicialmente oculta
                        screenshots: [], // Inicialmente vacío para capturas de pantalla
                        precioUnitario: 250.00, // Precio unitario ficticio
                        cantidad: 0 // Cantidad inicial en el carrito
                    }));

                    // Obtener géneros únicos
                    this.generos = [...new Set(this.juegos.flatMap(juego => juego.genres.map(genre => genre.name)))];
                })
                .catch(error => {
                    console.error("Error al cargar juegos:", error);
                });
        },
        agregarAlCarrito(juego) {
            const itemEnCarrito = this.carrito.find(item => item.id === juego.id);
            if (itemEnCarrito) {
                itemEnCarrito.cantidad++;
            } else {
                this.carrito.push({ ...juego, cantidad: 1 });
            }
            this.guardarCarrito();
            window.location.href = 'carrito.html'; // Redirige a la página del carrito
        },
        guardarCarrito() {
            localStorage.setItem('carrito', JSON.stringify(this.carrito));
        },
        verMas(juego) {
            if (juego.description === 'Descripción no disponible') {
                // Llamada a la API para obtener detalles del juego
                axios.get(`https://api.rawg.io/api/games/${juego.id}?key=${API_KEY}`)
                    .then(response => {
                        juego.description = response.data.description_raw;
                        juego.screenshots = response.data.short_screenshots;
                        localStorage.setItem('juegoDetalle', JSON.stringify(juego));
                        window.location.href = 'descripcion.html'; // Redirige a la página de descripción
                    })
                    .catch(error => {
                        console.error("Error al obtener detalles del juego:", error);
                    });
            } else {
                localStorage.setItem('juegoDetalle', JSON.stringify(juego));
                window.location.href = 'descripcion.html'; // Redirige a la página de descripción
            }
        },
        
    },
    computed: {
        juegosFiltrados() {
            return this.juegos.filter(juego => {
                const nombreMatch = juego.name.toLowerCase().includes(this.filtros.nombre.toLowerCase());
                const generoMatch = juego.genres.some(g => g.name.toLowerCase().includes(this.filtros.genero.toLowerCase()));
                return nombreMatch && generoMatch;
            });// Este método verifica si al menos uno de los elementos de un arreglo cumple una determinada condición
        },
        progressColor() {
            const percentage = (this.juegosFiltrados.length / this.juegos.length) * 100;
            if (percentage <= 33) {
                return 'low';
            } else if (percentage <= 66) {
                return 'medium';
            } else {
                return 'high';
            }
        }
    },
    created() {
        this.cargarJuegos(); // Carga los juegos al iniciar
    },
    watch: {
        'filtros.genero'(nuevoGenero) {
            this.categoriaSeleccionada = nuevoGenero;
        }
    }
});

const app = inst.mount("#contenedor");

// Función para el botón de volver arriba
function volverArriba() {
    document.body.scrollTop = 0; // Para Safari
    document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
}

// Mostrar el botón cuando el usuario se desplaza hacia abajo 20px desde la parte superior del documento
window.onscroll = function () {
    const btnVolverArriba = document.getElementById("btnVolverArriba");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btnVolverArriba.style.display = "block";
    } else {
        btnVolverArriba.style.display = "none";
    }
}
