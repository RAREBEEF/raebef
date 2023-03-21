<a href="https://raebef.netlify.app/" target="_blank">프로젝트 링크</a>

Next.js를 이용해 쇼핑몰 웹사이트를 제작해 보았다.
사용된 버전은 12이며 이번 프로젝트를 끝으로 Next.js 12는 보내주고 13을 새로 공부할 예정이다.

기존의 프로젝트에서는 상태 관리에 **redux**를 사용해 왔는데 딱히 만족스럽지는 않았다. 간단한 데이터를 서버에서 불러와 앱 전역에 뿌려주기 위해 미들웨어, 액션과 리듀서를 작성하던 추억들이 아직까지 생생하다. 따라서 이번 프로젝트에서는 redux보다 **서버 상태를 관리**하는데 더 특화된 **react-query**를 처음으로 도입해 사용해 보았다.

# 사이트맵

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

네비게이션 바는 뷰포트에 고정되어 항상 눈에 들어오도록 하였다.

항상 상단에 고정되어 있는 만큼 최대한 간결하고 만드는게 좋겠다고 생각은 했지만 딱히 넣을 항목도 없어서 깔끔한 레이아웃으로 탄생하였다.

네비게이션 바의 항목으로는 **홈(로고), 컬렉션, 카테고리, 검색, 프로필과 장바구니(비로그인 시 로그인 버튼)**이 있다.

장바구니는 담긴 제품 수를 아이콘 옆에 출력하도록 하였다.

## **카테고리 목록**

