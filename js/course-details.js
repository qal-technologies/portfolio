import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const getCourseIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

const fetchAndDisplayCourse = async (courseId) => {
    const courseSection = document.getElementById('course-details-page');
    if (!courseId) {
        if(courseSection) courseSection.innerHTML = '<h1>Course not found</h1><p>No course ID was provided.</p>';
        return;
    }

    try {
        const courseRef = doc(db, 'courses', courseId);
        const docSnap = await getDoc(courseRef);

        if (docSnap.exists()) {
            const course = docSnap.data();

            document.title = `PasCodes | ${course.title}`;

            if(courseSection) {
                courseSection.innerHTML = `
                    <div class="course-details-header">
                        <h1 class="course-title-full">${course.title}</h1>
                        <p class="course-subtitle">${course.subtitle || ''}</p>
                    </div>

                    <div class="course-details-layout">
                        <div class="course-main-content">
                            <img src="${course.imageUrl}" alt="Course Image" class="course-image-full">

                            <h2>About This Course</h2>
                            <p>${course.longDescription || ''}</p>

                            <h2>What You'll Learn</h2>
                            <ul class="learning-objectives">
                                ${(course.learnings || []).map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="course-sidebar">
                            <div class="course-buy-card">
                                <span class="price">$${course.price}</span>
                                <button class="cta-btn buy-btn-full">Buy Now</button>
                                <div class="course-meta-details">
                                    <p><strong><i class="fas fa-clock"></i> Duration:</strong> ${course.duration} hours</p>
                                    <p><strong><i class="fas fa-layer-group"></i> Skill Level:</strong> ${course.skillLevel || 'All Levels'}</p>
                                    <p><strong><i class="fas fa-language"></i> Language:</strong> ${course.language || 'English'}</p>
                                    <p><strong><i class="fas fa-certificate"></i> Certificate:</strong> ${course.certificate ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                            <div class="instructor-card">
                                <h3>About the Instructor</h3>
                                <div class="instructor-info">
                                    <img src="${(course.instructor && course.instructor.avatar) || 'https://via.placeholder.com/100'}" alt="Instructor" class="instructor-avatar">
                                    <div>
                                        <h4>${(course.instructor && course.instructor.name) || 'Paschal Ngaoka'}</h4>
                                        <p>${(course.instructor && course.instructor.title) || 'Full Stack Developer'}</p>
                                    </div>
                                </div>
                                <p>${(course.instructor && course.instructor.bio) || ''}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            console.log("No such document!");
            if(courseSection) courseSection.innerHTML = '<h1>Course not found</h1><p>The course you are looking for does not exist.</p>';
        }
    } catch (error) {
        console.error("Error fetching course: ", error);
        if(courseSection) courseSection.innerHTML = '<h1>Error</h1><p>There was an error loading the course.</p>';
    }
};

const courseId = getCourseIdFromUrl();
if(window.location.pathname.endsWith('course-details.html')) {
    fetchAndDisplayCourse(courseId);
}
