# About
This is a helper service to maintain Surge Rules driven by subconverter, I wrap a express service to modify the output of subconverter service.

Besides, the structure can maintain custom files and config easily

# Config
1. Create .env and .env.prod, copy contents from .env.template file, and change domain to your server
2. Create configuration/index.js from configuration/index.template.js, add your subscriptions and filter.
3. Create template/rulebase.conf and copy all contents from template/rulebase.mustache, modify it if needed

# Deploy
```
docker compose up -d --build
```

# Dev server
```
npm i
npm run dev
```