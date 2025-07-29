# GITOPS con ARGOCD

Vamos a instalar, configurar y probar ARGOCD

Resúmen de contenidos

## Instalación ArgoCD

### Obtención del manifiesto de instalación

```bash
# obtener manifiesto
wget https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# reemplazar imagenes a repos propios
cat install.yaml |grep image:|sort |uniq    

sed -i -e 's/ghcr.io\/dexidp\/dex:v2.41.1/279527989600.dkr.ecr.us-east-1.amazonaws.com\/ghcr.io\/dexidp\/dex:v2.41.1/g' install.yaml
sed -i -e 's/quay.io\/argoproj\/argocd:v3.0.6/279527989600.dkr.ecr.us-east-1.amazonaws.com\/quay.io\/argoproj\/argocd:v3.0.6/g' install.yaml
sed -i -e 's/redis:7.2.7-alpine/279527989600.dkr.ecr.us-east-1.amazonaws.com\/redis:7.2.7-alpine/g' install.yaml
```

### Imagenes a bajar y subir al repo local

- ghcr.io/dexidp/dex:v2.41.1
- quay.io/argoproj/argocd:v2.14.6
- redis:7.0.15-alpine

### Aplicar el manifiesto con imagenes modificadas

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f install.yaml
```

## Desinstalación ARGOCD en el K8s

```bash
  kubectl delete -f install.yaml
  kubectl delete namespace argocd
```

## Instalación con Helm

```bash
helm repo add argo https://argoproj.github.io/argo-helm

helm pull argo/argo-cd

helm install argo-cd ./argo-cd-7.9.0.tgz --namespace argocd --create-namespace \
--set global.image.repository=279527989600.dkr.ecr.us-east-1.amazonaws.com/quay.io/argoproj/argocd \
--set dex.pdb.image.repository=279527989600.dkr.ecr.us-east-1.amazonaws.com

```

Tras haber instalado exitosamente deberias tener una salida como la que sigue:

```text
NAME: argo-cd
LAST DEPLOYED: Tue Apr 29 12:23:38 2025
NAMESPACE: argocd
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
In order to access the server UI you have the following options:

1. kubectl port-forward service/argo-cd-argocd-server -n argocd 8080:443

    and then open the browser on http://localhost:8080 and accept the certificate

2. enable ingress in the values file `server.ingress.enabled` and either
      - Add the annotation for ssl passthrough: https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/#option-1-ssl-passthrough
      - Set the `configs.params."server.insecure"` in the values file and terminate SSL at your ingress: https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/#option-2-multiple-ingress-objects-and-hosts


After reaching the UI the first time you can login with username: admin and the random password generated during the installation. You can find the password by running:

kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

(You should delete the initial secret afterwards as suggested by the Getting Started Guide: https://argo-cd.readthedocs.io/en/stable/getting_started/#4-login-using-the-cli)
```

## Desinstalación con Helm

```bash
helm uninstall -n argocd argo-cd
kubectl delete namespaces argocd
```

## Instalar el cliente ARGOCD

```bash
brew install argocd

curl -k -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64

wget https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd

```

### Obtención de la password del cliente ArgoCD

```bash
# Obtener clave inicial via Kubectl
ARGO_PWD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo "ARGO_PWD: [${ARGO_PWD}]"

# Obtener clave inicial via CLI
ARGO_PWD=$(argocd admin initial-password -n argocd)
echo "ARGO_PWD: [${ARGO_PWD}]"
```

## Activación del dashboard

Para activar el dashboard se debe crear un ingress. En el caso AWS depende del Load Balancer.

En AWS, la subnet debe ser una subred intra-priv con rutas al Local Gateway correspondiente al Outpost donde vive.

- Outposts Kenos  : lgw-04baf7227e545c480 (ID: op-0a472f28ca87bd8ab)
- Outposts Coquena: lgw-073894fb6156ab0e0 (ID: op-04af07f1345f8c4ad)

En Outposts -> LWG route tables, debe existir la asociación con la VPC que estamos usando.
Y de ahi sacamos también el customer-owned-ipv4-pool.
Revisar además las Rutas

Dado que el ALB en AWS no puede llegar a un SVC de tipo ClusterIP, creamos uno de tipo NodePort

```yaml
# argocd-server-alb.yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/component: server
    app.kubernetes.io/name: argocd-server-alb
    app.kubernetes.io/part-of: argocd
  name: argocd-server-alb
  namespace: argocd
spec:
  type: NodePort
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 8080
  - name: https
    port: 443
    protocol: TCP
    targetPort: 8080
  selector:
    app.kubernetes.io/name: argocd-server

```

Cree el archivo argocd-ingress.yaml con el siguiente contenido apuntando al SVC recién creado

```yaml
# argocd-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-ingress
  namespace: argocd
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/ip-address-type: ipv4
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}]'
    alb.ingress.kubernetes.io/tags: tipo=privado
    alb.ingress.kubernetes.io/subnets: subnet-00466cb725ceb94e6 #Intra-priv Coquena  
    alb.ingress.kubernetes.io/customer-owned-ipv4-pool: ipv4pool-coip-0b9f2b4516b10245f
    alb.ingress.kubernetes.io/target-type: instance
    #alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:279527989600:certificate/c3bc4666-2862-49e8-8305-4ab685a7f198
spec:
  ingressClassName: alb
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: argocd-server-alb
                port:
                  number: 80 #Toma el puerto expuesto en el servicio ArgoCD

```

Asegúrese que la subred donde son creados los nodos de su clúster tengan el tag **kubernetes.io/role/internal-elb=1**

### Establece el acceso al REPO que usa ARGO para GITOPS

Este es el repo de GitOPS donde se establece el proceso
ArgoCD token en Git: ycH7acat51-3taFoiDex

```yaml
# gitlab-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: gitlab-gitops-secret
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
type: Opaque
stringData:
  url: https://gitlabcloud.banco.bestado.cl/arquitectura/terraform/gitops/poc.git
  username: jmuno10@bancoestado.cl
  password: ycH7acat51-3taFoiDex
```

## Ejemplo de cambio de la imagen de la APP para que ARGO la lea y aplique valores

```yaml
build:
  - docker build -t registry.acme.cl/rut-validator:abc123 .
  - docker push registry.acme.cl/rut-validator:abc123
 
promote:
  - git clone https://gitlab-gitops.acme.cl/platform/apps-rut-validator.git
  - cd environments/dev
  - yq e '.image.tag = "abc123"' -i values.yaml
  - git commit -am "Promo imagen abc123"
  - git push
```

---

Referencias

- https://youtu.be/MeU5_k9ssrs?si=haLwuJAuvNMlMqjC