document.addEventListener('DOMContentLoaded', () => {
   
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
   
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        follower.style.transform = `translate3d(${e.clientX - 15}px, ${e.clientY - 15}px, 0)`;
    });

    // Scramble text effect on hover
    const headings = document.querySelectorAll('.scramble-text');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
   
    headings.forEach(heading => {
        const originalText = heading.innerHTML; // Use innerHTML to preserve <br>
        heading.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                heading.innerHTML = heading.innerHTML.split('')
                    .map((letter, index) => {
                        if (letter === '<') return '<'; // Skip HTML tags
                        if (index < iterations) {
                            return originalText[index] === ' ' ? '&nbsp;' : originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
               
                if (iterations >= originalText.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    });

    // Discord Status (your requested version)
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
   
    const DISCORD_ID = '871420901915234345'; // Your Discord ID (velocity0505)

    async function fetchDiscordStatus() {
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
            const data = await response.json();
           
            if (data.success) {
                const status = data.data.discord_status;
               
                if (status === 'online') {
                    statusText.innerText = 'I AM ONLINE';
                    statusDot.style.background = '#00ff88';
                    statusDot.style.boxShadow = '0 0 10px #00ff88';
                } else {
                    statusText.innerText = 'OFFLINE';
                    statusDot.style.background = '#666';
                    statusDot.style.boxShadow = 'none';
                }
            } else {
                throw new Error('API error');
            }
        } catch (e) {
            statusText.innerText = 'OFFLINE';
            statusDot.style.background = '#666';
            statusDot.style.boxShadow = 'none';
        }
    }

    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 60000); // Refresh every minute

    // Visitor location
    const locSpan = document.getElementById('visitor-loc');
   
    fetch('http://ip-api.com/json/')
        .then(res => res.json())
        .then(data => {
            locSpan.innerText = data.country || 'Planet Earth';
        })
        .catch(() => {
            locSpan.innerText = 'Planet Earth';
        });

    // Random Cat Button
    const catBtn = document.getElementById('cat-btn');
    const catContainer = document.getElementById('cat-container');
    
    catBtn.addEventListener('click', () => {
        catBtn.innerText = 'Fetching Cuteness...';
        fetch('https://api.thecatapi.com/v1/images/search')
            .then(res => res.json())
            .then(data => {
                catContainer.innerHTML = `<img src="${data[0].url}" alt="Random Cat">`;
                catBtn.innerText = 'Another One';
            })
            .catch(() => {
                catBtn.innerText = 'Try Again';
            });
    });
});
