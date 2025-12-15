document.addEventListener('DOMContentLoaded', () => {
   
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
   
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        follower.style.transform = `translate3d(${e.clientX - 15}px, ${e.clientY - 15}px, 0)`;
    });

    // FIXED Scramble text effect on hover – safe & performant
    const headings = document.querySelectorAll('.scramble-text');
    const chars = '!<>-_\\/[]{}—=+*^?#________';

    headings.forEach(heading => {
        // Split into lines preserving <br>
        const lines = heading.innerHTML.split('<br>');
        const originalLines = lines.map(line => line.trim());

        // Render as separate spans for easier manipulation
        heading.innerHTML = originalLines.map(line => `<span class="line">${line}</span>`).join('<br>');

        const lineSpans = heading.querySelectorAll('.line');

        heading.addEventListener('mouseenter', () => {
            // Prevent multiple runs if hovering fast
            if (heading.dataset.scrambled === 'true') return;
            heading.dataset.scrambled = 'true';

            let charIndex = 0;
            const totalChars = originalLines.join('').length;

            const interval = setInterval(() => {
                let currentPos = 0;

                lineSpans.forEach((span, i) => {
                    const original = originalLines[i];
                    let newText = '';

                    for (let j = 0; j < original.length; j++) {
                        if (currentPos + j < charIndex) {
                            newText += original[j];
                        } else {
                            newText += chars[Math.floor(Math.random() * chars.length)];
                        }
                    }

                    span.textContent = newText;
                    currentPos += original.length;
                });

                charIndex += 1;

                if (charIndex > totalChars) {
                    // Fully revealed – restore original
                    lineSpans.forEach((span, i) => {
                        span.textContent = originalLines[i];
                    });
                    clearInterval(interval);
                    heading.dataset.scrambled = 'false';
                }
            }, 50); // Smooth & safe speed
        });

        // Optional: reset on mouseleave if you want it to scramble again next hover
        heading.addEventListener('mouseleave', () => {
            heading.dataset.scrambled = 'false';
        });
    });

    // Discord Status
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
   
    const DISCORD_ID = '871420901915234345';

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
    setInterval(fetchDiscordStatus, 60000);

    // FIXED Visitor location – secure HTTPS API
    const locSpan = document.getElementById('visitor-loc');
   
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            locSpan.innerText = data.country_name || data.country || 'Planet Earth';
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
