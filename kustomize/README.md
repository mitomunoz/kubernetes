# Inicios con Kustomize

```bash
kustomize build

# Verifica el yaml del kustomizado
kubectl kustomize ./

# Aplicamos el despliegue base
cd base
kubectl apply -k ./

# Aplicamos el despliegue en dev
cd ..
kubectl apply -k ./dev
```
