const videoElement = document.getElementById('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadLink = document.getElementById('downloadLink');
const status = document.getElementById('status');
let mediaRecorder;
let recordedBlobs = [];

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = stream;
        recordedBlobs = [];
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });

        mediaRecorder.ondataavailable = event => {
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedBlobs, { type: 'video/mp4' });
            const url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.style.display = 'inline-block';
            downloadLink.download = 'interview_response.mp4';
            status.textContent = 'Recording stopped. Click "Download Video" to save.';
            status.style.color = 'blue';
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        };

        mediaRecorder.start();
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        status.textContent = 'Recording in progress...';
        status.style.color = 'green';
    } catch (err) {
        status.textContent = `Error accessing camera/microphone: ${err.message} (Ensure permissions are granted)`;
        status.style.color = 'red';
        console.error('Error:', err);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        startBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
    }
}

startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);