function handleMenu() {
    const menu = document.querySelector("div.header .menu-tab");

    if (!menu) return;

    menu.addEventListener("click", () => {
        const header = document.querySelector("div.header");
        const check = header.classList.contains("heightDown");

        !check ? [header.classList.add("heightDown"), menu.innerHTML = "X", menu.style.color = "red"] : [header.classList.remove("heightDown"), menu.innerHTML = "=", menu.style.color = "var(--primary)"];
    })
}

window.addEventListener("DOMContentLoaded", () => {
    handleMenu();

    // Price slider logic
    const pagesSlider = document.getElementById('pages');
    if (pagesSlider) {
        const pageCount = document.getElementById('page-count');
        const priceElement = pagesSlider.closest('.service-card').querySelector('.price');
        const initialPrice = parseInt(priceElement.textContent);
        priceElement.textContent = `Starting at $${initialPrice.toFixed(2)}`;

        pagesSlider.addEventListener('input', () => {
            const pages = pagesSlider.value;
            pageCount.textContent = pages;
            const pricePerPage = 19.99;
            const totalPrice = initialPrice + (pricePerPage * (pages));
            priceElement.textContent = `Price: $${totalPrice.toFixed(2)}`;
        });
    }

    // Cart logic
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            const title = card.querySelector('h2').textContent;
            let price;

            if (card.querySelector('#pages')) {
                const pages = card.querySelector('#pages').value;
const normPrice = card.querySelector("p.price");
                const basePrice = normPrice;
                const pricePerPage = 19.99;
                price = basePrice + (pricePerPage * (pages - 1));
                price = price.toFixed(2);
            } else {
                //Extracting the number from the price string
                price = card.querySelector('.price').textContent.replace(/[^0-9.]/g, '');
            }

            const service = {
                title,
                price
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(service);
            localStorage.setItem('cart', JSON.stringify(cart));

            // Save the selected service for the contact form
            localStorage.setItem('selectedService', JSON.stringify(service));

            alert(`${title} has been added to your cart!`);
        });
    });

    // Smooth scrolling for contact buttons
    const scrollButtons = document.querySelectorAll('.scroll-to-contact');
    scrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const service = e.target.dataset.service;
            const selectedService = {
                title: service,
                price: 'N/A'
            };
            localStorage.setItem('selectedService', JSON.stringify(selectedService));

            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Testimonial carousel
    const testimonialContainer = document.querySelector('.testimonial-container');
    if (testimonialContainer) {
        const testimonials = document.querySelectorAll('.testimonial');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;

        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.remove('active');
                if (i === index) {
                    testimonial.classList.add('active');
                }
            });
            const offset = -index * (testimonials[0].offsetWidth + 20); // +20 for margin
            testimonialContainer.style.transform = `translateX(${offset}px)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
            showTestimonial(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
            showTestimonial(currentIndex);
        });

        showTestimonial(0);
    }

    // Dynamic contact links
    function updateContactLinks() {
        const selectedService = JSON.parse(localStorage.getItem('selectedService'));
        if (!selectedService) return;

        const whatsappLink = document.getElementById('contact-whatsapp');
        const emailLink = document.getElementById('contact-email');

        const message = `I'm interested in your ${selectedService.title} service.`;

        if (whatsappLink) {
            whatsappLink.href = `https://wa.me/+2349016561308?text=${encodeURIComponent(message)}`;
        }
        if (emailLink) {
            emailLink.href = `mailto: pascodes.dev@gmail.com?subject=Inquiry about ${selectedService.title}&body=${encodeURIComponent(message)}`;
        }
    }

    // Update contact links when a service is selected
    const ctaButtonsWithService = document.querySelectorAll('.cta-btn[data-service]');
    ctaButtonsWithService.forEach(button => {
        button.addEventListener('click', updateContactLinks);
    });

    const serviceCards = document.querySelectorAll('.service-card .cta-btn');
    serviceCards.forEach(button => {
        button.addEventListener('click', updateContactLinks);
    });

    updateContactLinks();

    // On-scroll animations
    const animatedSections = document.querySelectorAll('.hidden-for-animation');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInBottom');
                entry.target.classList.remove('hidden-for-animation');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    animatedSections.forEach(section => {
        observer.observe(section);
    });
})