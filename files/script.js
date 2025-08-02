let audio;
let currentVolume = 0.025;
const maxVolume = 0.1;
let isDragging = false;
let previousVolume = 0.05;

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupSocialLinks();
    updateViewCount();
    initializeAudioPlayer();
});

function initializeAnimations() {
    const card = document.querySelector('.profile-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
        card.style.transition = 'all 1s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);

    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            btn.style.transition = 'all 0.5s ease';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });

    const audioPlayer = document.querySelector('.audio-player');
    audioPlayer.style.opacity = '0';
    audioPlayer.style.transform = 'translateX(-50px)';
    
    setTimeout(() => {
        audioPlayer.style.transition = 'all 1s ease';
        audioPlayer.style.opacity = '1';
        audioPlayer.style.transform = 'translateX(0)';
    }, 800);
}

function setupSocialLinks() {
    const tiktokBtn = document.getElementById('tiktok-btn');
    const discordBtn = document.getElementById('discord-btn');
    const instagramBtn = document.getElementById('instagram-btn');

    tiktokBtn.href = 'https://tiktok.com/@souzaa.xz_';
    tiktokBtn.target = '_blank';
    
    discordBtn.href = 'https://discord.com/invite/Rrk5hguG9F';
    discordBtn.target = '_blank';
    
    instagramBtn.href = 'https://instagram.com/e.souzaaxz_';
    instagramBtn.target = '_blank';
}

function updateViewCount() {
    const viewCountElement = document.getElementById('view-count');
    let viewCount = localStorage.getItem('siteViewCount');
    
    if (!viewCount) {
        viewCount = 1;
    } else {
        const lastVisit = localStorage.getItem('lastVisitTime');
        const currentTime = new Date().getTime();
        const oneHour = 60 * 60 * 1000;
        
        if (!lastVisit || (currentTime - parseInt(lastVisit)) > oneHour) {
            viewCount = parseInt(viewCount) + 1;
        }
    }
    
    localStorage.setItem('siteViewCount', viewCount);
    localStorage.setItem('lastVisitTime', new Date().getTime().toString());
    
    animateNumber(viewCountElement, parseInt(viewCount));
    
    setInterval(() => {
        if (Math.random() < 0.1) {
            viewCount = parseInt(localStorage.getItem('siteViewCount')) + 1;
            localStorage.setItem('siteViewCount', viewCount);
            animateNumber(viewCountElement, viewCount);
        }
    }, 30000);
}

function animateNumber(element, newNumber) {
    const currentNumber = parseInt(element.textContent);
    const increment = (newNumber - currentNumber) / 20;
    let current = currentNumber;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= newNumber) {
            element.textContent = newNumber;
            clearInterval(timer);
        }
    }, 50);
}

function initializeAudioPlayer() {
    audio = document.getElementById('audio');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeHandle = document.getElementById('volume-handle');
    const volumePercentage = document.getElementById('volume-percentage');
    const volumeLowIcon = document.querySelector('.volume-low');
    const volumeHighIcon = document.querySelector('.volume-high');

    audio.volume = currentVolume;
    updateVolumeSlider();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('Music started automatically');
        }).catch(() => {
            console.log('Autoplay blocked, will start on user interaction');
            document.addEventListener('click', () => {
                audio.play();
            }, { once: true });
        });
    }

    volumeLowIcon.addEventListener('click', () => {
        if (currentVolume > 0) {
            previousVolume = currentVolume;
            setVolume(0);
        } else {
            setVolume(previousVolume / maxVolume);
        }
        showPercentage();
        hidePercentageImmediate();
    });

    volumeHighIcon.addEventListener('click', () => {
        setVolume(1);
        showPercentage();
        hidePercentageImmediate();
    });

    volumeSlider.addEventListener('click', (e) => {
        if (!isDragging) {
            const rect = volumeSlider.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            setVolume(percent);
            showPercentage();
            hidePercentageImmediate();
        }
    });

    volumeHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
        showPercentage();
        
        const handleMouseMove = (e) => {
            if (isDragging) {
                const rect = volumeSlider.getBoundingClientRect();
                let percent = (e.clientX - rect.left) / rect.width;
                percent = Math.max(0, Math.min(1, percent));
                setVolumeInstant(percent);
            }
        };

        const handleMouseUp = () => {
            isDragging = false;
            hidePercentageImmediate();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    volumeHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
        showPercentage();
        
        const handleTouchMove = (e) => {
            if (isDragging) {
                const rect = volumeSlider.getBoundingClientRect();
                let percent = (e.touches[0].clientX - rect.left) / rect.width;
                percent = Math.max(0, Math.min(1, percent));
                setVolumeInstant(percent);
            }
        };

        const handleTouchEnd = () => {
            isDragging = false;
            hidePercentageImmediate();
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    });

    volumeSlider.addEventListener('mouseenter', () => {
        if (!isDragging) {
            showPercentage();
        }
    });

    volumeSlider.addEventListener('mouseleave', () => {
        if (!isDragging) {
            hidePercentageImmediate();
        }
    });

    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play();
    });
}

function setVolume(percent) {
    currentVolume = percent * maxVolume;
    audio.volume = currentVolume;
    updateVolumeSlider();
}

function setVolumeInstant(percent) {
    currentVolume = percent * maxVolume;
    audio.volume = currentVolume;
    updateVolumeSliderInstant(percent);
}

function updateVolumeSlider() {
    const volumeHandle = document.getElementById('volume-handle');
    const volumePercentage = document.getElementById('volume-percentage');
    const percentage = (currentVolume / maxVolume) * 100;
    
    volumeHandle.style.left = percentage + '%';
    volumePercentage.textContent = Math.round(percentage) + '%';
}

function updateVolumeSliderInstant(percent) {
    const volumeHandle = document.getElementById('volume-handle');
    const volumePercentage = document.getElementById('volume-percentage');
    const percentage = percent * 100;
    
    volumeHandle.style.left = percentage + '%';
    volumePercentage.textContent = Math.round(percentage) + '%';
}

function showPercentage() {
    const volumePercentage = document.getElementById('volume-percentage');
    volumePercentage.classList.add('show');
}

function hidePercentageImmediate() {
    const volumePercentage = document.getElementById('volume-percentage');
    setTimeout(() => {
        volumePercentage.classList.remove('show');
    }, 100);
}

function createParticles() {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(136, 136, 136, 0.16)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(particle);
    }
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(particleStyle);

setTimeout(createParticles, 1000);