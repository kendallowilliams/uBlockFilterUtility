This file explains how Visual Studio created the project.

The following tools were used to generate this project:
- TypeScript Compiler (tsc)

The following steps were used to generate this project:
- Create project file (`uBlockFilterUtility.node.esproj`).
- Create `launch.json` to enable debugging.
- Install npm packages and create `tsconfig.json`: `npm init && npm i --save-dev eslint @types/node typescript && npx tsc --init --sourceMap true`.
- Create `app.ts`.
- Update `package.json` entry point.
- Update TypeScript build scripts in `package.json`.
- Create `eslint.config.js` to enable linting.
- Add project to solution.
- Write this file.

Run in project root:
npm install typescript (if needed)
npx tsc ./node_modules/@gorhill/ubo-core/index.js --declaration --emitDeclarationOnly --outDir ./src/types/@gorhill/ubo-core --ignoreConfig --allowJs

"include": ["./node_modules/@gorhill/**/*.js"],
"exclude": ["./node_modules/@gorhill/**/biditrie.js", "./node_modules/@gorhill/**/hntrie.js"]