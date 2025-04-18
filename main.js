// Load research projects data
function loadProjectsData() {
    fetchData('/api/projects')
        .then(data => {
            if (data && data.success) {
                const projectsList = document.getElementById('projects-list');

                data.data.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `${item.year}-${item.year+1} ${item.title} / ${item.funding_agency || '校內研究計畫'} / ${item.description || ''}`;
                    projectsList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error loading projects data:', error);
            // Set default values in case of error
            const projectsList = document.getElementById('projects-list');
            const defaultProjects = [
                { title: '路徑判斷之室內AI服務型機器人', year: 2024, funding_agency: '校內研究計畫' },
                { title: '基於深度學習之藥袋與血壓量測儀APP設計', year: 2024, funding_agency: '校內研究計畫' },
                { title: '策略棋盤平台期號', year: 2024, funding_agency: '校內研究計畫' },
                { title: '(國合)Design and Development of NX SAAS Application Cloud Services NX SAAS應用雲服務的設計與開發', year: 2022, funding_agency: '科技部' }
            ];

            defaultProjects.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `${item.year}-${item.year+1} ${item.title} / ${item.funding_agency || '校內研究計畫'} / ${item.description || ''}`;
                projectsList.appendChild(li);
            });
        });
}

// Load publications data
function loadPublicationsData() {
    fetchData('/api/publications')
        .then(data => {
            if (data && data.success) {
                const publicationsList = document.getElementById('publications-list');

                data.data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'publication-item';
                    div.dataset.type = item.type;

                    div.innerHTML = `
                        <h3>${item.title}</h3>
                        <p>${item.authors}</p>
                        <p class="pub-meta">${item.venue}, ${item.year}</p>
                        ${item.doi ? `<p><a href="https://doi.org/${item.doi}" target="_blank">DOI: ${item.doi}</a></p>` : ''}
                    `;

                    publicationsList.appendChild(div);
                });
            }
        })
        .catch(error => {
            console.error('Error loading publications data:', error);
            // Set default values in case of error
            const publicationsList = document.getElementById('publications-list');
            const defaultPublications = [
                {
                    title: 'Deep Learning Approaches for Medical Image Analysis',
                    authors: '何文林, 張志豪, 林明德',
                    venue: 'IEEE Transactions on Medical Imaging',
                    year: 2023,
                    type: 'journal'
                },
                {
                    title: 'Efficient Object Detection in Smart City Surveillance',
                    authors: '何文林, 王小明',
                    venue: 'International Conference on Computer Vision (ICCV)',
                    year: 2022,
                    type: 'conference'
                },
                {
                    title: 'Natural Language Processing for Social Media Analysis: A Survey',
                    authors: '何文林, 李大華, 陳小英',
                    venue: 'ACM Computing Surveys',
                    year: 2021,
                    type: 'journal'
                }
            ];

            defaultPublications.forEach(item => {
                const div = document.createElement('div');
                div.className = 'publication-item';
                div.dataset.type = item.type;

                div.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>${item.authors}</p>
                    <p class="pub-meta">${item.venue}, ${item.year}</p>
                `;

                publicationsList.appendChild(div);
            });
        });
}

// Set up publication filters
function setupPublicationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filter = this.dataset.filter;

            // Filter publications
            const publications = document.querySelectorAll('.publication-item');

            publications.forEach(pub => {
                if (filter === 'all' || pub.dataset.type === filter) {
                    pub.style.display = 'block';
                } else {
                    pub.style.display = 'none';
                }
            });
        });
    });
}

// Setup accordion functionality
function setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');

            const content = this.nextElementSibling;
            if (this.classList.contains('active')) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });

        // Set initial state - first one open, others closed
        if (header === accordionHeaders[0]) {
            header.classList.add('active');
            header.nextElementSibling.style.display = 'block';
        } else {
            header.nextElementSibling.style.display = 'none';
        }
    });
}

// Set up smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjusted for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Helper function to fetch data from API
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        throw error;
    }
}document.addEventListener('DOMContentLoaded', function() {
    // Load all data from the API
    loadProfessorData();
    loadEducationData();
    loadExperienceData();
    loadResearchData();
    loadProjectsData();
    loadPublicationsData();
    loadCoursesData();
    loadStudentProjectsData();

    // Set up event listeners
    setupPublicationFilters();
    setupContactForm();
    setupSmoothScrolling();
});

// Load professor's basic information
function loadProfessorData() {
    fetchData('/api/professor')
        .then(data => {
            if (data && data.success) {
                const professor = data.data;

                // Set professor information
                document.getElementById('professor-photo').src = professor.photo_url;
                document.getElementById('professor-name').textContent = professor.name;
                document.getElementById('professor-title').textContent = professor.title;
                document.getElementById('professor-department').textContent = professor.department;
                document.getElementById('professor-email').textContent = professor.email;
                document.getElementById('professor-phone').textContent = professor.phone;
                document.getElementById('professor-office').textContent = professor.office;

                // Set biography
                document.getElementById('biography').innerHTML = professor.biography;

                // Set contact information at the bottom
                document.getElementById('contact-email').textContent = professor.email;
                document.getElementById('contact-phone').textContent = professor.phone;
                document.getElementById('contact-office').textContent = professor.office;
            }
        })
        .catch(error => {
            console.error('Error sending contact form:', error);
            alert('送出訊息時發生錯誤，請稍後再試。');
        });
}

// Set up smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjusted for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Helper function to fetch data from API
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        throw error;
    }
}
console.error('Error loading professor data:', error);
});
}

// Load education data
function loadEducationData() {
    fetchData('/api/education')
        .then(data => {
            if (data && data.success) {
                const educationList = document.getElementById('education-list');

                data.data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.degree}, ${item.institution}, ${item.year}`;
                    educationList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error loading education data:', error);
        });
}

// Load experience data
function loadExperienceData() {
    fetchData('/api/experience')
        .then(data => {
            if (data && data.success) {
                const experienceList = document.getElementById('experience-list');

                data.data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.position}, ${item.organization}, ${item.start_year}${item.end_year ? ' - ' + item.end_year : ' - 現在'}`;
                    experienceList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error loading experience data:', error);
        });
}

// Load research areas data
function loadResearchData() {
    fetchData('/api/research')
        .then(data => {
            if (data && data.success) {
                const researchList = document.getElementById('research-list');

                data.data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.area;
                    researchList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error loading research data:', error);
        });
}

// Load research projects data
function loadProjectsData() {
    fetchData('/api/projects')
        .then(data => {
            if (data && data.success) {
                const projectsList = document.getElementById('projects-list');

                data.data.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${item.title}</strong> (${item.year})<br>
                                    ${item.funding_agency ? '資助單位: ' + item.funding_agency + '<br>' : ''}
                                    ${item.description}`;
                    projectsList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error loading projects data:', error);
        });
}

// Load publications data
function loadPublicationsData() {
    fetchData('/api/publications')
        .then(data => {
            if (data && data.success) {
                const publicationsList = document.getElementById('publications-list');

                data.data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'publication-item';
                    div.dataset.type = item.type;

                    div.innerHTML = `
                        <h3>${item.title}</h3>
                        <p>${item.authors}</p>
                        <p class="pub-meta">${item.venue}, ${item.year}</p>
                        ${item.doi ? `<p><a href="https://doi.org/${item.doi}" target="_blank">DOI: ${item.doi}</a></p>` : ''}
                    `;

                    publicationsList.appendChild(div);
                });
            }
        })
        .catch(error => {
            console.error('Error loading publications data:', error);
        });
}

