# Todo App - Docker Stack

Eine vollständige Todo-Anwendung mit React Frontend, FastAPI Backend und PostgreSQL Datenbank.

## Technologie-Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Python FastAPI + SQLAlchemy
- **Datenbank**: PostgreSQL 15
- **Container**: Docker + Docker Compose

## Projektstruktur

```
todo-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       └── main.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── index.css
│       └── App.js
└── README.md
```

## Setup und Installation

### Voraussetzungen
- Docker Desktop installiert
- Docker Compose verfügbar

### Schritt-für-Schritt Anleitung

1. **Projekt erstellen**
   ```bash
   mkdir todo-app
   cd todo-app
   ```

2. **Ordnerstruktur erstellen**
   ```bash
   mkdir -p backend/app frontend/src frontend/public
   ```

3. **Alle Dateien erstellen**
   - Kopiere die bereitgestellten Dateien in die entsprechenden Verzeichnisse
   - Stelle sicher, dass alle Dateien an der richtigen Stelle sind

4. **Postcss Config erstellen** (frontend/postcss.config.js)
   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

5. **App starten**
   ```bash
   docker-compose up --build
   ```

## Zugriff auf die Anwendung

Nach dem Start sind folgende Services verfügbar:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Dokumentation**: http://localhost:8000/docs
- **Datenbank**: localhost:5432

## API Endpoints

- `GET /todos` - Alle Todos abrufen
- `POST /todos` - Neues Todo erstellen
- `GET /todos/{id}` - Ein Todo abrufen
- `PUT /todos/{id}` - Todo aktualisieren
- `DELETE /todos/{id}` - Todo löschen

## Entwicklung

### Hot Reload
Beide Container (Frontend und Backend) sind für Entwicklung konfiguriert:
- Frontend: React Development Server mit Hot Reload
- Backend: Uvicorn mit --reload Flag

### Logs anzeigen
```bash
docker-compose logs -f
```

### Einzelne Services neustarten
```bash
docker-compose restart frontend
docker-compose restart backend
```

### Container stoppen
```bash
docker-compose down
```

### Datenbank zurücksetzen
```bash
docker-compose down -v
docker-compose up --build
```

## Datenbank

Die PostgreSQL Datenbank verwendet ein Docker Volume für Datenpersistenz:
- Volume Name: `postgres_data`
- Credentials: siehe docker-compose.yml

## Troubleshooting

### Port bereits belegt
Falls Ports bereits belegt sind, ändere sie in der docker-compose.yml:
```yaml
ports:
  - "3001:3000"  # Frontend
  - "8001:8000"  # Backend
```

### Backend verbindet nicht zur DB
Warte bis der Health Check erfolgreich ist. Der Backend-Container startet automatisch nach der Datenbank.

### Frontend kann Backend nicht erreichen
Stelle sicher, dass die REACT_APP_API_URL korrekt gesetzt ist in docker-compose.yml.

## Features

- ✅ CRUD Operationen für Todos
- ✅ Persistente Datenspeicherung in PostgreSQL
- ✅ Responsive Design mit Tailwind CSS
- ✅ Todo als erledigt markieren
- ✅ Beschreibung für Todos (optional)
- ✅ Statistiken (erledigte vs. offene Todos)
- ✅ Moderne UI mit Animationen

## Nächste Schritte

Mögliche Erweiterungen:
- Benutzer-Authentifizierung
- Kategorien/Tags für Todos
- Fälligkeitsdaten
- Prioritäten
- Filter und Sortierung
- Dark Mode
- Suche