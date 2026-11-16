# CAEST 자소서 웹페이지 — 사용·수정 안내

`index.html`을 더블클릭하면 바로 열립니다(설치·빌드 없음). 글·링크·사진은 전부 **`js/data.js` 한 파일**에서 바꿉니다. 저장 후 브라우저 새로고침.

## 자주 바꾸는 것

| 바꾸고 싶은 것 | `js/data.js`에서 찾을 곳 |
|---|---|
| 이름·직함·소속·NOW 배지 | `profile` |
| 슬로건(영문 3줄 / 한글) | `slogan.enLines`, `slogan.ko` |
| 첫 화면 배경 사진 | `hero.slides` — 여러 장 넣으면 6초마다 교차 전환 |
| About 문단·숫자 카드 | `about.paragraphs`, `about.bento` |
| 경력 카드 | `work.timeline` — 위에서부터 순서대로 표시 |
| 가로로 넘기는 카드 | `work.showcase` |
| 사진 모음 | `archive.items` |
| 흐르는 글자 2줄 | `stack.rows` |
| 연락 버튼 | `contact.links` |

## 예시 문구 교체

`placeholder: true` 또는 `// placeholder` 주석이 붙은 곳은 예시 문구입니다. 실제 내용으로 바꾼 뒤 그 표시는 지워도 되고 그대로 둬도 화면에는 영향이 없습니다.

## 이메일·이력서 버튼 켜기

```js
{ id: "email",  label: "Email",      url: "mailto:주소@example.com", icon: "mail",      enabled: true },
{ id: "resume", label: "Résumé PDF", url: "assets/resume.pdf",       icon: "file-down", enabled: true }
```
PDF는 `assets/` 폴더에 넣고 경로를 적습니다. `enabled: false`면 "준비 중" 점선 버튼으로 보입니다.

## 사진 넣기

1. 사진을 `assets/img/`에 넣습니다(가로 1,000~1,600px 권장, jpg 또는 webp).
2. 경력 카드 안에 넣으려면 해당 항목에 `photos`를 추가합니다.
   ```js
   photos: [ { fallback: "assets/img/파일.jpg", alt: "사진 설명", position: "50% 40%" } ]
   ```
3. 사진 모음에 넣으려면 `archive.items`에 추가합니다.
   ```js
   { id: "ar-new", caption: "설명", year: "2026",
     image: { fallback: "assets/img/파일.jpg" }, ratio: 0.8, speed: 1.0, alt: "사진 설명" }
   ```
   - `ratio`: 틀의 가로÷세로(0.75 = 세로로 긴 틀). 원본과 다르면 `position` 기준으로 잘립니다.
   - `position`: 잘릴 때 남길 지점("가로% 세로%").
   - `webp` / `webpSmall`은 있으면 더 가볍게 뜨지만 없어도 됩니다.

## 첫 화면 배경 조절

```js
slides: [ { fallback: "assets/img/파일.jpg", width: 739, height: 1600,
            position: "50% 30%",   // PC에서 보여줄 지점
            inset: "58%",          // 사진을 화면 폭의 58%로 줄여 오른쪽 배치(지우면 화면 가득)
            zoom: 1.4, zoomOrigin: "80% 64%" } ]   // 특정 지점 기준 확대(선택)
```

## 색 바꾸기

`css/tokens.css` 맨 위 색상 값만 바꾸면 전체에 반영됩니다. 변수 이름 `--c-gold / --c-teal / --c-terra`는 예전 이름이 남은 것이고, 각각 주·보조·강조 포인트 색입니다.

## 제출·배포할 때

- 올릴 것: `index.html`, `css/`, `js/`, `assets/`
- 빼도 되는 것: `tools/`, `.verify/`, `_archive/`, `BUILD_LOG.md`, `README.md`
- 인터넷이 필요합니다: 글꼴과 애니메이션 라이브러리를 온라인에서 받습니다. 끊겨 있어도 내용은 전부 보이지만 글꼴이 기본 글꼴로 바뀌고 일부 움직임이 꺼집니다.
- 파일로 보낼 때는 폴더째 압축해서 보내야 합니다(`index.html`만 보내면 사진·영상이 안 뜹니다). 링크 하나로 공유하려면 GitHub Pages·Netlify 같은 정적 호스팅에 위 4개를 올리면 됩니다.

## 수정 후 점검(선택, Node 22 이상)

```
node tools/verify.mjs    # PC·모바일·오프라인·모션 축소 자동 검사 + .verify/ 스크린샷
node tools/perf.mjs      # 실제 창에서 스크롤 끊김 측정(Chrome 창이 잠깐 뜸)
```
