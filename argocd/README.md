# GITOPS con ARGOCD

Vamos a instalar, configurar y probar ARGOCD

## Obtención del manifiesto de instalación

```bash
# obtener manifiesto
wget https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# reemplazar imagenes a repos propios
cat install.yaml |grep image:|sort |uniq    

sed -i -e 's/ghcr.io\/dexidp\/dex:v2.41.1/279527989600.dkr.ecr.us-east-1.amazonaws.com\/ghcr.io\/dexidp\/dex:v2.41.1/g' install.yaml
sed -i -e 's/quay.io\/argoproj\/argocd:v2.14.6/279527989600.dkr.ecr.us-east-1.amazonaws.com\/quay.io\/argoproj\/argocd:v2.14.6/g' install.yaml
sed -i -e 's/redis:7.0.15-alpine/279527989600.dkr.ecr.us-east-1.amazonaws.com\/redis:7.0.15-alpine/g' install.yaml
```

## Imagenes a bajar y subir al repo local

- ghcr.io/dexidp/dex:v2.41.1
- quay.io/argoproj/argocd:v2.14.6
- redis:7.0.15-alpine

## Instalación ARGOCD en el K8s

```bash
  kubectl create namespace argocd
  kubectl apply -n argocd -f install.yaml
```

## Desinstalación ARGOCD en el K8s

```bash
  kubectl delete -f install.yaml
  kubectl delete namespace argocd
```



## Aplicar el PATCH al/los despliegues

TODO: apply patch de los deploys o crear un heml propio (buscar uno weno para ARGO)
helm repo add argo https://argoproj.github.io/argo-helm
helm install argo-cd argo/argo-cd --namespace argocd --create-namespace

## Instalar el cliente ARGOCD

```bash
brew install argocd
```

### Configuración de las claves de acceso a ARGOCD con el CLI

TODO: Clace de admin, la url del UI, otras weas

### Establece el acceso al REPO que usa ARGO para GITOPS

Este es el repo de GitOPS donde se establece el proceso

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gitlab-gitops-secret
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
type: Opaque
stringData:
  url: <https://gitlab-gitops.acme.cl/platform/apps-rut-validator.git>
  username: gitlab-ci-token
  password: <tu token aquí>
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