// Set up publication filters
function setupPublicationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filter = this.dataset.filter;

            // Filter publications
            const publications = document.querySelectorAll('.publication-item');

            publications.forEach(pub => {
                if (filter === 'all' || pub.dataset.type === filter) {
                    pub.style.display = 'block';
                } else {
                    pub.style.display = 'none';
                }
            });
        });
    });
}

// Load courses data
function loadCoursesData() {
    fetchData('/api/courses')
        .then(data => {
            if (data && data.success) {
                const currentCoursesList = document.getElementById('current-courses');
                const pastCoursesList = document.getElementById('past-courses');

                data.data.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="course-name">${item.name}</span>
                                    <span class="course-info">${item.semester}, ${item.schedule}</span>
                                    ${item.description ? '<p>' + item.description + '</p>' : ''}`;

                    if (item.is_current) {
                        currentCoursesList.appendChild(li);
                    } else {
                        pastCoursesList.appendChild(li);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading courses data:', error);
        });
}

// Load student projects data
function loadStudentProjectsData() {
    fetchData('/api/student-projects')
        .then(data => {
            if (data && data.success) {
                const projectsGrid = document.getElementById('student-projects-grid');
                projectsGrid.className = 'student-projects-grid';

                data.data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'student-project';

                    div.innerHTML = `
                        <div class="project-image">
                            <img src="${item.image_url}" alt="${item.title}">
                        </div>
                        <div class="project-info">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <p class="students">${item.students}</p>
                            ${item.url ? `<p><a href="${item.url}" target="_blank">查看更多</a></p>` : ''}
                        </div>
                    `;

                    projectsGrid.appendChild(div);
                });
            }
        })
        .catch(error => {
            console.error('Error loading student projects data:', error);
        });
}

// Set up contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        fetchData('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(data => {
                if (data && data.success) {
                    alert('訊息已成功送出！');
                    contactForm.reset();
                } else {
                    alert('送出訊息時發生錯誤，請稍後再試。');
                }
            })
            .catch(error => {