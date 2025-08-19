const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'build')));

// SPA 라우팅 지원
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`AHP Decision System running on port ${port}`);
});