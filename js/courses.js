import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const coursesGrid = document.querySelector('.courses-grid');
const categoryBtns = document.querySelectorAll('.category-btn');

const displayCourses = (courses) => {
    if (!coursesGrid) return;
    coursesGrid.innerHTML = '';
    if (courses.length === 0) {
        coursesGrid.innerHTML = '<p>No courses found.</p>';
        return;
    }
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.dataset.category = course.category;

        courseCard.innerHTML = `
            <img src="${course.imageUrl || 'https://via.placeholder.com/400x250'}" alt="Course Image">
            <div class="course-content">
                <h2 class="course-title">${course.title || 'Untitled Course'}</h2>
                <p class="course-description">${course.description || 'No description available.'}</p>
                <div class="course-details">
                    <span class="price">$${course.price || 'N/A'}</span>
                    <span class="duration"><i class="far fa-clock"></i> ${course.duration || 0} hours</span>
                </div>
                <a href="/html/course-details.html?id=${course.id}" class="cta-btn buy-btn">View Details</a>
            </div>
        `;
        coursesGrid.appendChild(courseCard);
    });
};

const fetchAndDisplayCourses = async (category = 'all') => {
    try {
        const coursesRef = collection(db, 'courses');
        let coursesQuery;

        if (category !== 'all') {
            coursesQuery = query(coursesRef, where('category', '==', category));
        } else {
            coursesQuery = query(coursesRef);
        }

        const querySnapshot = await getDocs(coursesQuery);
        const courses = [];
        querySnapshot.forEach((doc) => {
            courses.push({ id: doc.id, ...doc.data() });
        });

        displayCourses(courses);
    } catch (error) {
        console.error("Error fetching courses: ", error);
        if (coursesGrid) {
            coursesGrid.innerHTML = '<p>Error loading courses. Make sure your Firebase project is set up correctly and you have a "courses" collection with sample data.</p>';
        }
    }
};

if (categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            fetchAndDisplayCourses(category);
        });
    });
}

// Initial fetch on page load
if(window.location.pathname.endsWith('courses.html')) {
    fetchAndDisplayCourses();
}
