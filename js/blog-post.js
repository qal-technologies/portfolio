import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const getPostIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// const fetchAndDisplayPost = async (postId) => {
//     const postSection = document.getElementById('blog-post');
//     if (!postId) {
//         postSection.innerHTML = '<h1>Post not found</h1><p>No post ID was provided in the URL.</p>';
//         return;
//     }

//     try {
//         const postRef = doc(db, 'posts', postId);
//         const docSnap = await getDoc(postRef);

//         if (docSnap.exists()) {
//             const post = docSnap.data();

//             document.title = `PasCodes | ${post.title || 'Blog Post'}`;

//             const date = post.createdAt && post.createdAt.toDate ? post.createdAt.toDate().toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             }) : 'Date not available';

//             const tagsHtml = post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

//             // Using a temporary div to safely parse and manipulate the content
//             const tempDiv = document.createElement('div');
//             tempDiv.innerHTML = post.content || '<p>Content not available.</p>';

//             const postHtml = `
//                 <div class="post-header">
//                     <h1 class="post-title-full">${post.title || 'Untitled Post'}</h1>
//                     <div class="post-meta">
//                         <span>By Paschal Ngaoka</span> | <span>${date}</span>
//                     </div>
//                 </div>
//                 <img src="${post.imageUrl || 'https://via.placeholder.com/800x400'}" alt="Blog Post Image" class="post-image-full">
//                 <div class="post-content-full">
//                     ${tempDiv.innerHTML}
//                 </div>
//                 <div class="post-tags-full">
//                     ${tagsHtml}
//                 </div>
//             `;

//             postSection.innerHTML = postHtml;

//         } else {
//             console.log("No such document!");
//             postSection.innerHTML = '<h1>Post not found</h1><p>The post you are looking for does not exist.</p>';
//         }
//     } catch (error) {
//         console.error("Error fetching post: ", error);
//         postSection.innerHTML = '<h1>Error</h1><p>There was an error loading the post. Make sure your Firebase project is set up correctly.</p>';
//     }
// };

const postId = getPostIdFromUrl();
// fetchAndDisplayPost(postId);
