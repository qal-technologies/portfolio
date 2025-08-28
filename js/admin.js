import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { messaging } from './firebase.js';
import { getToken } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

const ADMIN_UID = "YOUR_ADMIN_UID_HERE"; // Replace with the actual Admin User ID

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.uid !== ADMIN_UID) {
            console.log("Access denied. User is not admin.");
            alert("You are not authorized to view this page.");
            window.location.href = '/';
        }
    } else {
        console.log("Access denied. User not logged in.");
        alert("You must be logged in to view this page.");
        window.location.href = '/html/login.html';
    }
});

const enableNotificationsBtn = document.getElementById('enable-notifications-btn');

if (enableNotificationsBtn) {
    enableNotificationsBtn.addEventListener('click', () => {
        console.log('Requesting permission...');
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');

                // Get the token
                // You need to generate this key in your Firebase project settings
                getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY_FROM_FIREBASE' }).then((currentToken) => {
                    if (currentToken) {
                        // Send the token to your server and update the UI
                        console.log('FCM Token:', currentToken);
                        // You would typically send this token to your server to store it
                        // and use it to send notifications to this specific device.
                        alert('Notifications enabled! Check the console for your FCM token.');
                    } else {
                        // Show permission request UI
                        console.log('No registration token available. Request permission to generate one.');
                        alert('Could not get notification token. Please allow notifications in your browser settings.');
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    alert('An error occurred while enabling notifications. Make sure you have provided a valid VAPID key in js/admin.js and that your Firebase project is configured correctly.');
                });
            } else {
                console.log('Unable to get permission to notify.');
                alert('Notification permission was denied.');
            }
        });
    });
}

import { db } from './firebase.js';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const blogPostForm = document.getElementById('blog-post-form');
const postsTableBody = document.querySelector('#posts-table tbody');
const postIdField = document.getElementById('post-id');

const fetchAndDisplayPosts = async () => {
    if (!postsTableBody) return;
    try {
        const postsRef = collection(db, 'posts');
        const querySnapshot = await getDocs(postsRef);
        postsTableBody.innerHTML = '';
        querySnapshot.forEach(doc => {
            const post = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>
                    <button class="edit-btn" data-id="${doc.id}">Edit</button>
                    <button class="delete-btn" data-id="${doc.id}">Delete</button>
                </td>
            `;
            postsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching posts for admin: ", error);
    }
};

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const postId = postIdField.value;
    const post = {
        title: document.getElementById('post-title').value,
        category: document.getElementById('post-category').value,
        description: document.getElementById('post-description').value,
        content: document.getElementById('post-description').value, // Using description as content for now
        imageUrl: document.getElementById('post-image-url').value,
        tags: document.getElementById('post-tags').value.split(',').map(tag => tag.trim()),
        createdAt: serverTimestamp()
    };

    try {
        if (postId) {
            // Update existing post
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, post);
            alert('Post updated successfully!');
        } else {
            // Create new post
            await addDoc(collection(db, 'posts'), post);
            alert('Post created successfully!');
        }
        blogPostForm.reset();
        postIdField.value = '';
        fetchAndDisplayPosts();
    } catch (error) {
        console.error("Error saving post: ", error);
        alert('Error saving post.');
    }
};

const handleTableClick = async (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const postId = e.target.dataset.id;
        const postRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(postRef);
        if (docSnap.exists()) {
            const post = docSnap.data();
            postIdField.value = docSnap.id;
            document.getElementById('post-title').value = post.title;
            document.getElementById('post-category').value = post.category;
            document.getElementById('post-description').value = post.description || '';
            document.getElementById('post-image-url').value = post.imageUrl || '';
            document.getElementById('post-tags').value = (post.tags || []).join(', ');
            window.scrollTo(0, 0);
        }
    }

    if (e.target.classList.contains('delete-btn')) {
        const postId = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteDoc(doc(db, 'posts', postId));
                alert('Post deleted successfully!');
                fetchAndDisplayPosts();
            } catch (error) {
                console.error("Error deleting post: ", error);
                alert('Error deleting post.');
            }
        }
    }
};

if (blogPostForm) {
    blogPostForm.addEventListener('submit', handleFormSubmit);
}

if (postsTableBody) {
    postsTableBody.addEventListener('click', handleTableClick);
}


// Initial fetch
if(window.location.pathname.endsWith('admin.html')) {
    fetchAndDisplayPosts();
}
