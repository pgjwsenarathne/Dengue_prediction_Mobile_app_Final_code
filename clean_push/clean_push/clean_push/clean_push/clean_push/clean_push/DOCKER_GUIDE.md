# Docker Commands for Dengue Project

To start the project using Docker on your laptop, use the following commands:

### 1. Start Services in Detached Mode (Background)
This is the command you mentioned (`-d` stands for detached):
```bash
docker-compose up -d
```

### 2. Stop Services
```bash
docker-compose down
```

### 3. Rebuild and Start
If you make changes to the Dockerfile or requirements, use this:
```bash
docker-compose up -d --build
```

### 4. View Running Logs
```bash
docker-compose logs -f
```
