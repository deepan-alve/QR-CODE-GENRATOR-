const input = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const qrImage = document.getElementById('qr-image');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const colorBtn = document.getElementById('color-btn');
const card = document.querySelector('.card');

generateBtn.addEventListener('click', generateQRCode);
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') generateQRCode();
});

function generateQRCode() {
    const inputValue = input.value.trim();
    if (inputValue) {
        loader.style.display = 'block';
        qrImage.classList.remove('visible');
        const qrContainer = document.querySelector('.qr-container');
        qrContainer.classList.remove('expanded');
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inputValue)}`;
        
        qrImage.src = qrCodeUrl;
        qrImage.onload = function() {
            loader.style.display = 'none';
            qrImage.classList.add('visible');
            qrContainer.classList.add('expanded');
            qrImage.classList.add('fade-in');
        };
        qrImage.onerror = function() {
            loader.style.display = 'none';
            alert('Failed to generate QR code. Please try again.');
        };
    } else {
        alert('Please enter a valid URL or text');
    }
}

downloadBtn.addEventListener('click', () => {
    if (qrImage.src) {
        const link = document.createElement('a');
        link.href = qrImage.src;
        link.download = 'qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Generate a QR code first!');
    }
});

shareBtn.addEventListener('click', async () => {
    if (qrImage.src) {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'QR Code',
                    text: 'Check out this QR code!',
                    url: qrImage.src
                });
            } else {
                alert('Web Share API not supported. You can manually share this URL: ' + qrImage.src);
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        alert('Generate a QR code first!');
    }
});

colorBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    colorBtn.querySelector('i').classList.toggle('fa-moon');
    colorBtn.querySelector('i').classList.toggle('fa-sun');
});

// Add hover effect to card
card.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    card.style.transform = `
        perspective(1000px)
        rotateX(${(y - 0.5) * 10}deg)
        rotateY(${(x - 0.5) * 10}deg)
        translateZ(20px)
    `;
});

card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
});
