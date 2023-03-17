<a href="https://raebef.netlify.app/" target="_blank">프로젝트 링크</a>

Next.js를 이용해 쇼핑몰 웹사이트를 제작해 보았다.
사용된 버전은 12이며 이번 프로젝트를 끝으로 Next.js 12는 보내주고 13을 새로 공부할 예정이다.

기존의 프로젝트에서는 상태 관리에 **redux**를 사용해 왔는데 딱히 만족스럽지는 않았다. 간단한 데이터를 서버에서 불러와 앱 전역에 뿌려주기 위해 미들웨어, 액션과 리듀서를 작성하던 추억들이 아직까지 생생하다. 따라서 이번 프로젝트에서는 redux보다 **서버 상태를 관리**하는데 더 특화된 **react-query**를 처음으로 도입해 사용해 보았다.

# 사이트 구조

```
┏━ 홈
┣━ 컬렉션
┃    ┣━ 컬렉션 목록
┃    ┗━ 컬렉션 상세
┣━ 제품
┃    ┣━ 제품 목록(필터 검색)
┃    ┣━ 제품 목록(키워드 검색)
┃    ┗━ 제품 상세
┣━ 결제
┃    ┣━ 결제 진행
┃    ┣━ 결제 성공
┃    ┗━ 결제 실패
┣━ 관리자
┃    ┣━ 메뉴
┃    ┣━ 주문 내역
┃    ┣━ 컬렉션
┃    ┃    ┣━ 컬렉션 추가
┃    ┃    ┗━ 컬렉션 수정
┃    ┗━ 제품
┃         ┣━ 제품 추가
┃         ┗━ 제품 수정
┣━ 계정
┣━ 로그인
┣━ 회원가입
┣━ 비밀번호 재설정
┣━ 카트
┣━ 이용 약관
┗━ 개인정보 처리 방침
```

# **네비게이션 바**

