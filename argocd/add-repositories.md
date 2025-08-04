# Agregar un repositorio Git

Una vez [instalado el Cli](CLI-usage.md) y establecido el login se pueden listar, agregar y eliminar los repositorios Git

## Para repositorios via Cli

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

## Agregar repositorios via secretos en K8s

ArgoCD token en Git: ycH7acat51-3taFoiDex

```yaml
# poc-repo-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: poc-repo-gitops-secret
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
type: Opaque
stringData:
  project: poc2prj
  name: poc2
  url: https://gitlabcloud.banco.bestado.cl/arquitectura/terraform/gitops/poc2.git
  username: jmuno10@bancoestado.cl
  password: ycH7acat51-3taFoiDex
  insecure: "true"
```
