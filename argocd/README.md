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

## Instalación con Helm

```bash
helm repo add argo https://argoproj.github.io/argo-helm

helm pull argo/argo-cd

helm install argo-cd argo/argo-cd --namespace argocd --create-namespace \
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
```

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

