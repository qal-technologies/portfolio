import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const signupForm = document.getElementById('signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password.length < 6) {
            alert("Password should be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('User created:', user);
                alert('Account created successfully! Please login.');
                window.location.href = '/html/login.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Signup error:', errorCode, errorMessage);
                alert(`Error creating account: ${errorMessage}`);
            });
    });
}

const authLinksContainer = document.getElementById('auth-links-container');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        if (authLinksContainer) {
            authLinksContainer.innerHTML = `
                <a href="/html/profile.html">PROFILE</a>
                <button id="logout-btn">LOGOUT</button>
            `;
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    signOut(auth).then(() => {
                        alert('You have been logged out.');
                        window.location.href = '/';
                    }).catch((error) => {
                        console.error('Logout error:', error);
                    });
                });
            }
        }
    } else {
        // User is signed out
        if (authLinksContainer) {
            authLinksContainer.innerHTML = `
                <a href="/html/login.html">LOGIN</a>
            `;
        }
    }
});

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('User logged in:', user);
                alert('Login successful!');
                window.location.href = '/'; // Redirect to homepage
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Login error:', errorCode, errorMessage);
                alert(`Error logging in: ${errorMessage}`);
            });
    });
}
