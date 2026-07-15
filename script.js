// Radios por defecto (Solo se usan si el navegador está vacío)
const defaultRadios = [
    {
        id: "radio1", 
        stationName: "Principal FM",
        streamUrl: "https://radios03.audiostreaming.ar:10438/stream", // URL de prueba abierta
        avatar: "https://i.ibb.co/8M0SBdN/DJ-WILMER.jpg",
        locutorName: "DJ WILMER", 
        locutorImg: "https://i.ibb.co/8M0SBdN/DJ-WILMER.jpg",
        showName: "Mañanas Alegres", 
        showTime: "07:00 - 10:00",
        showImg: "https://i.ibb.co/8M0SBdN/DJ-WILMER.jpg",
        whatsapp: "5190634177",
        socials: { fb: "#", ig: "#", x: "#", tk: "#" }
    }
];

// Cargar radios guardadas o usar las predeterminadas
let radiosDB = JSON.parse(localStorage.getItem("myRadiosDB")) || defaultRadios;

document.addEventListener("DOMContentLoaded", function() {
    
    // Variables del DOM
    const audioPlayer = document.getElementById("audio-player");
    const playBtn = document.getElementById("play-btn");
    const playIcon = document.getElementById("play-icon");
    const loadingSpinner = document.getElementById("loading-spinner");
    const radioListContainer = document.getElementById("radio-list");
    
    let isPlaying = false;
    let currentRadioId = null;

    // RENDERIZAR EL DIRECTORIO
    function renderDirectory() {
        radioListContainer.innerHTML = ""; 
        
        radiosDB.forEach((radio, index) => {
            const radioItem = document.createElement("div");
            radioItem.className = `radio-item ${index === 0 ? 'active' : ''}`;
            radioItem.innerHTML = `
                <img src="${radio.avatar || 'https://via.placeholder.com/150/333/fff?text=R'}" alt="${radio.stationName}" class="radio-avatar">
                <span class="radio-name">${radio.stationName}</span>
            `;
            
            // Clickeo en la radio
            radioItem.addEventListener("click", () => {
                document.querySelectorAll(".radio-item").forEach(el => el.classList.remove("active"));
                radioItem.classList.add("active");
                loadRadioData(radio, true);
            });
            
            radioListContainer.appendChild(radioItem);
        });
        
        // Cargar primera radio al iniciar (sin que suene automáticamente)
        if (radiosDB.length > 0) {
            loadRadioData(radiosDB[0], false); 
        }
    }

    // CARGAR DATOS A LA INTERFAZ
    function loadRadioData(radio, autoPlay = true) {
        currentRadioId = radio.id;
        
        document.getElementById("locutor-name").innerText = radio.locutorName || "Auto DJ";
        document.getElementById("locutor-img").src = radio.locutorImg || "https://via.placeholder.com/60/333/fff?text=DJ";
        document.getElementById("show-name").innerText = radio.showName || "Transmisión en Vivo";
        document.getElementById("show-time").innerText = radio.showTime || "24/7";
        document.getElementById("show-img").src = radio.showImg || "https://via.placeholder.com/400x250/222/fff?text=Estudio";
        
        // Configurar WhatsApp
        document.getElementById("whatsapp-btn").onclick = function() {
            if(radio.whatsapp) window.open(`https://wa.me/${radio.whatsapp}`, '_blank');
            else alert("Esta radio no tiene WhatsApp registrado.");
        };

        // Redes Sociales
        const s = radio.socials || { fb:"#", ig:"#", x:"#", tk:"#" };
        document.getElementById("social-fb").href = s.fb;
        document.getElementById("social-ig").href = s.ig;
        document.getElementById("social-x").href = s.x;
        document.getElementById("social-tk").href = s.tk;
        
        // Cambiar el audio
        audioPlayer.src = radio.streamUrl;
        
        if (autoPlay) playAudio();
        else pauseAudio();
    }

    // REPRODUCTOR
    function playAudio() {
        loadingSpinner.style.display = "block";
        playIcon.style.display = "none";
        
        audioPlayer.play().then(() => {
            loadingSpinner.style.display = "none";
            playIcon.style.display = "inline-block";
            playIcon.classList.replace("fa-play", "fa-pause");
            playIcon.style.marginLeft = "0px";
            isPlaying = true;
        }).catch(err => {
            console.error("Error de audio:", err);
            loadingSpinner.style.display = "none";
            playIcon.style.display = "inline-block";
            isPlaying = false;
        });
    }

    function pauseAudio() {
        audioPlayer.pause();
        playIcon.classList.replace("fa-pause", "fa-play");
        playIcon.style.marginLeft = "5px";
        isPlaying = false;
    }

    playBtn.addEventListener("click", () => isPlaying ? pauseAudio() : playAudio());

    // MENÚ LATERAL
    document.getElementById("open-menu").addEventListener("click", () => document.getElementById("side-menu").classList.add("open"));
    document.getElementById("close-menu").addEventListener("click", () => document.getElementById("side-menu").classList.remove("open"));

    // MODAL PARA AGREGAR RADIOS
    const modal = document.getElementById("add-radio-modal");
    document.getElementById("open-add-modal").addEventListener("click", () => modal.classList.add("show"));
    document.getElementById("close-add-modal").addEventListener("click", () => modal.classList.remove("show"));

    document.getElementById("add-radio-form").addEventListener("submit", function(e) {
        e.preventDefault(); 
        
        const nuevaRadio = {
            id: "radio_" + Date.now(), 
            stationName: document.getElementById("new-name").value,
            streamUrl: document.getElementById("new-url").value,
            avatar: document.getElementById("new-logo").value,
            locutorName: document.getElementById("new-locutor").value,
            whatsapp: document.getElementById("new-wa").value,
            locutorImg: "", showName: "Nueva Emisora", showTime: "En Vivo", showImg: "",
            socials: { fb: "#", ig: "#", x: "#", tk: "#" }
        };

        radiosDB.push(nuevaRadio);
        localStorage.setItem("myRadiosDB", JSON.stringify(radiosDB)); // Guarda en el navegador
        
        renderDirectory();
        
        this.reset();
        modal.classList.remove("show");
    });

    // Iniciar 
    renderDirectory();
});

// Cambiar Tema de colores global
function setTheme(themeName) {
    document.body.className = themeName;
    document.getElementById("side-menu").classList.remove("open");
}