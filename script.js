const CreateSelect = (elems) => {
    if (!elems) return
    let i, j, select, clone, items, option
    for (i = 0; i < elems.length; i++) {
        select = elems[i].getElementsByTagName('select')[0]
        clone = document.createElement('div')
        clone.setAttribute('class', 'select__clone')
        clone.innerHTML = select.options[select.selectedIndex].innerHTML = select.options[select.selectedIndex].value
        elems[i].append(clone)
        items = document.createElement('div')
        items.setAttribute('class', 'select__item select__hide')
        for (j = 1; j < select.length; j++) {
            option = document.createElement('div')
            option.innerHTML = select.options[j].innerHTML
            option.dataset.optionUrl = select.options[j].dataset.optionUrl
            option.addEventListener('click', function (e) {
                let y, i, k, s, h;
                s = this.parentNode.parentNode.getElementsByTagName('select')[0]
                h = this.parentNode.previousSibling
                for (i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i
                        h.innerHTML = this.innerHTML
                        y = this.parentNode.getElementsByClassName('same__selected')
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute('class')
                        }
                        this.setAttribute('class', 'same__selected')
                        break
                    }
                }
                h.click()
                if (e.target.dataset.optionUrl !== 'undefined') {
                    window.location.assign(e.target.dataset.optionUrl)
                }
            })
            items.append(option)
        }
        elems[i].append(items)
        clone.addEventListener('click', function (e) {
            e.stopPropagation()
            closeAllSelect(this)
            this.nextSibling.classList.toggle('select__hide')
            this.classList.toggle('select__able')
        })
    }
}
const closeAllSelect = (elem) => {
    let i, arrNo = [],
        x = document.getElementsByClassName('select__item'),
        y = document.getElementsByClassName('select__clone')
    if (!x && !y) return
    for (i = 0; i < y.length; i++) {
        if (elem == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove('select__able')
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add('select__hide')
        }
    }
}
document.addEventListener('click', closeAllSelect)
CreateSelect(document.getElementsByClassName('select__custom'))
let currentModal = tds = startDate = endDate = currentTd = null,
    selectShow = document.querySelector('.selectShow'),
    calendarModal = document.getElementById('calendarModal'),
    options = calendarModal.querySelector('.options__calendar'),
    arrowNext = calendarModal.querySelector('.arrow__next'),
    selectPeriod = calendarModal.querySelector('.select__period'),
    buttonUpdate = calendarModal.querySelector('.button__update'),
    refreshedNav = document.querySelector('.refreshed__nav'),
    refreshedData = document.querySelector('.refreshed__data'),
    refreshedClose = document.querySelector('.refreshed__close'),
    now = new Date(),
    year = now.getFullYear(),
    month = now.getMonth(),
    today = now.getDate(),
    nowYear = now.getFullYear(),
    nowMonth = now.getMonth(),
    arrMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

