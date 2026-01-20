// 할 일 데이터 관리
let todos = [];
let currentFilter = 'all';

// DOM 요소
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');

// 로컬 스토리지에서 데이터 불러오기
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
    renderTodos();
}

// 로컬 스토리지에 데이터 저장하기
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// 할 일 추가
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    todoInput.value = '';
    saveTodos();
}

// 할 일 삭제
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
}

// 할 일 완료 상태 토글
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
}

// 완료된 항목 모두 삭제
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
}

// 필터링된 할 일 목록 가져오기
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// 할 일 목록 렌더링
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <li class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">
                    ${currentFilter === 'all' ? '할 일이 없습니다. 새로운 할 일을 추가해보세요!' : 
                      currentFilter === 'active' ? '진행중인 할 일이 없습니다.' : 
                      '완료된 할 일이 없습니다.'}
                </div>
            </li>
        `;
    } else {
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
            </li>
        `).join('');
    }
    
    // 통계 업데이트
    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.filter(todo => todo.completed).length;
    todoCount.textContent = `진행중: ${activeCount}개 | 완료: ${completedCount}개 | 전체: ${todos.length}개`;
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 필터 변경
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderTodos();
}

// 이벤트 리스너
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// 전역 함수로 노출 (인라인 이벤트 핸들러용)
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

// 초기화
loadTodos();
