new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
        rangoDeCura: [5,10],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego=true;
        },
        atacar: function () {
            this.esJugador=true
            let herida= this.calcularHeridas(this.rangoAtaque)
            this.saludMonstruo-=herida
            this.registrarEvento(`El jugador atacó al monstruo por ${herida}%`)
            this.ataqueDelMonstruo();
            this.verificarGanador();

        },

        ataqueEspecial: function () {
            this.esJugador=true
            let herida = this.calcularHeridas(this.rangoAtaqueEspecial)
            this.saludMonstruo-= herida
            this.registrarEvento(`El jugador atacó fuerte al monstruo por ${herida}%`)
            this.ataqueDelMonstruo();
            this.verificarGanador();
        },
        
        curar: function () {
            if(this.saludJugador<100){
                this.esJugador = true
                let cura =  Math.max(Math.floor(Math.random()* this.rangoDeCura[1]) +1 , this.rangoDeCura[0])
                this.registrarEvento(`El jugador se curó un ${(this.saludJugador+cura)<100?cura:(100-this.saludJugador)}%`)
                this.saludJugador+=cura
                if(this.saludJugador>100){
                    this.saludJugador=100
                }

            }
        },
        
        registrarEvento(evento) {
            let turno = {
                text: evento,
                esJugador: this.esJugador
                
            }
            this.turnos.unshift(turno)
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego=false;
            this.saludJugador=100
            this.saludMonstruo=100
            this.turnos.splice(0)
        },
        
        ataqueDelMonstruo: function () {
            this.esJugador=false
            let herida = this.calcularHeridas(this.rangoAtaqueDelMonstruo)
            this.saludJugador -= herida
            this.registrarEvento(`El monstruo contraatacó al jugador por ${herida}%`)
        },
        
        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random()* rango[1]) +1 , rango[0])

        },
        verificarGanador: function () {
            if(this.saludJugador<1){
                this.terminarPartida()
                if(confirm(`Perdiste la partida!!!  Jugar de nuevo?`)){
                    this.empezarPartida()
                }
            }else if(this.saludMonstruo<1){
                this.terminarPartida()
                if(confirm(`Ganaste la partida!!!  Jugar de nuevo?`)){
                    this.empezarPartida()
                }
            }
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});