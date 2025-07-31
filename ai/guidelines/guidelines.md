- All guidelines in ai/guidelines/guidelines-epicstack-core.md
- Use always tailwind css and do not create custom CSS
- The CSS file needs to use the variables defined in tailwind.css
- When I need some new colors I need to add them in tailwind.css
- The app is mobile first
- The available icon names are in iconNames in the file
  app/components/ui/icons/types.ts
- use invariant or invariantResponse to avoid "if" clauses or {vaiable}!
  solutions when a variable is null or undefined
