// This all is terrible.
// But it was done just in 3 hours and will be rebuilt from the ground up

window.onload = function() {
    window.triggers = []

    window.newTrigger = document.getElementById('newTrigger')
    window.newResponse = document.getElementById('newResponse')
    window.addBtn = document.getElementById('addBtn')
    window.newEntryRow = document.getElementById('newEntryRow')

    window.newTrigger.value = ''
    window.newResponse.value = ''

    window.addBtn.addEventListener('click', () => {
        addTriggers([
            {
                'phrase': window.newTrigger.value,
                'response': window.newResponse.value
            }
        ], true)
    })

    loadExistingTriggers()
}

const loadExistingTriggers = () => {
    $.ajax({
        url: '/triggers',
        type: 'get',
        success: triggersJSON => {
            parsedTriggers = JSON.parse(triggersJSON)
            addTriggers(parsedTriggers, false)
        }
    })
}

const addTriggers = (triggersArr, updateBackend) => {
    Object.values(triggersArr).forEach(trigger => {
        drawTrigger(trigger.phrase, trigger.response)
        window.triggers.push(trigger)
    })

    console.log(window.triggers)
    window.newTrigger.value = ''
    window.newResponse.value = ''

    if (updateBackend) {
        $.ajax({
            url: '/triggers',
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(window.triggers)
        })
    }
}

const removeTrigger = trigger => {
    _.remove(window.triggers, function (x) { return x.phrase == trigger })
    $.ajax({
        url: '/triggers',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(window.triggers)
    })
}

const drawTrigger = (trigger, response) => {
    let row = document.createElement('div')
    row.setAttribute('class', 'row mt-4 align-items-center')

    let triggerBlock = document.createElement('div')
    triggerBlock.setAttribute('class', 'col-3 pl-0 pr-0')
    let triggerIG = document.createElement('div')
    triggerIG.setAttribute('class', 'input-group')
    let triggerPrepend = document.createElement('div')
    triggerPrepend.setAttribute('class', 'input-group-prepend')

    $(triggerPrepend)
    .append('<span class="input-group-text">⚠</span>')
    $(triggerIG)
    .append($(triggerPrepend))
    .append(`<input type="text"
            class="form-control"
            value="${trigger}"
            disabled></input>`)
    $(triggerBlock)
    .append($(triggerIG))

    let midBlock = document.createElement('div')
    midBlock.setAttribute('class', 'col-1 text-center pl-0 pr-0')

    $(midBlock)
    .append('<span class="align-middle">></span>')

    let responseBlock = document.createElement('div')
    responseBlock.setAttribute('class', 'col pl-0 pr-0')
    let responseIG = document.createElement('div')
    responseIG.setAttribute('class', 'input-group')
    let responsePrepend = document.createElement('div')
    responsePrepend.setAttribute('class', 'input-group-prepend')
    let responseAppend = document.createElement('div')
    responseAppend.setAttribute('class', 'input-group-append')
    let removeBtn = document.createElement('button')
    removeBtn.setAttribute('type', 'button')
    removeBtn.setAttribute('class', 'btn btn-outline-danger')
    removeBtn.innerHTML = '-'
    removeBtn.addEventListener('click', () => {
        removeTrigger(trigger)
        row.parentNode.removeChild(row)
    })

    $(responsePrepend)
    .append('<span class="input-group-text">t(▀̿Ĺ̯▀̿ ̿)</span>')
    $(responseAppend).append($(removeBtn))
    $(responseIG)
    .append($(responsePrepend))
    .append(`<input type="text"
            class="form-control"
            value="${response}"
            disabled></input>`)
    .append($(responseAppend))
    $(responseBlock)
    .append($(responseIG))

    $($(row)
    .append(triggerBlock)
    .append(midBlock)
    .append(responseBlock))
    .insertBefore('#newEntryRow')
}
