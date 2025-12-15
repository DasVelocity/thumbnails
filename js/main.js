document.addEventListener('DOMContentLoaded', () => {
    
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        follower.style.transform = `translate3d(${e.clientX - 15}px, ${e.clientY - 15}px, 0)`;
    });

    const headings = document.querySelectorAll('.scramble-text');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    headings.forEach(heading => {
        const originalText = heading.innerText;
        heading.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                heading.innerText = heading.innerText.split('')
                    .map((letter, index) => {
                        if(index < iterations) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if(iterations >= originalText.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    });

    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    // REPLACE THIS WITH YOUR ACTUAL DISCORD USER ID
    // Enable "Developer Mode" in Discord -> Right Click Profile -> Copy ID
    const DISCORD_ID = '296023714810658816'; 

    async function fetchDiscordStatus() {
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
            const data = await response.json();
            
            if(data.success) {
                const status = data.data.discord_status;
                
                statusText.innerText = status === 'online' ? 'ONLINE // FAST RESP' : status.toUpperCase();
                
                if(status === 'online') {
                    statusDot.style.background = '#00ff88';
                    statusDot.style.boxShadow = '0 0 10px #00ff88';
                } else if(status === 'dnd') {
                    statusDot.style.background = '#ff0055';
                } else {
                    statusDot.style.background = '#666';
                }
            }
        } catch (e) {
            statusText.innerText = 'OFFLINE';
        }
    }

    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 60000); 

    const locSpan = document.getElementById('visitor-loc');
    
    fetch('http://ip-api.com/json/')
        .then(res => res.json())
        .then(data => {
            locSpan.innerText = data.country;
        })
        .catch(() => {
            locSpan.innerText = 'Planet Earth';
        });

    const catBtn = document.getElementById('cat-btn');
    const catContainer = document.getElementById('cat-container');

    catBtn.addEventListener('click', () => {
        catBtn.innerText = 'Fetching Cuteness...';
        fetch('https://api.thecatapi.com/v1/images/search')
            .then(res => res.json())
            .then(data => {
                catContainer.innerHTML = `<img src="${data[0].url}" alt="Random Cat">`;
                catBtn.innerText = 'Another One';
            });
    });
});