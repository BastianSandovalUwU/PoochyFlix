# Opciones de Almacenamiento - PoochyFlix Backend

## 📊 **Opciones Disponibles**

### 1. **Almacenamiento en Memoria (Por Defecto)**
```bash
STORAGE_TYPE=memory
```

**Características:**
- ✅ **Rápido** - Sin I/O de disco para metadatos
- ✅ **Simple** - No requiere configuración adicional
- ❌ **No persistente** - Se pierden datos al reiniciar
- ❌ **Limitado** - Solo funciona con un servidor

**Ideal para:** Desarrollo, testing, demos

---

### 2. **Almacenamiento en Archivo JSON**
```bash
STORAGE_TYPE=json_file
DATA_FILE=./data/videos.json
```

**Características:**
- ✅ **Persistente** - Los datos se mantienen entre reinicios
- ✅ **Simple** - Un solo archivo JSON
- ✅ **Portable** - Fácil de respaldar y migrar
- ❌ **Limitado** - No escalable para muchos videos
- ❌ **Sin concurrencia** - Problemas con múltiples usuarios

**Ideal para:** Proyectos pequeños, uso personal

---

### 3. **SQLite (Próximamente)**
```bash
STORAGE_TYPE=sqlite
SQLITE_DB_PATH=./data/videos.db
```

**Características:**
- ✅ **SQL completo** - Consultas complejas
- ✅ **Persistente** - Base de datos real
- ✅ **Escalable** - Maneja miles de videos
- ✅ **Concurrencia** - Múltiples usuarios simultáneos
- ❌ **Más complejo** - Requiere conocimientos SQL

**Ideal para:** Aplicaciones medianas, múltiples usuarios

---

### 4. **MongoDB (Próximamente)**
```bash
STORAGE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/netflix-clone
```

**Características:**
- ✅ **NoSQL** - Flexible para metadatos complejos
- ✅ **Escalable** - Maneja grandes volúmenes
- ✅ **Búsqueda avanzada** - Text search, geolocalización
- ❌ **Requiere servidor** - MongoDB debe estar ejecutándose
- ❌ **Más recursos** - Mayor uso de memoria

**Ideal para:** Aplicaciones grandes, metadatos complejos

---

### 5. **PostgreSQL (Próximamente)**
```bash
STORAGE_TYPE=postgresql
POSTGRES_URL=postgresql://user:pass@localhost:5432/netflix_clone
```

**Características:**
- ✅ **SQL robusto** - Transacciones, integridad referencial
- ✅ **Escalable** - Maneja millones de registros
- ✅ **Confiabilidad** - ACID compliance
- ❌ **Complejo** - Requiere administración de BD
- ❌ **Recursos** - Mayor uso de CPU/memoria

**Ideal para:** Aplicaciones empresariales, alta disponibilidad

---

## 🚀 **Configuración Rápida**

### Para Desarrollo (Memoria)
```bash
# .env
STORAGE_TYPE=memory
```

### Para Uso Personal (JSON)
```bash
# .env
STORAGE_TYPE=json_file
DATA_FILE=./data/videos.json
```

### Para Producción (SQLite)
```bash
# .env
STORAGE_TYPE=sqlite
SQLITE_DB_PATH=./data/videos.db
```

---

## 📁 **Estructura de Datos**

### Video Object
```typescript
interface Video {
  id: number;
  title: string;
  filename: string;
  size: number;
  duration: number;
  thumbnail: string | null;
  uploadDate: string;
  path: string;
  description?: string;
  category?: string;
  tags?: string[];
}
```

### JSON File Structure
```json
{
  "videos": [...],
  "lastUpdated": "2024-01-17T09:15:00.000Z",
  "version": "1.0.0"
}
```

---

## 🔧 **Comandos Útiles**

```bash
# Inicializar datos de ejemplo
npm run init-data

# Configurar almacenamiento
npm run setup

# Cambiar tipo de almacenamiento
# Editar .env y reiniciar servidor
```

---

## 🎯 **Recomendaciones**

| Uso | Recomendación | Razón |
|-----|---------------|-------|
| **Desarrollo** | Memoria | Rápido, simple |
| **Demo/Testing** | Memoria | No requiere setup |
| **Uso Personal** | JSON File | Persistente, simple |
| **Proyecto Pequeño** | JSON File | Fácil de mantener |
| **Aplicación Web** | SQLite | Escalable, confiable |
| **Empresa** | PostgreSQL | Robusto, profesional |

---

## 🔄 **Migración Entre Tipos**

1. **Exportar datos actuales**
2. **Cambiar STORAGE_TYPE en .env**
3. **Reiniciar servidor**
4. **Los datos se migran automáticamente**

---

## 📈 **Próximas Implementaciones**

- [ ] SQLite con Sequelize ORM
- [ ] MongoDB con Mongoose
- [ ] PostgreSQL con TypeORM
- [ ] Redis para caché
- [ ] Elasticsearch para búsqueda
- [ ] S3 para almacenamiento de archivos
