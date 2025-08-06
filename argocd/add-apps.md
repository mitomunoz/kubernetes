# Agregando aplicaciones

Para agregar una aplicación se puede hacer directamente desde el repositorio, para ellos debemos tener
los archivos yaml pertenecientes a la aplicación.

## Agregado archivos al repositorio

Primero crear el archivo de Deployment dentro de una carpeta para la app y diferenciarla de otras

```yaml
# ms-rust-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rust-ms
spec:
  replicas: 1
  revisionHistoryLimit: 3
  selector:
    matchLabels:
      app: rust-ms
  template:
    metadata:
      labels:
        app: rust-ms
    spec:
      containers:
        - image: 279527989600.dkr.ecr.us-east-1.amazonaws.com/mitotech:ms-rust.latest
          name: rust-ms
          ports:
            - containerPort: 80
```

Luego crear el archivo del servicio

```yaml
# ms-rust-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: rust-ms
spec:
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: rust-ms
```

Finalmente agregar ambos archivos al repositorio

```bash
git add rust-app/ms-rust-deployment.yaml
git add rust-app/ms-rust-service.yam

git commit -m "Initial commit"
git push
```

## Creando la aplicación

```bash
APP_NAME="rust-app"
APP_REPO="https://gitlabcloud.banco.bestado.cl/arquitectura/terraform/gitops/poc.git"
APP_REPO_PATH="rust-app"
APP_NS="app1"

# Obetener el nombre del server/cluster registrado en ArgoCD
argocd cluster list

# Usar el nombre fijo cuando el cluster es local 
ARGO_CLUSTER="https://kubernetes.default.svc"

# Primero creamos en NS en Kubernetes
kubectl create ns ${APP_NS}

# Luego creamos la APP
argocd app list

# Se crea la app
argocd app create ${APP_NAME} --repo ${APP_REPO} --path ${APP_REPO_PATH} --dest-server ${ARGO_CLUSTER} --dest-namespace ${APP_NS}

# Una vez creada, se puede revisar con "argocd app list" o con 
argocd app get argocd/${APP_NAME}

# Para activar la sincronización
argocd app sync argocd/${APP_NAME}


```
