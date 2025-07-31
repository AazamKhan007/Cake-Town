import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


    const firebaseConfig = {
  apiKey: "AIzaSyCWXd3I1v7MS2Kl0DsY32TAjrMJiqOQm2c",
  authDomain: "cake-town-1a21a.firebaseapp.com",
  projectId: "cake-town-1a21a",
  storageBucket: "cake-town-1a21a.firebasestorage.app",
  messagingSenderId: "832084965795",
  appId: "1:832084965795:web:dde76a1dd51c99818b0216",
  measurementId: "G-KN3HP5SDNK"
};

let app;
let db;
let auth;
let currentUserId = null;
let currentUserEmail = null;
let currentUserFullName = null;


const isAuthPage =
  window.location.pathname.endsWith('/index.html') ||
  window.location.pathname.endsWith('/Cake-Town/') ||
  window.location.pathname === '/Cake-Town' ||
  window.location.pathname === '/' ||
  window.location.pathname.endsWith('/');


const authScreen = isAuthPage ? document.getElementById('authScreen') : null;
const loginTab = isAuthPage ? document.getElementById('loginTab') : null;
const signupTab = isAuthPage ? document.getElementById('signupTab') : null;
const loginForm = isAuthPage ? document.getElementById('loginForm') : null;
const signupForm = isAuthPage ? document.getElementById('signupForm') : null;
const loginBtn = isAuthPage ? document.getElementById('loginBtn') : null;
const signupBtn = isAuthPage ? document.getElementById('signupBtn') : null;
const googleLoginBtn = isAuthPage ? document.getElementById('googleLoginBtn') : null;
const googleSignupBtn = isAuthPage ? document.getElementById('googleSignupBtn') : null;
const messageBox = isAuthPage ? document.getElementById('messageBox') : null;
const loginSpinner = isAuthPage ? document.getElementById('loginSpinner') : null;
const signupGoogleSpinner = isAuthPage ? document.getElementById('signupGoogleSpinner') : null; 
const loginGoogleSpinner = isAuthPage ? document.getElementById('loginGoogleSpinner') : null;   


if (firebaseConfig.apiKey && typeof firebaseConfig.apiKey === 'string' && firebaseConfig.apiKey.length > 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
} else {
    console.error("Firebase configuration is missing or invalid. Please provide your firebaseConfig object with API Key.");
    
    if (isAuthPage && messageBox) {
        showMessage("Firebase setup incomplete. Check console for details.", 'error');
    }
}


function showMessage(message, type = 'error') {
    if (!messageBox) {
        console.warn("Message box not found for displaying:", message);
        return;
    }
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.classList.remove('hidden');
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 5000); 
}


function showLoading(buttonElement, show) {
    if (!buttonElement) return;
    const spinner = buttonElement.querySelector('.spinner');
    const textSpan = buttonElement.querySelector('span'); 

    if (!spinner || !textSpan) {
        console.warn("Spinner or text span not found for button:", buttonElement);
        return;
    }

    if (show) {
        spinner.classList.remove('hidden');
        textSpan.classList.add('hidden');
        buttonElement.setAttribute('disabled', 'true');
    } else {
        spinner.classList.add('hidden');
        textSpan.classList.remove('hidden');
        buttonElement.removeAttribute('disabled');
    }
}


async function storeUserProfile(uid, email, fullName = '') {
    
    if (!db) {
        console.error("Firestore DB not initialized. Cannot store user profile.");
        return;
    }
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; 
    const userDocRef = doc(db, `artifacts/${appId}/users/${uid}/profiles`, uid);
    try {
        await setDoc(userDocRef, {
            email: email,
            fullName: fullName,
            createdAt: new Date()
        }, { merge: true });
        console.log("User profile stored successfully for:", email);
    } catch (e) {
        console.error("Error storing user profile:", e);
    }
}


