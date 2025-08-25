// 月曆應用程式主要邏輯
class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.currentYear = 2025;
        this.currentMonth = 7; // 8月 (0-based)
        this.today = new Date();
        
        // 課程數據 - 根據課程表
        this.courses = {
            'DNS001': {
                name: 'DNS001',
                title: '數據科學前沿分析研究',
                day: 2, // 星期二
                time: '09:00-12:00',
                color: 'dns001',
                location: 'N104'
            },
            'DNS002': {
                name: 'DNS002', 
                title: '數據挖掘理論、系統與技術',
                day: 4, // 星期四
                time: '15:30-18:30',
                color: 'dns002',
                location: 'N104'
            },
            'DNS003': {
                name: 'DNS003',
                title: '大數據決策與應用', 
                day: 1, // 星期一
                time: '12:15-15:15',
                color: 'dns003',
                location: 'N104'
            },
            'DNS016': {
                name: 'DNS016',
                title: '智慧城市發展的數據建築',
                day: 5, // 星期五  
                time: '09:00-12:00',
                color: 'dns016',
                location: 'N104'
            }
        };
        
        // 課程期間：2025年8月25日至12月6日
        this.semesterStart = new Date(2025, 7, 25); // 8月25日
        this.semesterEnd = new Date(2025, 11, 6);   // 12月6日
        
        // 工作時間表：2025年8月1日至11月30日
        this.workStart = new Date(2025, 7, 1);     // 8月1日
        this.workEnd = new Date(2025, 10, 30);     // 11月30日
        
        // 工作班次定義（5天循環）
        this.workShifts = [
            { name: '休息日', time: '', type: 'rest', color: 'rest' },
            { name: '晚上更', time: '18:00-24:00', type: 'evening', color: 'work-evening' },
            { name: '下午更', time: '11:55-18:25', type: 'afternoon', color: 'work-afternoon' },
            { name: '早上更', time: '06:25-12:25', type: 'morning', color: 'work-morning' },
            { name: '通宵更', time: '23:35-06:45', type: 'overnight', color: 'work-overnight' }
        ];
        
        // 校曆重要日期
        this.schoolEvents = {
            '2025-08-25': {
                type: 'event',
                title: '開學升旗儀式',
                description: '地點：中葡樓花園\n對象：全校學生',
                time: '全天'
            },
            '2025-09-06': {
                type: 'event', 
                title: '迎新行者活動開始',
                description: '地點：澳門各歷史文化景點、黑沙海灘、氹仔校區\n對象：新生',
                time: '全天'
            },
            '2025-09-07': {
                type: 'event',
                title: '迎新行者活動結束', 
                description: '地點：澳門各歷史文化景點、黑沙海灘、氹仔校區\n對象：新生',
                time: '全天'
            },
            '2025-09-12': {
                type: 'event',
                title: '交換生歡迎會',
                description: '地點：CLG201A 及 CLG201B\n對象：國際學生、歷屆和應屆交流學生',
                time: '16:00-18:00'
            },
            '2025-09-15': {
                type: 'event',
                title: '交換項目宣講會', 
                description: '地點：HG01 會議廳\n對象：全校學生',
                time: '16:00-17:00'
            },
            '2025-10-01': {
                type: 'holiday',
                title: '國慶假期',
                description: '中華人民共和國國慶節',
                time: '全天'
            },
            '2025-12-06': {
                type: 'event',
                title: '學期結束',
                description: '第一學期課程結束',
                time: '全天'
            }
        };
        
        // 月份名稱
        this.monthNames = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderCalendar();
        this.updateCurrentDate();
        
        // 設置定時器更新當前時間
        setInterval(() => {
            this.updateCurrentDate();
        }, 60000); // 每分鐘更新一次
    }
    
    bindEvents() {
        // 月份導航按鈕
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.navigateMonth(-1);
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.navigateMonth(1);
        });
        
        // 返回今天按鈕
        document.getElementById('todayBtn').addEventListener('click', (e) => {
            this.createRippleEffect(e);
            this.goToToday();
        });
        
        // 模態框關閉
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });
        
        // 點擊模態框外部關閉
        document.getElementById('eventModal').addEventListener('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.closeModal();
            }
        });
        
        // ESC鍵關閉模態框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    navigateMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        
        // 限制顯示範圍：2025年8月到12月
        if (this.currentYear < 2025 || (this.currentYear === 2025 && this.currentMonth < 7)) {
            this.currentYear = 2025;
            this.currentMonth = 7;
        } else if (this.currentYear > 2025 || (this.currentYear === 2025 && this.currentMonth > 11)) {
            this.currentYear = 2025;
            this.currentMonth = 11;
        }
        
        this.renderCalendar();
    }
    
    createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = button.querySelector('.today-btn-ripple');
        
        // 重設漣漪效果
        ripple.style.width = '0';
        ripple.style.height = '0';
        
        // 強制重繪
        ripple.offsetHeight;
        
        // 觸發漣漪動畫
        setTimeout(() => {
            ripple.style.width = '200px';
            ripple.style.height = '200px';
        }, 10);
        
        // 動畫結束後重設
        setTimeout(() => {
            ripple.style.width = '0';
            ripple.style.height = '0';
        }, 600);
    }
    
    goToToday() {
        const today = new Date();
        this.currentYear = today.getFullYear();
        this.currentMonth = today.getMonth();
        
        // 限制顯示範圍：2025年8月到12月
        if (this.currentYear < 2025 || (this.currentYear === 2025 && this.currentMonth < 7)) {
            this.currentYear = 2025;
            this.currentMonth = 7;
        } else if (this.currentYear > 2025 || (this.currentYear === 2025 && this.currentMonth > 11)) {
            this.currentYear = 2025;
            this.currentMonth = 11;
        }
        
        this.renderCalendar();
        
        // 添加一個小動畫效果提示用戶已跳轉到今天
        const todayElement = document.querySelector('.day.today');
        if (todayElement) {
            todayElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                todayElement.style.transform = '';
            }, 300);
        }
    }
    
    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const monthYearElement = document.getElementById('monthYear');
        
        // 更新月份標題
        monthYearElement.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
        
        // 清空網格
        grid.innerHTML = '';
        
        // 獲取本月第一天和最後一天
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // 添加上個月的空白日期
        const prevMonth = new Date(this.currentYear, this.currentMonth - 1, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(
                daysInPrevMonth - i, 
                true, 
                this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear,
                this.currentMonth === 0 ? 11 : this.currentMonth - 1
            );
            grid.appendChild(dayElement);
        }
        
        // 添加本月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createDayElement(day, false, this.currentYear, this.currentMonth);
            grid.appendChild(dayElement);
        }
        
        // 添加下個月的空白日期
        const totalCells = grid.children.length;
        const remainingCells = 42 - totalCells; // 6週 × 7天
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(
                day, 
                true, 
                this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear,
                this.currentMonth === 11 ? 0 : this.currentMonth + 1
            );
            grid.appendChild(dayElement);
        }
        
        // 添加淡入動畫
        grid.classList.add('fade-in');
        setTimeout(() => {
            grid.classList.remove('fade-in');
        }, 500);
    }
    
    createDayElement(day, isOtherMonth, year, month) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        
        const date = new Date(year, month, day);
        const dateString = this.formatDate(date);
        
        // 保存日期引用以供後續使用
        dayElement._date = date;
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        } else {
            // 檢查是否是今天
            if (this.isToday(date)) {
                dayElement.classList.add('today');
            }
            
            // 檢查是否是週末
            if (this.isWeekend(date)) {
                dayElement.classList.add('weekend');
            }
            
            // 檢查是否有學校活動或假期
            if (this.schoolEvents[dateString]) {
                const event = this.schoolEvents[dateString];
                dayElement.classList.add(event.type);
            }
            
            // 檢查是否有課程、工作或其他活動
            const courses = this.getCoursesForDate(date);
            const events = this.getEventsForDate(dateString);
            const workShift = this.getWorkShiftForDate(date);
            
            // 添加工作象限背景
            if (workShift) {
                this.addWorkQuadrants(dayElement, workShift, date, courses);
            }
            
            // 創建課程和活動指示器容器
            if (courses.length > 0 || events.length > 0) {
                this.addIndicators(dayElement, courses, events);
            }
            
            // 添加點擊事件
            dayElement.addEventListener('click', () => {
                this.showDayDetails(date, courses, workShift);
            });
        }
        
        return dayElement;
    }
    
    isToday(date) {
        return date.toDateString() === this.today.toDateString();
    }
    
    isWeekend(date) {
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // 星期日或星期六
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    getCoursesForDate(date) {
        const coursesForDay = [];
        
        // 檢查是否在學期範圍內
        if (date < this.semesterStart || date > this.semesterEnd) {
            return coursesForDay;
        }
        
        const dayOfWeek = date.getDay();
        
        // 檢查每門課程
        Object.values(this.courses).forEach(course => {
            if (course.day === dayOfWeek) {
                coursesForDay.push(course);
            }
        });
        
        return coursesForDay;
    }
    
    getEventsForDate(dateString) {
        const eventsForDay = [];
        
        if (this.schoolEvents[dateString]) {
            const event = this.schoolEvents[dateString];
            eventsForDay.push({
                type: event.type,
                color: event.type,
                title: event.title
            });
        }
        
        return eventsForDay;
    }
    
    getWorkShiftForDate(date) {
        // 檢查是否在工作期間內
        if (date < this.workStart || date > this.workEnd) {
            return null;
        }
        
        // 計算從工作開始日期（8月1日）到當前日期的天數
        const startDate = new Date(2025, 7, 1); // 8月1日
        const diffTime = date.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // 計算在5天循環中的位置（0-4）
        const cyclePosition = diffDays % 5;
        
        // 返回對應的班次
        return this.workShifts[cyclePosition];
    }
    
    checkTimeConflict(date, workShift, courses) {
        if (!workShift || workShift.type === 'rest') {
            return false;
        }
        
        // 解析工作時間
        const workTimes = this.parseTimeRange(workShift.time);
        if (!workTimes) return false;
        
        // 檢查與每門課程的衝突
        for (const course of courses) {
            const courseTimes = this.parseTimeRange(course.time);
            if (courseTimes && this.isTimeOverlap(workTimes, courseTimes)) {
                return true;
            }
        }
        
        return false;
    }
    
    parseTimeRange(timeString) {
        if (!timeString) return null;
        
        const match = timeString.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
        if (!match) return null;
        
        const startHour = parseInt(match[1]);
        const startMinute = parseInt(match[2]);
        const endHour = parseInt(match[3]);
        const endMinute = parseInt(match[4]);
        
        return {
            start: startHour * 60 + startMinute,
            end: endHour * 60 + endMinute
        };
    }
    
    isTimeOverlap(time1, time2) {
        // 處理跨日情況（通宵更）
        if (time1.end < time1.start) {
            // time1跨日
            return (time1.start <= time2.end || time2.start <= time1.end);
        }
        if (time2.end < time2.start) {
            // time2跨日
            return (time2.start <= time1.end || time1.start <= time2.end);
        }
        
        // 正常情況
        return !(time1.end <= time2.start || time2.end <= time1.start);
    }
    
    addWorkQuadrants(dayElement, workShift, date, courses) {
        // 檢查是否有時間衝突
        const hasConflict = this.checkTimeConflict(date, workShift, courses);
        
        // 添加工作背景類
        dayElement.classList.add('has-work');
        if (hasConflict) {
            dayElement.classList.add('has-conflict');
        }
        
        // 創建工作象限容器
        const quadrantsContainer = document.createElement('div');
        quadrantsContainer.className = 'work-quadrants';
        
        // 創建四個象限
        const quadrants = [
            { class: 'evening', name: '晚上更' },      // 左上
            { class: 'afternoon', name: '下午更' },    // 右上  
            { class: 'morning', name: '早上更' },      // 左下
            { class: 'overnight', name: '通宵更' }     // 右下
        ];
        
        quadrants.forEach(quadrant => {
            const quadrantDiv = document.createElement('div');
            quadrantDiv.className = `work-quadrant ${quadrant.class}`;
            
            // 如果是當前工作班次，添加 active 類
            if (workShift.type === quadrant.class) {
                quadrantDiv.classList.add('active');
                
                // 如果有衝突，添加衝突類
                if (hasConflict) {
                    quadrantDiv.classList.add('conflict');
                }
                
                // 設置工具提示
                const tooltipText = hasConflict ? 
                    `⚠️ 時間衝突: ${workShift.name} (${workShift.time})` : 
                    `${workShift.name} (${workShift.time})`;
                quadrantDiv.title = tooltipText;
            } else if (workShift.type !== 'rest') {
                // 非活動象限顯示班次名稱
                quadrantDiv.title = quadrant.name;
            }
            
            quadrantsContainer.appendChild(quadrantDiv);
        });
        
        // 將工作象限添加到日期元素
        dayElement.appendChild(quadrantsContainer);
    }
    
    addIndicators(dayElement, courses, events) {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'day-indicators';
        
        // 檢查是否有衝突（通過父元素的類名）
        const hasConflict = dayElement.classList.contains('has-conflict');
        
        // 添加課程指示器
        courses.forEach(course => {
            const indicator = document.createElement('div');
            let className = `course-indicator ${course.color}`;
            if (hasConflict) {
                className += ' conflict';
                indicator.title = `⚠️ 時間衝突: ${course.name}`;
            } else {
                indicator.title = `${course.name}: ${course.title}`;
            }
            indicator.className = className;
            indicatorsContainer.appendChild(indicator);
        });
        
        // 添加其他活動指示器
        events.forEach(event => {
            if (event.type !== 'holiday') { // 假期不添加指示器，因為已經有背景色
                const indicator = document.createElement('div');
                indicator.className = `course-indicator ${event.color}`;
                indicator.title = event.title;
                indicatorsContainer.appendChild(indicator);
            }
        });
        
        if (indicatorsContainer.children.length > 0) {
            dayElement.appendChild(indicatorsContainer);
        }
    }
    
    showDayDetails(date, courses, workShift) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        const dateString = this.formatDate(date);
        const displayDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        
        modalTitle.textContent = displayDate;
        
        let content = '';
        
        // 檢查時間衝突
        const hasConflict = workShift && this.checkTimeConflict(date, workShift, courses);
        
        // 顯示時間衝突警告
        if (hasConflict) {
            content += `
                <div class="conflict-warning">
                    <h4><i class="fas fa-exclamation-triangle"></i> 時間衝突警告</h4>
                    <p>⚠️ 工作時間與課程時間有衝突，請注意安排！</p>
                </div>
            `;
        }
        
        // 顯示工作班次
        if (workShift) {
            const conflictClass = hasConflict ? 'conflict' : '';
            content += `
                <div class="work-today ${conflictClass}">
                    <h4><i class="fas fa-briefcase"></i> 今日工作</h4>
                    <div class="work-detail ${workShift.color}">
                        <h5>${workShift.name}</h5>
                        ${workShift.time ? `<p><strong>時間：</strong>${workShift.time}</p>` : '<p>休息日</p>'}
                    </div>
                </div>
            `;
        }
        
        // 顯示學校活動
        if (this.schoolEvents[dateString]) {
            const event = this.schoolEvents[dateString];
            content += `
                <div class="event-item ${event.type}">
                    <h4><i class="fas fa-calendar-day"></i> ${event.title}</h4>
                    <p><strong>時間：</strong>${event.time}</p>
                    <p><strong>詳情：</strong>${event.description}</p>
                </div>
            `;
        }
        
        // 顯示課程
        if (courses.length > 0) {
            const conflictClass = hasConflict ? 'conflict' : '';
            content += `<div class="courses-today ${conflictClass}">`;
            content += '<h4><i class="fas fa-book"></i> 今日課程</h4>';
            
            courses.forEach(course => {
                content += `
                    <div class="course-detail ${course.color}">
                        <h5>${course.name} - ${course.title}</h5>
                        <p><strong>時間：</strong>${course.time}</p>
                        <p><strong>地點：</strong>${course.location}</p>
                    </div>
                `;
            });
            
            content += '</div>';
        }
        
        // 如果沒有任何事件
        if (!content) {
            content = '<p class="no-events">今日沒有課程、工作或特殊活動</p>';
        }
        
        modalBody.innerHTML = `
            <style>
                .event-item, .course-detail, .work-detail {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius-medium);
                    margin-bottom: var(--spacing-md);
                }
                
                /* 衝突警告樣式 */
                .conflict-warning {
                    background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(255, 107, 157, 0.1));
                    border: 2px solid var(--conflict-color);
                    border-radius: var(--radius-medium);
                    padding: var(--spacing-md);
                    margin-bottom: var(--spacing-md);
                    animation: conflictPulse 2s ease-in-out infinite;
                }
                
                .conflict-warning h4 {
                    color: var(--conflict-color);
                    margin-bottom: var(--spacing-sm);
                }
                
                .conflict-warning p {
                    color: var(--conflict-color);
                    font-weight: 600;
                    margin: 0;
                }
                
                /* 工作班次樣式 */
                .work-today h4 {
                    margin-bottom: var(--spacing-md);
                    color: var(--text-primary);
                }
                
                .work-detail.work-morning {
                    border-left: 4px solid var(--work-morning);
                }
                
                .work-detail.work-afternoon {
                    border-left: 4px solid var(--work-afternoon);
                }
                
                .work-detail.work-evening {
                    border-left: 4px solid var(--work-evening);
                }
                
                .work-detail.work-overnight {
                    border-left: 4px solid var(--work-overnight);
                }
                
                .work-detail.rest {
                    border-left: 4px solid var(--work-rest);
                    opacity: 0.8;
                }
                
                /* 衝突狀態 */
                .work-today.conflict, .courses-today.conflict {
                    background: rgba(231, 76, 60, 0.05);
                    border-radius: var(--radius-medium);
                    padding: var(--spacing-sm);
                    border: 1px solid rgba(231, 76, 60, 0.2);
                }
                
                /* 原有樣式 */
                .event-item.holiday {
                    border-left: 4px solid var(--course-dns001);
                }
                .event-item.event {
                    border-left: 4px solid var(--event-color);
                }
                .course-detail.dns001 {
                    border-left: 4px solid var(--course-dns001);
                }
                .course-detail.dns002 {
                    border-left: 4px solid var(--course-dns002);
                }
                .course-detail.dns003 {
                    border-left: 4px solid var(--course-dns003);
                }
                .course-detail.dns016 {
                    border-left: 4px solid var(--course-dns016);
                }
                .courses-today h4 {
                    margin-bottom: var(--spacing-md);
                    color: var(--text-primary);
                }
                .no-events {
                    text-align: center;
                    color: var(--text-secondary);
                    font-style: italic;
                }
            </style>
            ${content}
        `;
        
        modal.classList.add('show');
    }
    
    closeModal() {
        const modal = document.getElementById('eventModal');
        modal.classList.remove('show');
    }
    
    updateCurrentDate() {
        const currentDateElement = document.getElementById('currentDate');
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        currentDateElement.textContent = now.toLocaleDateString('zh-TW', options);
    }
}

// 頁面載入完成後初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    new CalendarApp();
});

// 添加鍵盤導航支持
document.addEventListener('keydown', (e) => {
    const app = window.calendarApp;
    if (!app) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (e.ctrlKey || e.metaKey) {
                app.navigateMonth(-1);
                e.preventDefault();
            }
            break;
        case 'ArrowRight':
            if (e.ctrlKey || e.metaKey) {
                app.navigateMonth(1);
                e.preventDefault();
            }
            break;
    }
});

// PWA支持（如果需要）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 這裡可以註冊Service Worker來實現離線功能
        // navigator.serviceWorker.register('/sw.js');
    });
}

// 觸摸手勢支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        const app = window.calendarApp;
        if (!app) return;
        
        if (swipeDistance > 0) {
            // 向右滑動 - 上一個月
            app.navigateMonth(-1);
        } else {
            // 向左滑動 - 下一個月  
            app.navigateMonth(1);
        }
    }
}

// 全局變量供調試使用
window.calendarApp = null;
document.addEventListener('DOMContentLoaded', () => {
    window.calendarApp = new CalendarApp();
});
