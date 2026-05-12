# Я слышу / I Hear

Приложение для общения глухих и слабослышащих людей со слышащими.  
App for communication between deaf/hard-of-hearing and hearing people.

## Возможности / Features

- 🎤 Распознавание речи собеседника (30 языков) / Speech recognition (30 languages)
- 🔊 Перевод и озвучка текста / Translation and text-to-speech
- ✏️ Ввод текста вручную / Manual text input
- 📁 Папки быстрых фраз / Quick phrase folders
- 🆘 SOS-сигнал / SOS alert
- 🌙 Тёмная и светлая темы / Dark and light themes

## Запуск / Quick Start

```bash
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173)

## Продакшн / Production

```bash
npm install
npm run build
NODE_ENV=production node server/index.mjs
```

## Структура / Structure

```
src/
  App.tsx                    — точка входа
  AccessibilityAssistant.tsx — основной компонент
server/
  index.mjs                  — Express API (перевод + TTS)
```

## Технологии / Stack

- React 18 + TypeScript + Vite
- Framer Motion
- Express (API proxy для Google Translate / TTS)
- Web Speech API (распознавание речи)
