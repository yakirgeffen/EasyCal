#!/bin/bash

# Create main directories
mkdir -p easycal-frontend/components/description
mkdir -p easycal-frontend/components/event
mkdir -p easycal-frontend/components/output
mkdir -p easycal-frontend/components/ui/tabs
mkdir -p easycal-frontend/components/common
mkdir -p easycal-frontend/pages
mkdir -p easycal-frontend/contexts
mkdir -p easycal-frontend/hooks
mkdir -p easycal-frontend/lib
mkdir -p easycal-frontend/styles
mkdir -p easycal-frontend/public
mkdir -p easycal-frontend/utils

# Create component files
touch easycal-frontend/components/description/SmartDescriptionEditor.jsx
touch easycal-frontend/components/event/EventForm.jsx
touch easycal-frontend/components/event/ButtonCustomizer.jsx
touch easycal-frontend/components/output/CodeOutput.jsx
touch easycal-frontend/components/output/OutputPreview.jsx
touch easycal-frontend/components/common/Layout.jsx

# Create tab components
touch easycal-frontend/components/ui/tabs/index.js
touch easycal-frontend/components/ui/tabs/Tabs.jsx
touch easycal-frontend/components/ui/tabs/TabsContent.jsx
touch easycal-frontend/components/ui/tabs/TabsList.jsx
touch easycal-frontend/components/ui/tabs/TabsTrigger.jsx

# Create page files
touch easycal-frontend/pages/_document.js
touch easycal-frontend/pages/_app.js
touch easycal-frontend/pages/index.js
touch easycal-frontend/pages/create.js

# Create config files
touch easycal-frontend/package.json
touch easycal-frontend/tailwind.config.js
touch easycal-frontend/next.config.js
touch easycal-frontend/README.md

echo "EasyCal project structure created successfully!"