![](https://velog.velcdn.com/images/drrobot409/post/5579c62d-2373-4e8d-a603-3b5d4a4d959b/image.png)

네비게이션 바는 뷰포트에 고정되어 항상 눈에 들어오도록 하였다. 따라서 최대한 간결하고 만드는게 좋겠다고 생각은 했지만 딱히 넣을 항목도 없어서 깔끔한 레이아웃으로 탄생하였다.

## **카테고리 목록**

![](https://velog.velcdn.com/images/drrobot409/post/3ac1b1b4-1924-487a-bf6a-11bf74f8df62/image.png)

네비게이션의 카테고리 항목은 이벤트에 따라 두 가지 기능이 동작한다.

1. 클릭 시 전체 제품 목록으로 이동
2. 마우스오버 시 드롭다운

하지만 터치 환경에서는 두 가지 이벤트가 모두 트리거되어 드롭다운이 내려오다가 전체 제품 목록으로 이동되는 현상이 발생했다.

따라서 css의 미디어 쿼리를 통해 hover가 가능한 환경에서만 드롭다운이 내려오도록 처리하였다.

```scss
@media (hover: hover) {
  .btn--category:hover {
    .category__dropdown {
      // ...
    }
  }
}
```

## **검색**

![](https://velog.velcdn.com/images/drrobot409/post/aa6db5ea-7643-471b-ac14-47956901a0f7/image.png)

![](https://velog.velcdn.com/images/drrobot409/post/72618186-2a64-48fc-a722-2a50033deee6/image.png)
검색 버튼을 클릭하면 input이 뷰포트 너비에 따라 반응형으로 출력되도록 만들었다.

# **컬렉션**

![](https://velog.velcdn.com/images/drrobot409/post/d79a33cf-15ed-47b1-8ea8-fe60fc4cb3a0/image.png)

사이트의 홈에 접속하면 가장 먼저 보이는 부분이다.
크게 썸네일 비디오 부분과 그 아래 제품 슬라이드로 나뉜다.

## **제품 슬라이드**

![](https://velog.velcdn.com/images/drrobot409/post/ec454abd-19bc-403d-ae31-fa315941cf52/image.png)

이전 프로젝트에서도 슬라이드를 구현할 일이 몇 번 있었다. 개인 홈페이지를 만들 때는 Swiper 라이브러리를 사용했었고 그 이후에 만든 Splatoon 3 홈페이지 클론에서는 외부 라이브러리의 도움 없이 직접 구현했었는데 이번에 만든 슬라이드 역시 직접 구현해 보았다.

사실 슬라이드 기능 자체는 버튼을 클릭하면 슬라이드 컨테이너를 좌우로 `(itemWidth * n)` 만큼 이동 시키는게 다라서 구현하기 어렵지 않지만 슬라이드를 반응형으로 만드는 것과 드래그 기능을 구현하는 점은 조금 귀찮다.

### **반응형 슬라이드**

![](https://velog.velcdn.com/images/drrobot409/post/6c22f7cd-c946-48c9-887d-16e69256dcc5/image.png)

슬라이드를 반응형으로 만들 때 가장 중요한 부분은 뷰포트 너비에 따라 가변하는 아이템의 너비를 정확하게 전달할 수 있는가에 있다.

아이템의 너비를 구하는 근본적인 방법은 아래와 같다.

`(슬라이드 컨테이너 너비 / 한 페이지에 표시할 아이템의 수)`

만약 아이템들 사이에 여백이 존재하지 않는다면 여기서 끝이지만 여백이 존재한다면 그 여백까지 추가로 계산해 주어야 한다.

여기서 한 가지 간단한 팁이 있는데, 아이템 사이에 여백을 줄 때 `gap`이나 `margin` 등 외부 여백을 사용하는 대신 `padding` 을 사용해 각 아이템의 내부에 여백을 주면 별도로 여백을 계산할 필요가 없어진다. 그러면 아이템의 스타일을 마구 변경해도 아이템의 너비 구하는 공식은 변하지 않기 때문에 유지보수에도 유리하다.

### **슬라이드 드래그**

모바일 환경에서 자연스럽게 작동되기 위해서는 드래그를 통해 페이지를 전환할 수 있어야 한다.

드래그의 진행 단계에 따라 이벤트 리스너를 추가하고 슬라이드를 제어하면 된다.

1. **touchstart**

   - 드래그가 시작됨을 슬라이드에 알리기

   - 터치 시작 좌표를 저장

   - touchmove와 touchend 이벤트 리스너를 등록

   - 슬라이드에 `transition` 이 적용되어 있다면 이 단계에서 비활성화 해야 드래그 시 움직임이 자연스럽다.

2. **touchmove**

   - 터치 시작 좌표와 현재 좌표를 계산하여 이동 거리를 저장

   - 슬라이드의 초기 위치에서 계산한 이동 거리만큼 슬라이드 이동

3. **touchend**

   - 드래그가 종료됨을 슬라이드에 알리기

   - touchmove 이벤트 리스너 제거

   - 슬라이드의 현재 위치에서 가장 가까운 페이지로 페이지 적용

   - 비활성화한 `transition` 복구

<br/>

아래는 프로젝트에 적용한 코드이며 참고용으로만 보면 좋을 듯 하다.

```typescript
useEffect(() => {
  if (!slideRef.current) return;

  /////////////// 지역 변수 선언 /////////////////////////
  const slide = slideRef.current;

  // 슬라이드의 초기 위치
  const slideInitX =
    maxPage === 9
      ? -slideItemWidth * slidePage
      : -slideItemWidth * 2 * slidePage;

  // 터치 시작 위치
  let touchStartX: number;

  // 터치 이동 거리
  let touchMoveX: number;
  ////////////////////////////////////////////////////

  const touchMoveListener = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (!slideRef.current) return;
    const slide = slideRef.current;

    // 슬라이드의 초기 위치에 터치 이동 거리를 더한 만큼 슬라이드를 이동시킨다.
    touchMoveX = e.touches[0].clientX - touchStartX;
    slide.style.transform = `translateX(${slideInitX + touchMoveX}px)`;
  };

  const touchEndListener = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (!slideRef.current) return;
    const slide = slideRef.current;

    setDragging(false);
    slide.style.transitionDuration = "500ms !important";

    // 현재 슬라이드 위치에서 가장 가까운 페이지로 페이지 적용
    const newPage = slidePage + Math.round(touchMoveX / -slideItemWidth);
    setSlidePage(newPage <= 0 ? 0 : newPage >= maxPage ? maxPage : newPage);
    moveSlide();

    window.removeEventListener("touchmove", touchMoveListener);
  };

  const touchStartListener = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (!slideRef.current) return;
    const slide = slideRef.current;

    setAutoSlide(false);
    setDragging(true);

    slide.style.transitionDuration = "0ms !important";
    touchStartX = e.touches[0].clientX;
    window.addEventListener("touchmove", touchMoveListener);
    window.addEventListener("touchend", touchEndListener, { once: true });
  };

  return () => {
    slide.removeEventListener("touchstart", touchStartListener);
    window.removeEventListener("touchmove", touchMoveListener);
    window.removeEventListener("touchend", touchEndListener);
  };
}, [maxPage, moveSlide, slideItemWidth, slidePage]);
```

마우스로도 드래그할 수 있도록 적용하고 싶다면 이벤트나 값을 마우스로 대체하여 같은 내용의 리스너를 추가하면 된다.

다만 마우스의 경우 아이템에 링크가 걸려있으면 드래그가 끝날 때 마우스의 위치에 있는 아이템의 링크로 이동된다. 아래의 코드를 `mousemove` 이벤트 리스너에 추가하여 드래그 시 링크 이동을 방지할 수 있다.

```js
// ±25px 이상 이동이 발생하면 드래그로 간주하여 링크 이동이 비활성화된다.
// 25는 본인이 생각한 드래그의 최소 기준값으로 바꿔서 사용하면 된다.
if (Math.abs(touchMoveX) >= 25) {
  // ToDo: blockLink의 값으로 아이템의 pointer-events를 제어하기
  setBlockLink(true);
}
```

### **페이지네이션**

페이지네이션은 자신의 key가 현재 페이지와 일치하면 색이 바뀌고 누르면 key로 페이지가 변경되는 동그라미들을 전체 페이지 수 만큼 추가하면 된다.

```jsx
const paginationGenerator = () => {
  let dots: Array<JSX.Element> = [];

  for (let i = 0; i <= maxPage; i++) {
    dots.push(
      <div
        key={i}
        className={`h-2 w-2 cursor-pointer rounded-full ${
          i === slidePage ? "bg-zinc-600" : "bg-zinc-200"
        }`}
        onClick={() => {
          setSlidePage(i);
        }}
      />
    );
  }

  return dots;
};
```
