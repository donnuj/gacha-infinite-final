// Firebase SDK CDN
import "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js";

// Firebase config + init
// firebase.js
const { initializeApp } = firebase;
const { getFirestore } = firebase;
const { getAuth } = firebase;

const firebaseConfig = {
  apiKey: "AIzaSyAGHkjy5MwzQ5b3r7R_tQGl8omWcshB3e0",
  authDomain: "gacha-infinity-final-e9994.firebaseapp.com",
  projectId: "gacha-infinity-final-e9994",
  storageBucket: "gacha-infinity-final-e9994.firebasestorage.app",
  messagingSenderId: "382808654174",
  appId: "1:382808654174:web:ea69a67b28a4dd06814fcf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.db = db;
window.auth = auth;

// Auth logic
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  auth.signInWithEmailAndPassword(email, senha)
    .then(() => {
      document.getElementById("status").innerText = "✅ Login realizado!";
      setTimeout(() => window.location.href = "index.html", 1000);
    })
    .catch(err => {
      document.getElementById("status").innerText = "❌ " + err.message;
    });
}

function registrar() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  auth.createUserWithEmailAndPassword(email, senha)
    .then(() => {
      document.getElementById("status").innerText = "✅ Conta criada!";
      setTimeout(() => window.location.href = "index.html", 1000);
    })
    .catch(err => {
      document.getElementById("status").innerText = "❌ " + err.message;
    });
}

// Redireciona se já estiver logado
auth.onAuthStateChanged(user => {
  if (user) window.location.href = "index.html";
});


// Game logic

const { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } = firebase;

let userId = null;

let jogador = {
  nome: "",
  moedas: 300,
  herois: [],
  grupos: [],
  base: { ferreiro: 1, alquimista: 1, estabulo: 1, dormitorio: 1 },
  treino: null,
  ultimaAtividade: Date.now(),
  missao: null
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    console.log("🟢 Usuário logado:", userId);
    carregarDoFirestore();
  } else {
    console.log("🔴 Usuário não logado");
  }
});

function salvarNome() {
  const nome = document.getElementById("player-name")?.value;
  if (nome && nome.length >= 3) {
    jogador.nome = nome;
    document.getElementById("nome-exibido").innerText = `👤 ${jogador.nome}`;
    salvarNoFirestore();
  }
}

