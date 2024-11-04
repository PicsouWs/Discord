const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const Database = require('better-sqlite3');

// Express server setup
const server = express();
const PORT = 3000;
const httpServer = server.listen(PORT);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Database setup
const db = new Database('app.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user_id TEXT,
    channel_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('message', (data) => {
    const { content, userId, channelId } = data;
    db.prepare('INSERT INTO messages (content, user_id, channel_id) VALUES (?, ?, ?)')
      .run(content, userId, channelId);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});