const showModal = (modal) => {
    if (currentModal) {
        hideModal(modal)
        currentModal = null
    }
    let width = document.documentElement.clientWidth
    document.body.style.overflowY = 'hidden'
    document.body.style.paddingRight = `${document.documentElement.clientWidth - width}px`
    currentModal = true
    modal.style.display = 'block'
    document.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            hideModal(modal)
        }
    })
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            hideModal(modal)
        }
    })
}
const hideModal = (modal) => {
    modal.style.display = 'none'
    document.body.style.overflowY = ''
    document.body.style.paddingRight = `${0}px`
}
const getAllElementsModal = (elem, modal) => {
    if (!elem) return
    elem.onclick = (e) => {
        showModal(modal)
    }
}
getAllElementsModal(selectShow, calendarModal)
const sendXHR = (url, data, callback) => {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader("Content-Type", '')
    xhr.send(new URLSearchParams(data).toString())
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            callback(JSON.parse(xhr.response))
        }
    }
}
const setPeriod = (start, end) => {
    let stringStart = start.getDate() + ' ' + arrMonths[start.getMonth()] + ' ' + start.getFullYear(),
        stringEnd = end.getDate() + ' ' + arrMonths[end.getMonth()] + ' ' + end.getFullYear(),
        data = {}
    const callback = (response) => {
        selectShow.firstChild.textContent = refreshedData.firstChild.textContent = stringStart + ' - ' + stringEnd
        refreshedNav.style.display = 'block'
    }
    data.start = start
    data.end = end
    // sendXHR('/', data, callback) // open in prodaction
    selectShow.firstChild.textContent = refreshedData.firstChild.textContent = stringStart + ' - ' + stringEnd // remove in prodaction
    refreshedNav.style.display = 'block' // remove in prodaction
}
const createCalendar = (elem) => {
    let d = new Date(year, month),
        beforeDays = new Date(year, month, 0).getDate() - getDay(d),
        table = '<table><tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr><tr>',
        num = 1
    for (let i = 0; i < getDay(d); i++) {
        table += '<td class="over">' + ++beforeDays + '</td>'
    }
    while (d.getMonth() == month) {
        table += '<td>' + num + '</td>'
        if (getDay(d) % 7 == 6) {
            table += '</tr><tr>'
        }
        d.setDate(d.getDate() + 1)
        num++
    }
    num = 1
    if (getDay(d) != 0) {
        for (let i = getDay(d); i < 7; i++) {
            table += '<td class="over">' + num++ + '</td>'
        }
    }
    elem.querySelector('.calen__month').innerHTML = table += '</tr></table>'
    elem.querySelector('.calen__header').innerHTML = arrMonths[month] + ', ' + year
    tds = elem.querySelectorAll('td')
    for (let td of tds) {
        if (year == nowYear && month == nowMonth && td.innerHTML == today) td.classList.add('today')
    }
    (year == nowYear && month == nowMonth) ? arrowNext.classList.add('opacity') : arrowNext.classList.remove('opacity')
}
const getDay = (date) => {
    let day = date.getDay()
    if (day == 0) day = 7
    return day - 1
}
createCalendar(calendarModal)
const clearAll = () => {
    for (let td of tds) {
        td.classList.remove('active')
        td.classList.remove('middle')
        // td.classList.remove('start') 
        // td.classList.remove('end')
    }
    let active = selectPeriod.querySelector('.active')
    if (active) active.classList.remove('active')
    startDate = endDate = currentTd = null
}
const selectedLi = (period) => {
    startDate = new Date(nowYear, nowMonth, today)
    endDate = new Date(nowYear, nowMonth, today)
    startDate.setDate(startDate.getDate() - (period - 1))
    if (period == '2') {
        endDate = startDate
    } else if (period == 'this month') {
        startDate = new Date(nowYear, nowMonth, 1)
    } else if (period == 'last month') {
        startDate = new Date(nowYear, nowMonth - 1, 1)
        endDate = new Date(nowYear, nowMonth, 0)
    }
    colorActiveTd(startDate, endDate)
}
const colorActiveTd = (startDate, endDate) => {
    for (let td of tds) {
        if (td.classList.contains('over')) continue
        let currentDate = new Date(year, month, td.innerHTML)
        if (currentDate - startDate == 0 || currentDate - endDate == 0) {
            td.classList.add('active')
        }
        // if (currentDate - startDate == 0) {
        //     td.classList.add('start')
        // } else if (currentDate - endDate == 0) {
        //     td.classList.add('end')
        // }
        if (currentDate > startDate && currentDate < endDate) {
            td.classList.add('middle')
        }
    }
}
options.onclick = (e) => {
    let target = e.target.closest('li,.arrow__prev,.arrow__next,td,.button__cancel,.button__update')
    if (!target) return
    if (target.closest('li')) {
        if (target.classList.contains('active')) return
        clearAll()
        target.classList.add('active')
        selectedLi(target.dataset.period)
        buttonUpdate.classList.remove('disable')
    } else if (target.closest('.arrow__prev')) {
        month--
        if (month < 0) {
            month = 11
            year--
        }
        createCalendar(calendarModal)
        colorActiveTd(startDate, endDate)
    } else if (e.target.closest('.arrow__next')) {
        if (year == nowYear && month == nowMonth) return
        month++
        if (month > 11) {
            month = 0
            year++
        }
        createCalendar(calendarModal)
        colorActiveTd(startDate, endDate)
    } else if (target.closest('td')) {
        if (year == nowYear && month == nowMonth && target.innerHTML > today) return
        if (!currentTd) {
            clearAll()
            startDate = new Date(year, month, target.innerHTML)
            endDate = startDate
            currentTd = true
        } else if (currentTd) {
            endDate = new Date(year, month, target.innerHTML)
            currentTd = null
            let currentEnd = endDate
            if (startDate > endDate) {
                endDate = startDate
                startDate = currentEnd
            }
        }
        colorActiveTd(startDate, endDate)
        buttonUpdate.classList.remove('disable')
    } else if (target.closest('.button__cancel')) {
        hideModal(calendarModal)
    } else if (target.closest('.button__update')) {
        buttonUpdate.classList.add('disable')
        setPeriod(startDate, endDate)
        hideModal(calendarModal)
    }
}
refreshedClose.onclick = () => {
    refreshedNav.style.display = 'none'
    selectShow.firstChild.textContent = 'За 1 день'
    refreshedData.firstChild.textContent = ''
    clearAll()
    year = new Date().getFullYear()
    month = new Date().getMonth()
    buttonUpdate.classList.add('disable')
    createCalendar(calendarModal)
}