if (isAuthPage) {
    
    if (loginTab && signupTab && loginForm && signupForm) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            if (messageBox) messageBox.classList.add('hidden');
        });

        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
            if (messageBox) messageBox.classList.add('hidden');
        });
    }

    
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showMessage('Please enter both email and password.');
                return;
            }

            showLoading(loginBtn, true); 
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                showMessage('Logged in successfully!', 'success');
                
            } catch (error) {
                console.error("Login error:", error.code, error.message);
                let errorMessage = 'Login failed. Please check your credentials.';
                if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address.';
                else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') errorMessage = 'Incorrect email or password.';
                else if (error.code === 'auth/too-many-requests') errorMessage = 'Too many login attempts. Please try again later.';
                showMessage(errorMessage);
            } finally {
                showLoading(loginBtn, false); 
            }
        });
    }

    
    if (signupBtn) {
        signupBtn.addEventListener('click', async () => {
            const fullName = document.getElementById('signupFullName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!fullName || !email || !password || !confirmPassword) {
                showMessage('Please fill in all fields.');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('Passwords do not match.');
                return;
            }
            if (password.length < 6) {
                showMessage('Password should be at least 6 characters.');
                return;
            }

            showLoading(signupBtn, true); 
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await storeUserProfile(userCredential.user.uid, email, fullName);
                showMessage('Account created successfully! Redirecting...', 'success');
                
            } catch (error) {
                console.error("Signup error:", error.code, error.message);
                let errorMessage = 'Signup failed. Please try again.';
                if (error.code === 'auth/email-already-in-use') errorMessage = 'This email is already in use.';
                else if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address.';
                else if (error.code === 'auth/weak-password') errorMessage = 'Password is too weak.';
                showMessage(errorMessage);
            } finally {
                showLoading(signupBtn, false); 
            }
        });
    }

    
    const provider = new GoogleAuthProvider();
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            showLoading(googleLoginBtn, true);
            try {
                googleLoginBtn.disabled = true;
                    const buttonTextSpan = googleLoginBtn.querySelector('span');
                    if (buttonTextSpan) buttonTextSpan.classList.add('hidden');
                    if (loginGoogleSpinner) loginGoogleSpinner.classList.remove('hidden');
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                if (result._tokenResponse && result._tokenResponse.isNewUser) {
                    await storeUserProfile(user.uid, user.email, user.displayName);
                }
                showMessage('Signed in with Google successfully!', 'success');
            } catch (error) {
                console.error("Google sign-in error:", error.code, error.message);
                let errorMessage = 'Google sign-in failed.';
                if (error.code === 'auth/popup-closed-by-user') errorMessage = 'Google sign-in popup closed.';
                else if (error.code === 'auth/cancelled-popup-request') errorMessage = 'Google sign-in request cancelled.';
                showMessage(errorMessage);
            } finally {
                showLoading(googleLoginBtn, false);
            }
        });
    }
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', async () => {
            showLoading(googleSignupBtn, true);
            try {
                 googleSignupBtn.disabled = true;
                    const buttonTextSpan = googleSignupBtn.querySelector('span'); 
                    if (buttonTextSpan) buttonTextSpan.classList.add('hidden'); 
                    if (signupGoogleSpinner) signupGoogleSpinner.classList.remove('hidden'); 
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                if (result._tokenResponse && result._tokenResponse.isNewUser) {
                    await storeUserProfile(user.uid, user.email, user.displayName);
                }
                showMessage('Signed up with Google successfully!', 'success');
            } catch (error) {
                console.error("Google signup error:", error.code, error.message);
                let errorMessage = 'Google sign-up failed.';
                if (error.code === 'auth/popup-closed-by-user') errorMessage = 'Google sign-up popup closed.';
                else if (error.code === 'auth/cancelled-popup-request') errorMessage = 'Google sign-up request cancelled.';
                showMessage(errorMessage);
            } finally {
                showLoading(googleSignupBtn, false);
                 }
        });
    }

    const switchToSignupLink = document.getElementById('switchToSignup');
    const switchToLoginLink = document.getElementById('switchToLogin');

    if (switchToSignupLink && signupTab) {
        switchToSignupLink.addEventListener('click', (e) => { e.preventDefault(); signupTab.click(); });
    }
    if (switchToLoginLink && loginTab) {
        switchToLoginLink.addEventListener('click', (e) => { e.preventDefault(); loginTab.click(); });
    }

} 



