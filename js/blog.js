import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const postsGrid = document.querySelector('.blog-posts-grid');
const searchInput = document.getElementById('blog-search');
const filterBtns = document.querySelectorAll('.filter-btn');

const displayPosts = (posts) => {
    postsGrid.innerHTML = '';
    if (posts.length === 0) {
        postsGrid.innerHTML = '<p>No posts found.</p>';
        return;
    }
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'blog-post-card';
        postCard.dataset.category = post.category;

        const tagsHtml = post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        postCard.innerHTML = `
            <img src="${post.imageUrl || 'https://via.placeholder.com/400x250'}" alt="Blog Post Image">
            <div class="post-content">
                <h2 class="post-title">${post.title || 'Untitled Post'}</h2>
                <p class="post-description">${post.description || 'No description available.'}</p>
                <div class="post-tags">${tagsHtml}</div>
                <a href="/html/blog-post.html?id=${post.id}" class="read-more-btn">Read More</a>
            </div>
        `;
        postsGrid.appendChild(postCard);
    });
};

const fetchAndDisplayPosts = async (category = 'all', searchTerm = '') => {
    try {
        const postsRef = collection(db, 'posts');
        let postsQuery;

        if (category !== 'all') {
            // Firestore doesn't support array-contains-any for categories in this way.
            // A common workaround is to have a 'categories' array field.
            // For simplicity here, I'll assume a single category string field.
            // The query will be more complex for multiple categories.
            postsQuery = query(postsRef, where('category', '==', category));
        } else {
            postsQuery = query(postsRef);
        }

        const querySnapshot = await getDocs(postsQuery);
        let posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
        });

        if (searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.category.toLowerCase().includes(searchTerm) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        displayPosts(posts);
    } catch (error) {
        console.error("Error fetching posts: ", error);
        postsGrid.innerHTML = '<p>Error loading posts. Make sure your Firebase project is set up correctly and you have a "posts" collection with sample data.</p>';
    }
};

if(filterBtns) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            const searchTerm = searchInput.value;
            fetchAndDisplayPosts(category, searchTerm);
        });
    });
}

if(searchInput) {
    searchInput.addEventListener('input', () => {
        const category = document.querySelector('.filter-btn.active').dataset.category;
        const searchTerm = searchInput.value;
        fetchAndDisplayPosts(category, searchTerm);
    });
}


// Initial fetch on page load
if(window.location.pathname.endsWith('blog.html')) {
    fetchAndDisplayPosts();
}
