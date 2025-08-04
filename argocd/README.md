# GITOPS con ARGOCD

Vamos a instalar, configurar y probar en AWS/EKS

Resúmen de contenidos
- [GITOPS con ARGOCD](#gitops-con-argocd)
  - [Instalación ArgoCD](#instalación-argocd)
    - [Obtención del manifiesto de instalación](#obtención-del-manifiesto-de-instalación)
    - [Imagenes a bajar y subir al repo local](#imagenes-a-bajar-y-subir-al-repo-local)
    - [Aplicar el manifiesto con imagenes modificadas](#aplicar-el-manifiesto-con-imagenes-modificadas)
  - [Desinstalación ARGOCD en el K8s](#desinstalación-argocd-en-el-k8s)
  - [Instalación con Helm](#instalación-con-helm)
  - [Desinstalación con Helm](#desinstalación-con-helm)
  - [Instalar el cliente ARGOCD](#instalar-el-cliente-argocd)
    - [Obtención de la password del cliente ArgoCD](#obtención-de-la-password-del-cliente-argocd)
  - [Activación de del Cli](#activación-de-del-cli)
  - [Activación del Dashboard en AWS Outposts](#activación-del-dashboard-en-aws-outposts)
  - [Ejemplo de cambio de la imagen de la APP para que ARGO la lea y aplique valores](#ejemplo-de-cambio-de-la-imagen-de-la-app-para-que-argo-la-lea-y-aplique-valores)

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

## Activación de del Cli

Para la mayoria de los casos es uso de la Cliente de ArgoCD bastará para realizar todas las operaciones. 
Para ver mas detalles de la activación y uso de [Cli siga esta link](CLI-usage.md)

## Activación del Dashboard en AWS Outposts

Para activar el [Dashboard, siga este link](AWS-dashboard.md)



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