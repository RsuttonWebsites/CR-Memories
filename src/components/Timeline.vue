<template>
  <div class="timeline-body">
    <div class="petals-container" ref="petalsContainerEl"></div>
    <header>
      <h1>Our Unforgettable Year</h1>
      <p>A collection of moments that built our story.</p>
    </header>
    <main id="timeline">
      <div
        v-for="(memory, index) in memories"
        :key="index"
        v-intersect
        :class="['timeline-item', memory.animationClass]"
      >
        <div class="timeline-item-content">
          <p class="timeline-date">{{ memory.date }}</p>
          <p class="timeline-description">{{ memory.description }}</p>
          <img
            v-if="memory.image"
            :src="`/${memory.image}`"
            alt="Memory"
            class="timeline-image"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const memories = ref([]);
const petalsContainerEl = ref(null);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

const vIntersect = {
  mounted: (el) => {
    observer.observe(el);
  },
};

async function loadMemories() {
  try {
    const response = await fetch('/CR-100-Memories/100-memories.csv');
    if (!response.ok) throw new Error('Network response was not ok.');
    
    const csvText = await response.text();
    const animationClasses = ['animate-up', 'animate-left', 'animate-right'];

    const parsedMemories = csvText
      .trim()
      .split('\n')
      .map((line) => {
        const parts = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const imagePath = (parts[2]?.replace(/"/g, '').trim() || '');

        return {
          date: parts[0]?.replace(/"/g, '').trim() || '',
          description: parts[1]?.replace(/"/g, '').trim() || '',
          image: imagePath ? `images/${imagePath}` : '',
          animationClass: animationClasses[Math.floor(Math.random() * animationClasses.length)],
        };
      });

    memories.value = parsedMemories;

  } catch (error) {
    console.error('Error fetching CSV:', error);
  }
}

function createFallingItems() {
  const container = petalsContainerEl.value;
  if (!container) return;
  const numberOfItems = 30;

  for (let i = 0; i < numberOfItems; i++) {
    let item;
    if (Math.random() > 0.3) {
      item = document.createElement('div');
      item.classList.add('petal');
      const size = Math.random() * 8 + 6;
      item.style.width = `${size}px`;
      item.style.height = `${size}px`;
    } else {
      item = document.createElement('div');
      item.classList.add('heart');
      item.innerText = '❤️';
      item.style.fontSize = `${Math.random() * 10 + 12}px`;
    }

    item.style.left = `${Math.random() * 100}vw`;
    const animationDuration = Math.random() * 8 + 7;
    const animationDelay = Math.random() * 10;
    item.style.animationDuration = `${animationDuration}s`;
    item.style.animationDelay = `${animationDelay}s`;
    container.appendChild(item);
  }
}

onMounted(() => {
  loadMemories();
  createFallingItems();
});
</script>

<style scoped>
.timeline-body { font-family: 'Roboto', sans-serif; background-color: #fdf6f6; color: #2c3e50; margin: 0; padding: 20px; overflow-x: hidden; }
header { text-align: center; margin-bottom: 50px; }
header h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #e74c3c; margin: 0; }
header p { font-size: 1rem; color: #7f8c8d; }
#timeline { position: relative; max-width: 900px; margin: 0 auto; }
#timeline::after { content: ''; position: absolute; width: 3px; background-color: #dcdcdc; top: 0; bottom: 0; left: 20px; margin-left: -1.5px; }
.timeline-item { padding: 10px 40px; padding-left: 60px; position: relative; width: 100%; box-sizing: border-box; opacity: 0; transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
.animate-up { transform: translateY(40px); }
.animate-left { transform: translateX(-40px); }
.animate-right { transform: translateX(40px); }
.timeline-item.visible { opacity: 1; transform: none; }
.timeline-item-content { padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); position: relative; }
.timeline-item::before { content: ''; position: absolute; width: 15px; height: 15px; left: 20px; background-color: #ffffff; border: 3px solid #e74c3c; top: 24px; border-radius: 50%; z-index: 1; transform: translateX(-50%); }
.timeline-date { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: bold; color: #e74c3c; margin-bottom: 8px; }
.timeline-description { font-size: 0.95rem; line-height: 1.6; }
.timeline-image { width: 100%; max-width: 100%; border-radius: 6px; margin-top: 15px; }
@media screen and (min-width: 768px) {
  #timeline::after { left: 50%; }
  .timeline-item { width: 50%; padding: 10px 40px; }
  .timeline-item:nth-child(odd) { left: 0; padding-right: 70px; text-align: right; }
  .timeline-item:nth-child(even) { left: 50%; padding-left: 70px; text-align: left; }
  .timeline-item:nth-child(odd).animate-left, .timeline-item:nth-child(odd).animate-right { transform: translateX(-40px); }
  .timeline-item:nth-child(even).animate-left, .timeline-item:nth-child(even).animate-right { transform: translateX(40px); }
  .timeline-item::before { left: 50%; }
  .timeline-item-content::after { content: ""; position: absolute; top: 22px; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; }
  .timeline-item:nth-child(odd) .timeline-item-content::after { right: -10px; border-left: 10px solid #ffffff; }
  .timeline-item:nth-child(even) .timeline-item-content::after { left: -10px; border-right: 10px solid #ffffff; }
}
.petals-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; overflow: hidden; }
.petal, .heart { position: absolute; opacity: 0; animation: fallAndSway linear infinite; }
.petal { background-color: #ffb6c1; border-radius: 50% 0; }
.heart { color: #e74c3c; }
@keyframes fallAndSway {
  0% { transform: translateY(-10vh) translateX(0) rotate(-20deg); opacity: 0.9; }
  100% { transform: translateY(110vh) translateX(10px) rotate(360deg); opacity: 0; }
}
</style>