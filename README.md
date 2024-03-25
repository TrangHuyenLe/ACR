# Automatic_Course_Registration_System

## Get started

**1. Install dependencies**

```
npm install -g pnpm
pnpm i
pnpm add [pkg name] --filter [app name]
```

**2. Add required files**

- .env
- config launch options path for worker (default: launchOptions.custom.json)

**3. Run build**

```
npx nx run-many --target=build --all
npx nx build [app name]
```

**4. Run dev**

```
npx nx dev [app name] & npx nx build:watch [app name]
npx nx dev acr-worker & npx nx build:watch acr-worker
npx nx run-many --target=dev --all
npx nx run-many -t dev --maxParallel=100 & npx nx run-many -t build:watch  --maxParallel=100
```