if (auth) { 
    onAuthStateChanged(auth, async (user) => {
        console.log("onAuthStateChanged fired. User:", user ? user.uid : "null");

        const loggedInUserPanel = document.getElementById('loggedInUserPanel'); 
        const userDisplayName = document.getElementById('userDisplayName');
        const userEmailDisplay = document.getElementById('userEmailDisplay');
        const userIdDisplay = document.getElementById('userIdDisplay');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginBtnIcon = document.getElementById('login-btn'); 

        if (user) {
            console.log("User is logged in (or anonymous).");
            currentUserId = user.uid;
            currentUserEmail = user.email;

            
            if (!isAuthPage) {
                console.log("On non-auth page (home.html). Setting up login-btn and user panel.");

                
                const oldLoginForm = document.querySelector('.header .login-form:not(#loggedInUserPanel)');
                if (oldLoginForm) {
                    oldLoginForm.classList.remove('active');
                    oldLoginForm.style.display = 'none';
                    console.log("Old login form hidden.");
                }

                
                if (loginBtnIcon && loggedInUserPanel) {
                    console.log("Found loginBtnIcon and loggedInUserPanel. Attaching click handler.");
                    loginBtnIcon.onclick = () => {
                        console.log("User icon (#login-btn) clicked!");
                        loggedInUserPanel.classList.toggle('active'); 
                        
                        if (loggedInUserPanel.classList.contains('active')) {
                            loggedInUserPanel.style.display = 'block'; 
                        } else {
                            loggedInUserPanel.style.display = 'none'; 
                        }
                    };
                } else {
                    console.warn("Could not find loginBtnIcon (#login-btn) or loggedInUserPanel on home.html.");
                }

                
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                const userDocRef = db ? doc(db, `artifacts/${appId}/users/${user.uid}/profiles`, user.uid) : null;

                if (userDocRef) {
                    try {
                        const userDocSnap = await getDoc(userDocRef);
                        let displayFullName = user.displayName || 'User';
                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data();
                            displayFullName = userData.fullName || user.displayName || 'User';
                        }
                        if (userDisplayName) userDisplayName.textContent = `Welcome, ${displayFullName}!`;
                        if (userEmailDisplay) userEmailDisplay.textContent = `Email: ${user.email || 'N/A'}`;
                        if (userIdDisplay) userIdDisplay.textContent = `User ID: ${user.uid}`;
                        console.log("User panel details populated.");
                    } catch (error) {
                        console.error("Error fetching user data for display:", error);
                        if (userDisplayName) userDisplayName.textContent = `Welcome, ${user.displayName || 'User'}!`;
                        if (userEmailDisplay) userEmailDisplay.textContent = `Email: ${user.email || 'N/A'}`;
                        if (userIdDisplay) userIdDisplay.textContent = `User ID: ${user.uid}`;
                    }
                } else {
                    console.warn("Firestore DB not available to fetch user profile, or userDocRef is null.");
                }


                
                if (logoutBtn) {
                    logoutBtn.onclick = async () => {
                        console.log("Logout button clicked.");
                        try {
                            await signOut(auth);
                            console.log('User logged out successfully. Redirecting...');
                            
                        } catch (error) {
                            console.error('Error logging out:', error);
                        }
                    };
                } else {
                    console.warn("Logout button not found.");
                }

                
                
                if (loggedInUserPanel) {
                     loggedInUserPanel.style.display = 'none';
                     loggedInUserPanel.classList.remove('active'); 
                }


            } else {
                
                console.log("On auth page (index.html) and user is logged in. Redirecting to home.html.");
                window.location.href = './home.html';
            }

        } else {
            
            console.log("User is not logged in.");
            currentUserId = null;
            currentUserEmail = null;
            currentUserFullName = null;

            
            if (!isAuthPage) {
                console.log("On non-auth page and user is not logged in. Redirecting to index.html.");
                window.location.href = './index.html';
            } else {
                
                console.log("On auth page (index.html) and user is not logged in. Ensuring auth screen is visible.");
                if (authScreen) authScreen.style.display = 'flex';
            }
        }
    });
} else {
    console.warn("Firebase Auth not initialized. onAuthStateChanged listener will not be attached.");
}



document.addEventListener('DOMContentLoaded', () => {
    
    
    
});
