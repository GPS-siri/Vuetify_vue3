# FirstSetting_Vue3

This template should help get you started developing with Vue 3 in Vite.
프로텍트 프론트 엔드 Vue3 첫 셋팅 규격화(v1.0)
maker: GPS.siri92
createDate: 23. 06. 01
contact: gps.siri92@gmail.com

!업데이트시 꼭 history 기록할것!

## upgrade History

```
1. 23.06.01 - 프로텍트 GPS.siri 제작
```

# Project Stack Info

- Vuetify
- API 관련: GraphQL + Apollo, Axios
- Formatter: Prettier + ESLint

### VSCode - 확장: Prettier ESLint 같이 쓰기

→ VSCode 확장에서 "Prettier ESLint" 검색 후 설치/사용 그 다음 아래 스텝 1~5 진행

1. yarn add -D prettier@latest eslint@latest vue-eslint-parser@latest
   (prettier 2.5.1 이상 / eslint 8.7.0 이상 / vue-eslint-parser 8.0.0 이상 )

2. 작업영역 vscode 세팅을 연다

- CMD + SHIFT + P (Mac)
- CTRL + SHIFT + P (Windows)

> Preferences: Open Workspace Settings (JSON)

3. .vscode/settings.json 파일을 열어서(혹은 만들어서) 아래를 복사 붙여넣기
   {
   "editor.defaultFormatter": "rvest.vs-code-prettier-eslint",
   "editor.formatOnPaste": false, // required
   "editor.formatOnType": false, // required
   "editor.formatOnSave": true, // optional
   "editor.formatOnSaveMode": "file", // required to format on save
   "files.autoSave": "onFocusChange", // optional but recommended
   "vs-code-prettier-eslint.prettierLast": false // set as "true" to run 'prettier' last not first
   }

4. Vscode 재실행시 정상 적용

5. 문제발생시,
   https://github.com/idahogurl/vs-code-prettier-eslint/#troubleshooting - 문의
   https://github.com/idahogurl/vs-code-prettier-eslint/tree/master/examples/javascript-vue - Vue 예시 프로젝트
   참고

### Formmatters check info

1. ESLint 는 root에 .eslintrc.cjs 파일로 컨트롤
2. prettier 는 root에 .prettierrc.json 파일로 컨트롤

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
||
yarn install
```

### Compile and Hot-Reload for Development

```sh
# package.json script 따라 실행
# ex> below...
npm run dev
||
yarn dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
