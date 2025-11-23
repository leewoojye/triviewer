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

    // add click handler to open feed modal for the date
    cell.style.cursor = 'pointer';
    cell.dataset.date = i;
    cell.addEventListener('click', function() {
        openFeedModal(i);
    });

    calendarGrid.appendChild(cell);
}

/* === Calendar date -> open feed modal logic === */
function createFeedCard(item) {
    const card = document.createElement('div');
    card.className = 'feed-card';
    // top: user info
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.style.background = item.avatarColor || '#d35400';
    avatar.innerText = item.avatarText || '홍';
    const span = document.createElement('span');
    span.innerText = item.user || '팀원';
    userInfo.appendChild(avatar);
    userInfo.appendChild(span);

    // main area: photo on left, meta on right
    const mainArea = document.createElement('div');
    mainArea.style.display = 'flex';
    mainArea.style.gap = '12px';
    mainArea.style.alignItems = 'flex-start';

    const photo = document.createElement('div');
    photo.className = 'feed-img-placeholder';
    photo.style.minWidth = '360px';
    photo.style.height = '180px';
    photo.style.borderRadius = '12px';
    photo.style.display = 'flex';
    photo.style.justifyContent = 'center';
    photo.style.alignItems = 'center';
    photo.style.fontSize = '20px';
    photo.innerHTML = item.imageLabel || '사진';

    const meta = document.createElement('div');
    meta.style.display = 'flex';
    meta.style.flexDirection = 'column';
    meta.style.gap = '10px';

    const insertBtn = document.createElement('button');
    insertBtn.innerText = '+삽입';
    insertBtn.style.alignSelf = 'flex-end';
    insertBtn.style.background = 'var(--secondary-brown)';
    insertBtn.style.color = '#fff';
    insertBtn.style.border = 'none';
    insertBtn.style.padding = '8px 12px';
    insertBtn.style.borderRadius = '8px';

    const recLabel = document.createElement('div');
    recLabel.style.fontWeight = '700';
    recLabel.style.marginTop = '6px';
    recLabel.innerText = '추천시간대';

    const timePill = document.createElement('div');
    timePill.style.display = 'inline-block';
    timePill.style.padding = '6px 12px';
    timePill.style.borderRadius = '20px';
    timePill.style.background = '#fff3e0';
    timePill.style.color = 'var(--primary-brown)';
    timePill.style.border = '1px solid rgba(93,64,55,0.08)';
    timePill.innerText = item.recommendTime || '오후 3시';

    // tags chips
    const tags = document.createElement('div');
    tags.className = 'tags';
    (item.tags || []).forEach(t => {
        const s = document.createElement('span');
        s.className = 'tag';
        s.innerText = t;
        tags.appendChild(s);
    });

    meta.appendChild(insertBtn);
    meta.appendChild(recLabel);
    meta.appendChild(timePill);
    meta.appendChild(tags);

    mainArea.appendChild(photo);
    mainArea.appendChild(meta);

    // actions row (like/comment)
    const actions = document.createElement('div');
    actions.className = 'actions';
    const likeBtn = document.createElement('button');
    likeBtn.onclick = function() { toggleHeart(this); };
    likeBtn.innerHTML = '<i class="far fa-heart"></i>';
    const comBtn = document.createElement('button');
    comBtn.innerHTML = '<i class="far fa-comment"></i>';
    actions.appendChild(likeBtn);
    actions.appendChild(comBtn);

    card.appendChild(userInfo);
    card.appendChild(mainArea);
    card.appendChild(actions);
    // comments area
    const commentList = document.createElement('div');
    commentList.className = 'comment-list';
    // sample existing comments (could be empty)
    (item.comments || []).forEach(c => {
        const ci = document.createElement('div');
        ci.className = 'comment-item';
        ci.innerHTML = `<div class="c-avatar"></div><div class="c-body">${c}</div>`;
        commentList.appendChild(ci);
    });

    // input area
    const commentInputWrap = document.createElement('div');
    commentInputWrap.className = 'comment-input';
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = '의견달기';
    const commentSend = document.createElement('button');
    commentSend.innerText = '전송';
    commentInputWrap.appendChild(commentInput);
    commentInputWrap.appendChild(commentSend);

    // handler to add comment
    function addComment(text) {
        if (!text || !text.trim()) return;
        const ci = document.createElement('div');
        ci.className = 'comment-item';
        ci.innerHTML = `<div class="c-avatar"></div><div class="c-body">${text}</div>`;
        commentList.appendChild(ci);
        commentList.scrollTop = commentList.scrollHeight;
    }

    commentSend.addEventListener('click', function() {
        addComment(commentInput.value);
        commentInput.value = '';
        commentInput.focus();
    });
    commentInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addComment(commentInput.value);
            commentInput.value = '';
        }
    });

    card.appendChild(commentList);
    card.appendChild(commentInputWrap);
    return card;
}

