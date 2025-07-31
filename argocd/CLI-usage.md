# Administración de ArgoCD via línea de comandos

Para habilitar el uso de Cli se debe crear un Service y un Ingress pero de tipo GRPC debido a restricciones propias del server de ArgoCD

## Creación del servicio GRPC

```yaml
# argocd-service-grpc.yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    alb.ingress.kubernetes.io/backend-protocol-version: GRPC # This tells AWS to send traffic from the ALB using GRPC. Plain HTTP2 can be used, but the health checks wont be available because argo currently downgrade non-grpc calls to HTTP1
  labels:
    app: argogrpc
  name: argogrpc
  namespace: argocd
spec:
  ports:
  - name: "443"
    port: 443
    protocol: TCP
    targetPort: 8080
  selector:
    app.kubernetes.io/name: argocd-server
  sessionAffinity: None
  type: NodePort
````

## Creación del Ingress interno

```yaml
# argocd-ingress-grpc.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
annotations:
    alb.ingress.kubernetes.io/backend-protocol: HTTPS
    # Use this annotation (which must match a service name) to route traffic to HTTP2 backends.
    alb.ingress.kubernetes.io/conditions.argogrpc: |
    [{"field":"http-header","httpHeaderConfig":{"httpHeaderName": "Content-Type", "values":["application/grpc"]}}]
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/ssl-redirect: "443"
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:279527989600:certificate/c3bc4666-2862-49e8-8305-4ab685a7f198
    alb.ingress.kubernetes.io/subnets: subnet-00466cb725ceb94e6 #Intra-priv Coquena
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/tags: tipo=privado
name: argocd
namespace: argocd
spec:
ingressClassName: alb
rules:
- host:
    http:
    paths:
    - path: /
        backend:
        service:
            name: argogrpc # The grpc service must be placed before the argocd-server for the listening rules to be created in the correct order
            port:
            number: 443
        pathType: Prefix
    - path: /
        backend:
        service:
            name: argocd-server
            port:
            number: 443
        pathType: Prefix

```

## Obtención de la clave de admin por defecto

Para administrar ArgoCD vía Cli es necesario conocer el usuario administrador y su password, u otro usuario según corresponda

```bash
ARGO_ADMIN_PWD=$(argocd admin initial-password -n argocd | head -1)
echo "ARGO_ADMIN_PWD: [${ARGO_ADMIN_PWD}]"
```

## Login

Para inicializar la sesion se requiere conocer el usuario y la password

```bash
# Defina su server según corresponda
ARGO_SERVER="localhost:8080" # Para uso con minikube
ARGO_SERVER="k8s-argocd-argocdin-87c0015897-1773973690.us-east-1.elb.amazonaws.com" # Para uso con Web UI
ARGO_SERVER="internal-k8s-argocd-argocd-8efea739a6-1432857483.us-east-1.elb.amazonaws.com" # Para uso con Cli
echo "ARGO_SERVER: [${ARGO_SERVER}]"

argocd login $ARGO_SERVER --username admin --password $ARGO_ADMIN_PWD --insecure
```

## Agregar un repositorio Git

Una vez establecido el login se pueden listar, agregar y eliminar los repositorios Git

```bash
REPO_NAME="poc"
PROJECT="argoprj"
GIT_REPO="https://gitlabcloud.banco.bestado.cl/arquitectura/terraform/gitops/poc.git"
GIT_USER="jmuno10" 
GIT_PWD="ycH7acat51-3taFoiDex"
echo "REPO_NAME: [${REPO_NAME}]"
echo "PROJECT  : [${PROJECT}]"
echo "GIT_REPO : [${GIT_REPO}]"
echo "GIT_USER : [${GIT_USER}]"
echo "GIT_PWD  : [${GIT_PWD}]"

# Listar repositorios
argocd repo list

# Agregar repositorios
argocd repo add ${GIT_REPO} --type git --name ${REPO_NAME} --project ${PROJECT} --username ${GIT_USER} --password ${GIT_PWD} --insecure-ignore-host-key

# Para eliminar repositorios se debe usar la URL y no el nombre
argocd repo rm ${GIT_REPO}
```