![](https://velog.velcdn.com/images/drrobot409/post/3ac1b1b4-1924-487a-bf6a-11bf74f8df62/image.png)

네비게이션의 카테고리 항목은 이벤트에 따라 두 가지 기능이 동작한다.

1. 클릭 시 전체 제품 목록으로 이동
2. 마우스오버 시 카테고리 목록 드롭다운

하지만 모바일 등 터치 환경에서는 항목 터치 시 두 가지 이벤트가 모두 트리거되어 드롭다운이 내려오다가 전체 제품 목록으로 이동되는 현상이 발생한다.

따라서 css의 미디어 쿼리를 통해 진짜(?) hover가 가능한 환경에서만 드롭다운이 내려오도록 처리하였다.

```scss
@media (hover: hover) {
  .btn--category:hover {
    .category__dropdown {
      // 드롭다운 활성화
    }
  }
}
```

## **검색**

![](https://velog.velcdn.com/images/drrobot409/post/aa6db5ea-7643-471b-ac14-47956901a0f7/image.png)
키워드를 통해 제품을 검색할 수 있는 검색 버튼이다.
키워드 검색에 대한 자세한 내용은 후술.

![](https://velog.velcdn.com/images/drrobot409/post/72618186-2a64-48fc-a722-2a50033deee6/image.png)
반응형 레이아웃으로 네비게이션 바의 너비가 좁아지면 검색창을 하단에 별도로 분리하였다.

# **컬렉션**

![](https://velog.velcdn.com/images/drrobot409/post/d79a33cf-15ed-47b1-8ea8-fe60fc4cb3a0/image.png)

사이트의 홈에 접속하면 가장 먼저 보이는 부분이다.
크게 썸네일(영상) 부분과 그 아래 제품 슬라이드로 나뉜다.

## **썸네일**

말 그대로 썸네일이다. 컬렉션을 대표할 수 있는 영상을 삽입하였다.

특별한 점은 없고 `<poster>` 태그를 이용해 영상이 로드되기 전에는 별도로 지정한 이미지가 출력될 수 있도록 하였다. _~~(썸네일의 썸네일)~~_

## **제품 슬라이드**

![](https://velog.velcdn.com/images/drrobot409/post/ec454abd-19bc-403d-ae31-fa315941cf52/image.png)
컬렉션에 포함된 제품 목록을 슬라이드로 구현하였다.

이전 프로젝트에서도 슬라이드를 구현할 일이 몇 번 있었는데 개인 홈페이지를 만들 때는 Swiper 라이브러리를 사용했었고 그 이후에 만든 Splatoon 3 홈페이지 클론에서는 외부 라이브러리의 도움 없이 직접 구현했었다. 이번에 만든 슬라이드 역시 직접 구현해 보았다.

사실 슬라이드 기능 자체는 버튼을 클릭하면 슬라이드 컨테이너를 좌우로 `(아이템 너비 * n)` 만큼 이동 시키는게 다라서 구현하기 어렵지 않지만 슬라이드를 **반응형**으로 만드는 것과 **드래그** 기능을 구현하는 점은 조금 귀찮을 수 있다.

### **반응형 슬라이드**

![](https://velog.velcdn.com/images/drrobot409/post/6c22f7cd-c946-48c9-887d-16e69256dcc5/image.png)

슬라이드를 반응형으로 만들 때 가장 중요한 부분은 뷰포트 너비에 따라 가변하는 아이템의 너비를 정확하게 전달할 수 있는가에 있다. 그 너비가 정확해야 슬라이드가 의도한 만큼 움직이고 멈추기 때문이다.

아이템의 너비를 구하는 근본적인 방법은 아래와 같다.

`(슬라이드 페이지 너비 / 한 페이지에 표시할 아이템의 수)`

만약 아이템들 사이에 여백이 존재하지 않는다면 여기서 끝이지만 여백이 존재한다면 그 여백까지 추가로 계산해 주어야 한다.

여기서 한 가지 간단한 팁이 있는데, 아이템 사이에 여백을 줄 때 `gap`이나 `margin` 등 외부 여백을 사용하는 대신 `padding` 을 사용해 각 아이템의 내부에 여백을 주면 별도로 여백을 계산할 필요가 없어진다. 그러면 아이템의 스타일을 마구 변경해도 아이템의 너비 구하는 공식은 변하지 않기 때문에 유지보수에도 유리하다.

### **슬라이드 드래그**

모바일 환경에서 자연스럽게 작동되기 위해서는 드래그를 통해 페이지를 전환할 수 있어야 한다.

드래그 기능은 컨테이너의 스크롤과 `scoll-snap` 을 통해 구현하 수 있을 것 같긴 하지만 시도해 보지는 않았다. 어차피 마우스로 드래그를 하려면 별도의 JS 코드가 개입해야 할 것이고, `scoll-snap` 때문에 드래그 구현보다 반응형으로 만드는게 더 번거로울 것 같았기 때문이다.

내가 사용한 방법은 터치 이벤트를 통해 터치 이동 거리만큼 슬라이드를 이동시키고, 터치가 끝나면 현재 슬라이드 위치에서 가장 가까운 페이지로 슬라이드를 재정렬하는 방식이다.

드래그의 진행 단계에 따라 이벤트 리스너를 추가하고 슬라이드를 제어하면 된다.

1. **touchstart**

   - 터치 시작 좌표를 저장

   - touchmove와 touchend 이벤트 리스너를 등록

   - 슬라이드에 `transition` 이 적용되어 있다면 이 단계에서 비활성화 해야 드래그 시 움직임이 자연스럽다.

2. **touchmove**

   - 터치 시작 좌표와 현재 좌표를 계산하여 이동 거리를 저장

   - 슬라이드의 초기 위치에서 계산한 이동 거리만큼 슬라이드 이동

3. **touchend**

   - touchmove 이벤트 리스너 제거

   - 비활성화한 `transition` 복구

   - 슬라이드의 현재 위치에서 가장 가까운 페이지로 페이지 재정렬

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

    setDragging(false);

    // 현재 슬라이드 위치에서 가장 가까운 페이지로 페이지 적용
    const newPage = slidePage + Math.round(touchMoveX / -slideItemWidth);
    setSlidePage(newPage <= 0 ? 0 : newPage >= maxPage ? maxPage : newPage);
    moveSlide();

    window.removeEventListener("touchmove", touchMoveListener);
  };

  const touchStartListener = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();

    setAutoSlide(false);
    setDragging(true);

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

마우스로 드래그할 수 있도록 적용하고 싶다면 이벤트와 값 등을 마우스 관련 내용으로 대체하여 같은 내용의 리스너를 추가하면 된다.

다만 마우스의 경우 아이템에 링크가 걸려있으면 드래그가 끝날 때(`mouseup`) 클릭 이벤트가 트리거되어 마우스의 위치에 있는 아이템의 링크로 이동된다. 아래의 코드를 `mousemove` 이벤트 리스너에 추가하여 드래그 시 링크 이동을 방지할 수 있다.

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

# **툴바**

![](https://velog.velcdn.com/images/drrobot409/post/35925f9c-7219-4823-9fea-cc9176157337/image.png)

우측 하단에 위치한 toTop, 공유, 관리자 버튼의 모임이다.

## **공유 버튼**

![](https://velog.velcdn.com/images/drrobot409/post/bc59a896-35dc-4f7c-b61f-9f0b1bbbf780/image.png)

**Web Share API**를 이용한 공유 기능을 구현하였다.

![](https://velog.velcdn.com/images/drrobot409/post/5ddbe467-d270-4ede-9457-0ca798cf1fc6/image.png)

API를 지원하는 브라우저의 경우 브라우저에 내장된 공유 기능이 실행되고, 지원하지 않을 경우 링크를 복사한 뒤 복사 되었다는 알림창을 출력하도록 하였다.

```js
const share = async (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  const url = process.env.NEXT_PUBLIC_ABSOLUTE_URL + asPath;

  if (typeof window === "undefined") return;

  if (window.navigator.share) {
    await window.navigator.share({ text: url }).catch((error) => {
      console.error(error);
    });
  } else {
    window.navigator.clipboard.writeText(url).then(() => {
      triggerAlert();
    });
  }
};
```

# **제품 탐색**

전체 제품 혹은 필터와 키워드 등으로 제품을 탐색할 수 있다.

제품의 데이터는 **React-Query** 를 이용해 **Firebase** 에서 불러온다.

적용할 필터는 인터페이스로 제어할 수 있으며 키워드 검색은 네비게이션 바의 검색창을 이용하면 된다.

인터페이스를 이용해 필터를 제어할 경우 **url의 쿼리 스트링**에도 즉시 반영되며, 반대로 url로 필터를 적용해도 인터페이스에 적용된 필터가 반영되도록 하였다.

_예시 : https://raebef.netlify.app/products/categories/clothes/outer?orderby=popularity&gender=all&size=xs+s+m+l&color=gray_

## **필터**

![](https://velog.velcdn.com/images/drrobot409/post/99dc9eea-c2a7-4250-b374-9eae761df0b4/image.png)

필터를 이용해 원하는 제품을 탐색할 수 있다. 우측 상단의 필터 버튼을 눌러 창을 토글할 수 있다.

적용 가능한 필터는 **메인 카테고리, 서브 카테고리, 성별, 사이즈, 색상, 정렬 순서**가 있다. 정렬 순서는 **인기순, 최신순, 가격 높은 순과 낮은 순** 총 4가지 중 선택할 수 있으며, 기본값은 인기순이다.

인기순에서 정렬을 결정하는 값은 판매량이며 사용자가 제품을 주문할 때 실제로 서버의 제품 데이터에서 구매 수량만큼 값이 증가하도록 구현하였다.

사이즈는 복수 선택이 가능하지만 성별과 색상은 전체 혹은 단일 선택만 가능하도록 만들었는데, 이는 파이어 베이스 쿼리 성능의 한계로 인한 어쩔 수 없는 결정이었다. **Firestore에서 배열 탐색절은 쿼리문당 최대 1개만 사용**할 수 있기 때문이다.

색상을 복수 선택할 수 있다면 좋았겠지만 제품 데이터 구조상 사이즈는 배열이기 때문에 사이즈를 탐색하기 위해서는 어차피 `array-contains` 절을 사용해야 하고 이 시점에서 배열 탐색절 개수 한계에 도달한다. 결국 울며 겨자먹기로 사이즈에 복수 선택 기능을 부여할 수 밖에 없었다.

## **키워드 검색**

![](https://velog.velcdn.com/images/drrobot409/post/c4bdce67-93c2-4cad-b637-1975317e87bb/image.png)

검색의 경우 네비게이션 바에 위치한 검색창을 이용하면 된다.

검색 기능은 제품의 태그에 검색 키워드가 존재하는지 탐색하여 일치하는 결과를 출력한다.

태그는 제품을 등록/수정할 때 기본적으로 카테고리와 서브 카테고리, 제품명, 성별 등이 자동 생성되며 그 외에 원하는 태그를 입력할 수도 있다.

검색 기능에도 배열 탐색절이 사용되기 때문에 필터와 병행하는데 제약이 많다. 따라서 키워드 검색 시 필터는 사용할 수 없도록 제한하였다.

# **제품 목록**

![](https://velog.velcdn.com/images/drrobot409/post/67afcc9b-77c3-41d7-9bac-af3a81b5b316/image.png)

제품을 탐색할 때 나열되는 제품의 목록이다.

## **무한 스크롤**

![](https://velog.velcdn.com/images/drrobot409/post/a1767b7a-df5b-41d8-8451-618c6dc397c3/image.png)

버튼 클릭 시 무한 스크롤이 트리거 되어 스크롤을 내리면 다음 제품 목록을 불러오도록 구현하였다.

기능의 구현에는 **React-Query** 의 `useInfiniteQuery`를 사용하였다.

### **스크롤 복원**

무한 스크롤은 그 특성상 스크롤 복원 기능이 함께 구현되지 않으면 UX가 썩 좋지 않다.

불러온 데이터의 `cacheTime` 과 `staleTime` 을 늘려 매 번 데이터가 새로고침 되는 것을 방지하고 Next.js의 scroll restoration을 통해 스크롤 복원 기능을 구현하였다.

![](https://velog.velcdn.com/images/drrobot409/post/29bc3c91-522e-478c-86fd-c1af178216da/image.png)

또한 목록 페이지 로딩 시 의도치 않게 페이지의 높이가 초기화되는 것을 방지하기 위해 로드 된 제품의 개수를 `localStorage` 에 저장하고 페이지 로딩 중 그 개수만큼 스켈레톤을 출력하여 그 높이를 유지하였다.

# **스켈레톤 로더**

![](https://velog.velcdn.com/images/drrobot409/post/638c4627-38ca-4aa8-b446-39355e87222b/image.png)

좋은 UX를 위해서는 데이터를 불러올 때 빈 화면 대신 로딩 화면을 출력하는 것이 좋다. 스켈레톤 로더는 이 로딩 화면의 방식 중 한가지로, 내용을 불러오기 전까지 내용이 없는 뼈대를 대신 출력하는 방법이다.

스켈레톤 로더를 구현하는데에는 아마 여러 방법이 존재하겠지만, 내가 사용한 방법은 스켈레톤 컴포넌트를 별도로 생성하여 로딩 중에 대신 렌더링하는 것이다.

이 방법의 단점은 페이지의 스타일이 변경될 경우 스켈레톤 컴포넌트의 스타일도 직접 수정해주어야 하기 때문에 유지보수 측면에서 썩 좋지는 않다는 점이다. 어차피 뼈대만 출력하기 때문에 세부적인 스타일은 크게 중요하지 않지만 레이아웃은 어느 정도 확립된 후에 작업하는 것이 좋다.

![](https://velog.velcdn.com/images/drrobot409/post/29016bc2-ec70-47ac-9469-3176016ad912/image.png)

![](https://velog.velcdn.com/images/drrobot409/post/e03df998-ebe4-44c6-a235-e346c8b81207/image.png)

프로젝트에서 스켈레톤 로더를 적용한 부분은 홈 화면, 제품 목록, 장바구니, 주문 내역 등이다.

# **북마크**

![](https://velog.velcdn.com/images/drrobot409/post/9449dc68-6cdc-40f6-bb4a-62c12474ea84/image.png)

![](https://velog.velcdn.com/images/drrobot409/post/727d995c-93b0-435d-9533-5bbd3c10d68c/image.png)

관심있는 제품을 따로 저장해 둘 때 사용하는 기능으로 장바구니와는 용도가 사뭇 다른 기능이다.

북마크한 **제품의 id를 유저 데이터의 bookmark 필드에 저장**하는 방법으로 구현하였으며 아이콘을 구분하여 북마크 전/후를 식별할 수 있도록 하였다.

## **북마크 낙관적 업데이트 (React-Query)**

북마크 추가의 프로세스는 대략 아래와 같다.

1. 북마크 버튼을 누른다.
2. 서버와 통신해 해당 제품 id를 북마크 필드에 추가한다.
3. 업데이트 된 북마크 필드를 다시 불러온다.
4. 아이콘이 업데이트된다.

하지만 유저가 북마크 기능을 사용할 때 실제로 보여지는 과정은 아래와 같다.

1. 북마크 버튼을 누른다.
2. 아이콘이 업데이트 된다.

따라서 눈에 보이지 않는 중간 과정이 길어질수록 버튼의 피드백 딜레이도 길어지고 유저는 사이트가 느리다는 생각을 갖게 된다.

이 피드백을 최대한 앞당기기 위해서는 중간 과정에 소요되는 시간을 줄이는 것이 가장 좋은 방법이지만, 서버 통신과 같은 요인은 소요 시간을 줄이는데 한계가 있다. 하지만 **낙관적 업데이트**를 사용하면 이 한계를 뛰어넘을 수 있다.

낙관적 업데이트는 이름 그대로 서버에 요청한 데이터의 업데이트가 당연히 성공할 것이라는 초긍정 마인드와 함께 **클라이언트의 데이터를 먼저 업데이트** 해버리는 방법이다. 북마크 추가 프로세스에서 가장 큰 시간을 차지할 것으로 예상되는 서버 통신을 기다리지 않고 데이터를 업데이트 하기 때문에 거의 즉각적인 피드백을 기대할 수 있다.

당연히 성공할 것으로 예상하고 실행하는 업데이트이기 때문에 웬만하면 성공 할만한 요청에 사용하는 것이 좋지만 실패할 경우에 대비해 업데이트를 롤백할 부분도 생각해두어야 한다.

```js
const add = useMutation(addBookmark, {
  // 결과에 관계 없이 mutation 완료시 쿼리 무효화(다시 쿼리 요청)
  onSettled: () =>
    queryClient.invalidateQueries({
      queryKey: ["user"],
      refetchInactive: true,
    }),
  // 낙관적 업데이트
  onMutate: async ({ productId }) => {
    // 낙관적 업데이트에 앞서 쿼리 취소
    await queryClient.cancelQueries({ queryKey: ["user"] });
    // 기존 데이터
    const prevData: UserData | undefined = queryClient.getQueryData(["user"]);
    // 업데이트 적용 데이터
    const newData = {
      ...prevData,
      bookmark: prevData?.bookmark
        ? [...prevData?.bookmark, productId]
        : [productId],
    };
    // 업데이트 실시
    queryClient.setQueryData(["user"], () => newData);

    // 에러를 대비해 기존 데이터 킵
    return { prevData };
  },
  // 에러시 롤백
  onError: (error, payload, context) => {
    queryClient.setQueryData("user", context?.prevData);
  },
});
```

# **제품 상세 페이지**

![](https://velog.velcdn.com/images/drrobot409/post/3f9f5ca4-bee0-49e3-9235-d2cfb0a27a29/image.png)

제품 상세 페이지이지만 여타 쇼핑몰이 그렇듯 상세 정보는 보통 이미지로 대체하기 때문에 별게 없어서 캡쳐하지 않았다.

![](https://velog.velcdn.com/images/drrobot409/post/f9476cf9-2c5c-4922-bfc7-db5d6921a54d/image.png)

제품 상세 페이지는 구매와 직결된 여러 중요한 버튼과 기능들이 집결되어 있기 때문에 모바일 환경을 고려한 반응형에 나름 신경을 써보았다.

## **정적 페이지 생성**

제품 페이지는

## **옵션 선택**

![](https://velog.velcdn.com/images/drrobot409/post/08f15500-4644-44a8-8595-f60681ece5a7/image.png)

![](https://velog.velcdn.com/images/drrobot409/post/828974a7-8769-41fe-9f47-b25f05f293f4/image.png)
