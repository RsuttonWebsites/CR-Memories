document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.getElementById('timeline');

    // --- Create Falling Petals & Hearts ---
    const petalsContainer = document.querySelector('.petals-container');
    const numberOfItems = 30;

    for (let i = 0; i < numberOfItems; i++) {
        let item;
        if (Math.random() > 0.3) {
            item = document.createElement('div');
            item.classList.add('petal');
            const size = Math.random() * 8 + 6; // 6px to 14px
            item.style.width = `${size}px`;
            item.style.height = `${size}px`;
            item.style.backgroundColor = i % 2 === 0 ? '#ffb6c1' : '#ffc0cb';
        } else {
            item = document.createElement('div');
            item.classList.add('heart');
            item.innerText = '❤️'; // Or use '♥️'
            item.style.fontSize = `${Math.random() * 10 + 12}px`;
        }
        
        item.style.left = `${Math.random() * 100}vw`;
        
        const animationDuration = Math.random() * 8 + 7; // 7s to 15s duration
        const animationDelay = Math.random() * 10; // 0s to 10s delay
        
        item.style.animationDuration = `${animationDuration}s`;
        item.style.animationDelay = `${animationDelay}s`;
        
        petalsContainer.appendChild(item);
    }


    // --- Load Memories from CSV ---
    fetch('100-memories.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Make sure 100-memories.csv is in the correct folder.');
            }
            return response.text();
        })
        .then(csvText => {
            const memories = parseCSV(csvText);
            memories.forEach(memory => {
                const timelineItem = createTimelineItem(memory);
                timeline.appendChild(timelineItem);
            });
            setupScrollAnimation();
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV:', error);
            timeline.innerHTML = `<p style="color: red; text-align: center;">Could not load memories. Please check the console for errors.</p>`;
        });
        
    // --- Helper Functions ---
    function parseCSV(text) {
        return text.trim().split('\n').map(line => {
            const parts = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
            return {
                date: parts[0]?.replace(/"/g, '') || '',
                description: parts[1]?.replace(/"/g, '') || '',
                image: parts[2]?.replace(/"/g, '') || ''
            };
        });
    }

    function createTimelineItem(memory) {
        const itemDiv = document.createElement('div');
        
        // --- ADDING RANDOM SCROLL ANIMATION ---
        const animations = ['animate-up', 'animate-left', 'animate-right'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        itemDiv.classList.add('timeline-item', randomAnimation);

        let imageHTML = '';
        // More robust check for an image filename
        if (memory.image && memory.image.trim() !== '') {
            imageHTML = `<img src="images/${memory.image.trim()}" alt="Memory" class="timeline-image">`;
        }

        itemDiv.innerHTML = `
            <div class="timeline-item-content">
                <p class="timeline-date">${memory.date}</p>
                <p class="timeline-description">${memory.description}</p>
                ${imageHTML}
            </div>
        `;
        return itemDiv;
    }

    function setupScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        const items = document.querySelectorAll('.timeline-item');
        items.forEach(item => observer.observe(item));
    }
});