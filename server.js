// Redirect script for Render.com deployment
// This file exists because Render.com is ignoring render.yaml
// and defaulting to 'node server.js'

const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Render.com이 render.yaml을 무시하고 있습니다.');
console.log('📂 백엔드 디렉토리로 리디렉션 중...');

// Change to backend directory and run the correct start command
process.chdir(path.join(__dirname, 'backend'));

// Check if dist directory exists
const fs = require('fs');
if (!fs.existsSync('dist')) {
    console.log('❌ dist 디렉토리가 없습니다. 빌드를 먼저 실행합니다.');
    
    // Run build first
    const buildProcess = spawn('npm', ['run', 'build'], {
        stdio: 'inherit',
        shell: true
    });
    
    buildProcess.on('close', (code) => {
        if (code === 0) {
            console.log('✅ 빌드 완료. 서버를 시작합니다.');
            startServer();
        } else {
            console.log('❌ 빌드 실패:', code);
            process.exit(1);
        }
    });
} else {
    startServer();
}

function startServer() {
    console.log('🚀 백엔드 서버 시작 중...');
    const serverProcess = spawn('node', ['dist/index.js'], {
        stdio: 'inherit',
        shell: true
    });
    
    serverProcess.on('close', (code) => {
        console.log(`서버가 종료되었습니다. 코드: ${code}`);
        process.exit(code);
    });
}