function mudarAba(id) {
  document.querySelectorAll(".aba").forEach(a => a.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

function mostrarMoedas() {
  document.getElementById("moedas").innerText = jogador.moedas;
}

function invocarHeroi() {
  const classes = ["Ferreiro", "Arqueiro", "Curandeiro", "Caçador", "Guarda", "Gladiador", "Mago", "Bruxo"];
  const graduacoes = ["Bronze", "Prata", "Ouro", "Diamante", "Mithril", "Oricalcum"];
  const nomes = ["Kael", "Mira", "Sorin", "Talia", "Bram", "Yara"];
  const chance = Math.random() * 100;
  let grad = 0;
  if (chance > 95) grad = 5;
  else if (chance > 90) grad = 4;
  else if (chance > 75) grad = 3;
  else if (chance > 55) grad = 2;
  else if (chance > 30) grad = 1;

  const novo = {
    id: Date.now(),
    nome: nomes[Math.floor(Math.random() * nomes.length)],
    classe: classes[Math.floor(Math.random() * classes.length)],
    graduacao: graduacoes[grad],
    nivel: 1,
    vida: 100
  };
  jogador.herois.push(novo);
  atualizarHerois();
  salvarNoFirestore();
}

function atualizarHerois() {
  const container = document.getElementById("lista-herois");
  container.innerHTML = jogador.herois.map(h =>
    `<div class='card'>🧙 ${h.nome} - ${h.classe} - ${h.graduacao} - Nível ${h.nivel}</div>`
  ).join("");
}

function criarGrupo() {
  const nome = document.getElementById("nome-grupo").value;
  if (!nome || jogador.herois.length < 5) return alert("Você precisa de pelo menos 5 heróis!");
  const grupo = { nome, membros: jogador.herois.slice(0, 5).map(h => h.id) };
  jogador.grupos.push(grupo);
  atualizarGrupos();
  salvarNoFirestore();
}

function atualizarGrupos() {
  const div = document.getElementById("lista-grupos");
  div.innerHTML = jogador.grupos.map(g => {
    const membros = g.membros.map(id => jogador.herois.find(h => h.id === id));
    return `<div class='card'>📛 ${g.nome}<br>${membros.map(m => m.nome).join(", ")}</div>`;
  }).join("");
}

function iniciarMissao() {
  jogador.missao = { inicio: Date.now(), duracao: 60000 };
  atualizarMissao();
  salvarNoFirestore();
}

function atualizarMissao() {
  const el = document.getElementById("status-missao");
  if (!jogador.missao) return el.innerHTML = "Nenhuma missão em andamento";
  const agora = Date.now();
  const decorrido = agora - jogador.missao.inicio;
  if (decorrido >= jogador.missao.duracao) {
    jogador.moedas += 50;
    jogador.missao = null;
    el.innerHTML = "✅ Missão Concluída! +50 moedas";
    mostrarMoedas();
    salvarNoFirestore();
  } else {
    el.innerHTML = `⌛ Missão em andamento... ${Math.ceil((jogador.missao.duracao - decorrido) / 1000)}s`;
    setTimeout(atualizarMissao, 1000);
  }
}

function combatePvP() {
  const resultado = Math.random() > 0.5 ? "Vitória" : "Derrota";
  document.getElementById("status-arena").innerText = `Resultado: ${resultado}`;
  if (resultado === "Vitória") {
    jogador.moedas += 75;
    mostrarMoedas();
    salvarNoFirestore();
  }
}

function iniciarRaid() {
  document.getElementById("status-raid").innerText = "🐉 Raid em progresso... (simulada)";
  setTimeout(() => {
    jogador.moedas += 100;
    mostrarMoedas();
    document.getElementById("status-raid").innerText = "🔥 Raid Concluída! +100 moedas";
    salvarNoFirestore();
  }, 8000);
}

function comprarPacote(tipo) {
  const custo = tipo === 2 ? 250 : 100;
  if (jogador.moedas < custo) return alert("Moedas insuficientes");
  jogador.moedas -= custo;
  invocarHeroi();
  mostrarMoedas();
}

function melhorarBase(area) {
  if (jogador.moedas < 100) return alert("Moedas insuficientes");
  jogador.base[area]++;
  jogador.moedas -= 100;
  document.getElementById(`${area}-nivel`).innerText = jogador.base[area];
  mostrarMoedas();
  salvarNoFirestore();
}

function treinarHeroi() {
  if (!jogador.herois.length || jogador.treino) return;
  jogador.treino = { id: jogador.herois[0].id, inicio: Date.now(), duracao: 60000 };
  atualizarTreino();
  salvarNoFirestore();
}

function atualizarTreino() {
  const el = document.getElementById("status-treino");
  if (!jogador.treino) return el.innerHTML = "Nenhum herói em treino";
  const agora = Date.now();
  const decorrido = agora - jogador.treino.inicio;
  if (decorrido >= jogador.treino.duracao) {
    const heroi = jogador.herois.find(h => h.id === jogador.treino.id);
    heroi.nivel++;
    jogador.treino = null;
    el.innerHTML = `✅ ${heroi.nome} subiu para nível ${heroi.nivel}`;
    atualizarHerois();
    salvarNoFirestore();
  } else {
    el.innerHTML = `Treinando... ${Math.ceil((jogador.treino.duracao - decorrido)/1000)}s`;
    setTimeout(atualizarTreino, 1000);
  }
}

function carregarRanking() {
  db.collection("ranking").orderBy("moedas", "desc").limit(10).get().then(snapshot => {
    const lista = document.getElementById("ranking-lista");
    lista.innerHTML = snapshot.docs.map(doc => {
      const d = doc.data();
      return `<div class='card'>${d.nome} - 💰 ${d.moedas}</div>`;
    }).join("");
  });
}

function salvarNoFirestore() {
  if (!userId) return;
  db.collection("jogadores").doc(userId).set(jogador);
}

function carregarDoFirestore() {
  db.collection("jogadores").doc(userId).get().then(doc => {
    if (doc.exists) {
      jogador = doc.data();
    }
    mostrarMoedas();
    atualizarHerois();
    atualizarGrupos();
    atualizarMissao();
    atualizarTreino();
  });
}


// Expose functions to global scope for inline HTML event handlers
window.mudarAba = mudarAba;
window.comprarPacote = comprarPacote;
window.criarGrupo = criarGrupo;
window.iniciarMissao = iniciarMissao;
window.combatePvP = combatePvP;
window.iniciarRaid = iniciarRaid;
window.melhorarBase = melhorarBase;
window.treinarHeroi = treinarHeroi;
window.carregarRanking = carregarRanking;
window.salvarNome = salvarNome;
window.invocarHeroi = invocarHeroi;
window.login = login;
window.registrar = registrar;