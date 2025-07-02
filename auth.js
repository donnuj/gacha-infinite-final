function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  firebase.auth().signInWithEmailAndPassword(email, senha)
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
  firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then(() => {
      document.getElementById("status").innerText = "✅ Conta criada!";
      setTimeout(() => window.location.href = "index.html", 1000);
    })
    .catch(err => {
      document.getElementById("status").innerText = "❌ " + err.message;
    });
}

// Redireciona se já estiver logado
firebase.auth().onAuthStateChanged(user => {
  if (user) window.location.href = "index.html";
});
