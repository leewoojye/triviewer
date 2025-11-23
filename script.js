/* === 1. 네비게이션 및 탭 전환 로직 === */
function showSection(sectionId) {
    // 모든 페이지 숨기기
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // 선택된 페이지 보이기
    document.getElementById(sectionId).classList.add('active');

    // 사이드바 메뉴 활성화 스타일 변경
    document.querySelectorAll('.menu li').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

function switchSubTab(tabId) {
    // 서브 탭 컨텐츠 숨기기
    document.querySelectorAll('.sub-content').forEach(content => {
        content.classList.remove('active');
    });
    // 선택된 탭 보이기
    document.getElementById(tabId).classList.add('active');

    // 버튼 스타일 변경
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

/* === 9. 주제소통 / 일상소통 탭 전환 로직 === */
function switchCommTab(tabName) {
    // panels
    document.querySelectorAll('.comm-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('comm-' + tabName).classList.add('active');

    // buttons
    document.querySelectorAll('.comm-tab-btn').forEach(b => b.classList.remove('active'));
    // find the button that has matching text or onclick
    document.querySelectorAll('.comm-tab-btn').forEach(b => {
        if (b.innerText.replace(/\s/g, '') === (tabName === 'topic' ? '주제소통' : '일상소통')) {
            b.classList.add('active');
        }
    });
}

// Ensure default state for comm when page first loaded
document.addEventListener('DOMContentLoaded', function() {
    // If user navigates directly to comm, set panels
    if (document.getElementById('comm')) {
        switchCommTab('topic');
    }
});

/* === 2. 캘린더 생성 (PDF 내용 반영: 2026년 1월) === */
const calendarGrid = document.getElementById('calendar');
const days = ['일', '월', '화', '수', '목', '금', '토'];

// 캘린더 헤더 생성
days.forEach(day => {
    const div = document.createElement('div');
    div.className = 'cal-cell cal-header';
    div.innerText = day;
    calendarGrid.appendChild(div);
});

// 2026년 1월 달력 (1일은 목요일)
// 빈 칸 4개 (일, 월, 화, 수)
for (let i = 0; i < 4; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-cell';
    calendarGrid.appendChild(empty);
}

// 1일부터 31일까지 생성
for (let i = 1; i <= 31; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    cell.innerText = i;

    // PDF의 출장 일정 추가
    // 1/5 ~ 1/7 Japan Tokyo Tour
    if (i >= 5 && i <= 7) {
        const event = document.createElement('span');
        event.className = 'event-bar';
        event.innerText = 'Japan Tokyo Tour';
        event.style.backgroundColor = '#3498db';
        cell.appendChild(event);
    }
    // 1/27 ~ 1/29 China Beijing Tour
    if (i >= 27 && i <= 29) {
        const event = document.createElement('span');
        event.className = 'event-bar';
        event.innerText = 'China Beijing Tour';
        event.style.backgroundColor = '#e74c3c';
        cell.appendChild(event);
    }

    calendarGrid.appendChild(cell);
}

/* === 3. 여행 기록 좋아요 기능 === */
function toggleHeart(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = 'red';
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '#555';
    }
}

/* === 4. 동선 최적화 로직 === */
let currentRoute = [];
let totalMinutes = 0;

function addToRoute(name, time, cost, rating) {
    // 배열에 추가
    currentRoute.push({ name, time });
    totalMinutes += time;

    renderRoute();
}

function renderRoute() {
    const list = document.getElementById('planned-route');
    const timeDisplay = document.getElementById('total-time');
    
    list.innerHTML = '';
    
    if (currentRoute.length === 0) {
        list.innerHTML = '<li class="empty-msg">장소를 클릭하여 추가하세요.</li>';
        timeDisplay.innerText = '0';
        return;
    }

    currentRoute.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'route-item';
        li.innerHTML = `<span>${index + 1}. ${item.name}</span> <small>${item.time}분</small>`;
        list.appendChild(li);
    });

    timeDisplay.innerText = totalMinutes;
}

/* === 5. 테마 기획: 브레인스토밍 === */
function addKeyword() {
    const input = document.getElementById('brainstorm-input');
    const container = document.getElementById('keyword-container');
    
    if (input.value.trim() !== "") {
        const span = document.createElement('span');
        span.className = 'keyword';
        span.innerText = input.value;
        container.appendChild(span);
        input.value = '';
    }
}

/* === 6. 테마 기획: 랜덤 질문 === */
const questions = [
    "좋아하는 문학은 무엇인가요?",
    "최근에 관심이 생긴 취미는?",
    "가장 기억에 남는 여행지는?",
    "스트레스를 푸는 나만의 방법은?",
    "팀원들에게 추천하고 싶은 영화는?"
];

function generateQuestion() {
    const display = document.getElementById('random-q');
    const randomIdx = Math.floor(Math.random() * questions.length);
    display.innerText = questions[randomIdx];
}
// 초기 실행
generateQuestion();

/* === 7. 테마 기획: AI 추천 시뮬레이션 === */
function getAIRecommendation() {
    const keyword = document.getElementById('ai-keyword').value;
    const resultBox = document.getElementById('ai-result');

    let text = "";
    if (keyword.includes("등산") || keyword.includes("산")) {
        text = "<strong>[AI 추천]</strong> '한라산', '북한산', '설악산'을 추천합니다. 자연 경관과 함께하는 트레킹 코스를 기획해보세요.";
    } else if (keyword.includes("물") || keyword.includes("바다")) {
        text = "<strong>[AI 추천]</strong> '스킨스쿠버', '수상스키', '서핑' 활동을 추천합니다. 제주도나 양양 해변이 적합합니다.";
    } else if (keyword.includes("힐링")) {
        text = "<strong>[AI 추천]</strong> '템플스테이', '숲속 요가', '티 클래스'를 추천합니다.";
    } else {
        text = "<strong>[AI]</strong> 더 구체적인 키워드(예: 등산, 휴식, 액티비티)를 입력해주시면 알맞은 장소를 추천해드려요.";
    }

    resultBox.innerHTML = text;
}

/* === 8. 투표 기능 === */
function vote(choice) {
    const resultDiv = document.getElementById('vote-result');
    if (choice === 'yes') {
        resultDiv.innerHTML = "<h4 style='color:green;'>승인되었습니다! 🎉</h4><p>기획안이 다음 단계로 넘어갑니다.</p>";
    } else {
        resultDiv.innerHTML = "<h4 style='color:red;'>보류되었습니다.</h4><p>팀원들과 추가 논의가 필요합니다.</p>";
    }
}