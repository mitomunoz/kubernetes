# Tests directos a la API de APISIX

Requisitos:

- Tener Docker
- Correr httpbin para pruebas
- Levantar al servicio de administracion de APISIX
  
## Test de creación de rutas

```bash
docker run -p 80:80 kennethreitz/httpbin

NAMESPACE="ingress-apisix"
export admin_key="edd1c9f034335f136f87ad84b625c8f1"


minikube service -n $NAMESPACE apisix-admin  --url
APISIX_ADMIN_PORT=50316

# Leer rutas creadas
curl http://127.0.0.1:$APISIX_ADMIN_PORT/apisix/admin/routes -H "X-API-KEY: $admin_key" -X GET

# Crear ruta
curl -i "http://127.0.0.1:$APISIX_ADMIN_PORT/apisix/admin/routes" -H "X-API-KEY: $admin_key"  -X PUT -d '
{
  "id": "getting-started-ip",
  "uri": "/ip",
  "upstream": {
    "type": "roundrobin",
    "nodes": {
      "httpbin.org:80": 1
    }
  }
}'

curl -v http://localhost/ip
```

## Test de Load Balancing

Se crea un balanceo de la ruta XXX/headers entre httpbin y mock.api7.ai

```bash
curl -i "http://127.0.0.1:$APISIX_ADMIN_PORT$/apisix/admin/routes" -X PUT -d '
{
  "id": "getting-started-headers",
  "uri": "/headers",
  "upstream" : {
    "type": "roundrobin",
    "nodes": {
      "httpbin.org:443": 1,
      "mock.api7.ai:443": 1
    },
    "pass_host": "node",
    "scheme": "https"
  }
}'

```
