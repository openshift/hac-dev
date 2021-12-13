# Styleguide

## Directory and File Names

- Use `PascalCase` names for all React Components and corresponding SCSS files.
- Use lowercase dash-separated names for all other typescript files.
- Exceptions are files which have their own naming conventions (eg Dockerfile, Makefile, README)


## SCSS/CSS

- All SCSS files should be co-located in the same folder as the component which uses the styles. (Exception could be a common scss file that will be imported by root component. This will include some limited common styles and overrides)
- All SCSS files should follow the same name convention as its corresponding component.
- When possible, avoid element selectors. Class selectors are preferred.
- Scope all classes with a recognizable prefix to avoid collisions with any imported CSS (this project uses `hac-dev-` by convention).
- Class names should be all lowercase and dash-separated.
- All SCSS variables should be scoped within their component.
- We use [BEM](http://getbem.com) naming conventions.
- Avoid custom styles as much as possible.
  - Make use of existing patternfly components and patternfly layouts.
  - Avoid special styles for spacing.
  - Create shared react components to encapsulate any special behavior and reuse.


## React and TypeScript

- All code should be written in TypeScript, not JavaScript.
- Prefer functional components to class-based components.
- Export a single react component per file
- Style and test files corresponding to the react component should match the component file name. Ex - `Button.tsx, Button.scss, Button.spec.tsx`
- Use [React hooks](https://reactjs.org/docs/hooks-intro.html) with functional components if you need state.
- Prefer [composition to inheritance](https://reactjs.org/docs/composition-vs-inheritance.html).
- Run the linter and follow all rules defined in .eslintrc
- Never use absolute paths in code. The app should be able to run behind a proxy under an arbitrary path.
- TESTS: Should follow a similar "test tables" convention as used in Go where applicable.
- Find some more information in [Unofficial TypeScript Style Guide](TYPESCRIPT.md)
