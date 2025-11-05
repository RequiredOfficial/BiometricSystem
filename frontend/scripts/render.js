const { ipcRenderer } = require('electron');

class BiometryApp {
    constructor() {
        this.videoElement = document.getElementById('videoElement');
        this.canvasElement = document.getElementById('canvasElement');
        this.cameraPlaceholder = document.getElementById('cameraPlaceholder');
        this.toggleCameraBtn = document.getElementById('toggleCamera');
        this.recognitionBtn = document.getElementById('recognitionBtn');
        this.stopCameraBtn = document.getElementById('stopCamera');
        this.cameraStatus = document.querySelector('.cameraStatus');
        this.colorCameraStatus = document.querySelector('.colorCameraStatus');
        this.resultsDiv = document.getElementById('results');
        this.recognitionResults = document.getElementById('recognitionResults');
        
        this.isCameraOn = false;
        this.stream = null;
        
        this.initializeEventListeners();
        this.checkCameraAccess();
    }
    
    initializeEventListeners() {
        this.toggleCameraBtn.addEventListener('click', () => this.toggleCamera());
        this.stopCameraBtn.addEventListener('click', () => this.stopCamera());
        this.recognitionBtn.addEventListener('click', () => this.startRecognition());
    }
    
    async checkCameraAccess() {
        try {
            const result = await ipcRenderer.invoke('get-camera-access');
            if (!result.success) {
                this.showError('Ошибка доступа к камере: ' + result.error);
            }
        } catch (error) {
            console.error('Error checking camera access:', error);
        }
    }
    
    async toggleCamera() {
        if (this.isCameraOn) {
            this.stopCamera();
        } else {
            await this.startCamera();
        }
    }
    
    async startCamera() {
        try {
            // Запрашиваем доступ к камере
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                } 
            });
            
            this.videoElement.srcObject = this.stream;
            this.videoElement.style.display = 'block';
            this.cameraPlaceholder.style.display = 'none';
            
            this.isCameraOn = true;
            this.updateCameraStatus('Камера включена', 'status-ready');
            this.recognitionBtn.disabled = false;
            this.toggleCameraBtn.style.display = 'none';
            this.stopCameraBtn.style.display = 'inline-block';
            
            // Обработка ошибок видеопотока
            this.videoElement.onerror = () => {
                this.showError('Ошибка видеопотока');
                this.stopCamera();
            };
            
        } catch (error) {
            this.showError('Не удалось получить доступ к камере: ' + error.message);
        }
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.videoElement.style.display = 'none';
        this.cameraPlaceholder.style.display = 'block';
        this.isCameraOn = false;
        this.updateCameraStatus('Камера выключена', 'status-off');
        this.recognitionBtn.disabled = true;
        this.toggleCameraBtn.style.display = 'inline-block';
        this.stopCameraBtn.style.display = 'none';
        this.resultsDiv.style.display = 'none';
    }
    
    updateCameraStatus(text, statusClass) {
        this.cameraStatus.textContent = text;
        this.colorCameraStatus.className = 'colorCameraStatus';
        this.colorCameraStatus.classList.add(statusClass.split('-')[1]);
    }
    
    startRecognition() {
        if (!this.isCameraOn) return;
        
        // Здесь будет логика распознавания лиц
        this.simulateRecognition();
    }
    
    simulateRecognition() {
        this.recognitionResults.innerHTML = '<p>Идет распознавание...</p>';
        this.resultsDiv.style.display = 'block';
        
        // Симуляция процесса распознавания
        setTimeout(() => {
            const results = [
                'Лицо обнаружено',
                'Уверенность: 95%',
                'Координаты: x:120, y:80, w:200, h:200'
            ];
            
            this.recognitionResults.innerHTML = results.map(result => 
                `<p>${result}</p>`
            ).join('');
        }, 2000);
    }
    
    showError(message) {
        alert('Ошибка: ' + message);
    }
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new BiometryApp();
});

// Обработка закрытия приложения
window.addEventListener('beforeunload', () => {
    // Останавливаем камеру при закрытии
    if (window.biometryApp && window.biometryApp.stream) {
        window.biometryApp.stream.getTracks().forEach(track => track.stop());
    }
});