function renderFeedCardsForDate(date) {
    // For now, create sample items. In real app, fetch data for the date.
    const items = [
        { avatarText: '홍', user: '지역 상품 기획팀 홍길동', imageLabel: '답사 사진 (황대선사)', tags: ['#추천시간대_오후3시', '#힐링', '#등산'], avatarColor: '#d35400' },
        { avatarText: '김', user: '지역 팀 김철수', imageLabel: '현장 스냅 (구룡공원)', tags: ['#포토스팟', '#가벼운산책'], avatarColor: '#6a1b9a' }
    ];
    return items.map(i => createFeedCard(i));
}

function openFeedModal(date) {
    const modal = document.getElementById('feed-modal');
    const body = document.getElementById('feed-modal-body');
    const title = document.getElementById('feed-modal-title');
    if (!modal || !body || !title) return;

    // clear
    body.innerHTML = '';
    title.innerText = `${date}일 현장 답사 기록`;

    const cards = renderFeedCardsForDate(date);
    cards.forEach(c => body.appendChild(c));

    modal.style.display = 'flex';

    // close handlers
    const closeBtn = document.getElementById('feed-modal-close');
    if (closeBtn) closeBtn.onclick = closeFeedModal;
    modal.onclick = function(e) {
        if (e.target === modal) closeFeedModal();
    };
}

function closeFeedModal() {
    const modal = document.getElementById('feed-modal');
    if (modal) modal.style.display = 'none';
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
function formatTimestamp(date) {
    try {
        const opts = { month: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true };
        // e.g. "11월 23일 (일) 오전 10:55"
        const parts = new Intl.DateTimeFormat('ko-KR', opts).formatToParts(date);
        const month = parts.find(p => p.type === 'month').value;
        const day = parts.find(p => p.type === 'day').value;
        const weekday = parts.find(p => p.type === 'weekday').value;
        const dayPeriod = parts.find(p => p.type === 'dayPeriod').value;
        const hour = parts.find(p => p.type === 'hour').value;
        const minute = parts.find(p => p.type === 'minute').value.padStart(2, '0');
        return `${month}월 ${day}일 (${weekday}) ${dayPeriod} ${hour}:${minute}`;
    } catch (e) {
        return date.toLocaleString('ko-KR');
    }
}

function addRandomMessage(role, text) {
    const list = document.getElementById('random-chat');
    if (!list) return;

    if (role === 'q') {
        const ts = document.createElement('div');
        ts.className = 'chat-timestamp';
        ts.innerText = formatTimestamp(new Date());
        list.appendChild(ts);

        const msg = document.createElement('div');
        msg.className = 'bubble left';
        msg.innerText = text;
        list.appendChild(msg);
    } else {
        const msg = document.createElement('div');
        msg.className = 'bubble right';
        msg.innerText = text;
        list.appendChild(msg);
    }

    // scroll to bottom
    list.scrollTop = list.scrollHeight;
}

function generateQuestion() {
    const randomIdx = Math.floor(Math.random() * questions.length);
    addRandomMessage('q', questions[randomIdx]);
}

function sendRandomReply() {
    const input = document.getElementById('random-input');
    if (!input) return;
    const text = input.value.trim();
    if (text === '') return;
    addRandomMessage('a', text);
    input.value = '';
}

// attach Enter key handler for the input
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('random-input');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendRandomReply();
            }
        });
    }

    // initial sample question
    generateQuestion();
});

/* === 10. 주제소통 입력 처리: comm typing field === */
function sendCommMessage() {
    const input = document.getElementById('comm-input');
    if (!input) return;
    const text = input.value.trim();
    if (text === '') return;

    // find active comm panel canvas
    const canvas = document.querySelector('.comm-panel.active .comm-canvas');
    if (!canvas) return;

    const msg = document.createElement('div');
    msg.className = 'bubble right';
    msg.innerText = text;
    canvas.appendChild(msg);
    canvas.scrollTop = canvas.scrollHeight;
    input.value = '';
    input.focus();
}

// Enter key support for comm input
document.addEventListener('DOMContentLoaded', function() {
    const commInput = document.getElementById('comm-input');
    if (commInput) {
        commInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendCommMessage();
            }
        });
    }
});

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