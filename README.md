# Multi-Tenant Restaurant REST API

A simplified multi-tenant Restaurant REST API built with **Node.js** and **MongoDB**. This project demonstrates database design, data isolation between tenants, input validation, and clean architecture.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Validation:** Joi
- **Environment:** dotenv

### Prerequisites

- Node.js >= 16
- MongoDB running locally (or a remote URI)

### Installation

```bash
git clone <repository-url>
cd multi-tenant-restaurant-api
npm install
```

### Configuration

Copy the example env file and adjust values:

```bash
cp .env.example .env
```

| Variable      | Default                                      | Description          |
|---------------|----------------------------------------------|----------------------|
| `PORT`        | `3000`                                       | Server listen port   |
| `MONGODB_URI` | `mongodb://localhost:27017/restaurant_api`   | MongoDB connection   |
| `NODE_ENV`    | `development`                                | Environment mode     |

### Seed the Database

```bash
npm run seed
```

This creates 2 tenants, 3 restaurants, and 15 menu items. The output prints tenant IDs you can use for testing.

### Run the Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Health Check

| Method | Endpoint  | Description          |
|--------|-----------|----------------------|
| GET    | `/health` | Server health status |

### Tenants (no tenant header required)

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | `/api/tenants`    | List all tenants   |
| POST   | `/api/tenants`    | Create a tenant    |
| GET    | `/api/tenants/:id`| Get tenant by ID   |
| PUT    | `/api/tenants/:id`| Update a tenant    |
| DELETE | `/api/tenants/:id`| Delete a tenant    |

**Query params:** `page`, `limit`, `isActive`

### Restaurants (requires `x-tenant-id` header)

| Method | Endpoint                | Description            |
|--------|-------------------------|------------------------|
| GET    | `/api/restaurants`      | List tenant restaurants|
| POST   | `/api/restaurants`      | Create a restaurant    |
| GET    | `/api/restaurants/:id`  | Get restaurant by ID   |
| PUT    | `/api/restaurants/:id`  | Update a restaurant    |
| DELETE | `/api/restaurants/:id`  | Delete a restaurant    |

**Query params:** `page`, `limit`, `cuisineType`, `isActive`

### Menu Items (requires `x-tenant-id` header)

| Method | Endpoint                                        | Description          |
|--------|-------------------------------------------------|----------------------|
| GET    | `/api/restaurants/:restaurantId/menu`           | List menu items      |
| POST   | `/api/restaurants/:restaurantId/menu`           | Create a menu item   |
| GET    | `/api/restaurants/:restaurantId/menu/:id`       | Get menu item by ID  |
| PUT    | `/api/restaurants/:restaurantId/menu/:id`       | Update a menu item   |
| DELETE | `/api/restaurants/:restaurantId/menu/:id`       | Delete a menu item   |

**Query params:** `page`, `limit`, `category`, `isAvailable`

**Menu item categories:** `appetizer`, `main`, `dessert`, `beverage`, `side`

## Example Requests

### Create a Tenant

```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Food Corp",
    "slug": "acme-food",
    "contactEmail": "admin@acmefood.com"
  }'
```

### Create a Restaurant (tenant-scoped)

```bash
curl -X POST http://localhost:3000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -d '{
    "name": "Downtown Grill",
    "description": "Modern American cuisine",
    "address": {
      "street": "100 Main St",
      "city": "Austin",
      "state": "TX",
      "zipCode": "73301",
      "country": "USA"
    },
    "cuisineType": ["American", "Grill"],
    "rating": 4.3
  }'
```

### Create a Menu Item (nested under restaurant)

```bash
curl -X POST http://localhost:3000/api/restaurants/<RESTAURANT_ID>/menu \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: <TENANT_ID>" \
  -d '{
    "name": "Grilled Salmon",
    "description": "Atlantic salmon with lemon butter",
    "price": 18.99,
    "category": "main"
  }'
```

### Test Data Isolation

```bash
# Tenant A's restaurants - only sees their own data
curl http://localhost:3000/api/restaurants \
  -H "x-tenant-id: <TENANT_A_ID>"

# Tenant B's restaurants - completely separate data
curl http://localhost:3000/api/restaurants \
  -H "x-tenant-id: <TENANT_B_ID>"
```

---