function sendVibration(gamepad){

    gamepad.vibrationActuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: 666,
      weakMagnitude: 1.0,
      strongMagnitude: 1.0
    })

}

function makeFloat(float){

    return parseFloat( Math.round(float * 50) + 50 ).toFixed(5) + '%'

}

function getDisplayByHash(current){

    let hashID = parseInt( document.location.hash.slice(5) )
    if( !hashID )
        hashID = 1

    document.body.classList.remove( 'current-1', 'current-2', 'current-3', 'current-4', )
    document.body.classList.add( 'current-' + hashID )

}

function updateGamepad(){

    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []),
        template = document.querySelector('#gamepad'),
        gmpdElem = document.querySelector('#placeGamepads'),
        gmpdHTML = '',
        layouts = {
            layout1: [
                'btn-y',
                'btn-b',
                'btn-a',
                'btn-x',
                'left.bumper',
                'right.bumper',
                'left.trigger',
                'right.trigger',
                'select',
                'start',
                'left.axis',
                'right.axis',
                'btn-up',
                'btn-down',
                'btn-left',
                'btn-right',
                1
            ],
            layout2: [
                'btn-a',
                'btn-b',
                'btn-x',
                'btn-y',
                'left.bumper',
                'right.bumper',
                'left.trigger',
                'right.trigger',
                'select',
                'start',
                'left.axis',
                'right.axis',
                'btn-up',
                'btn-down',
                'btn-left',
                'btn-right',
                2
            ]
        }

    if( gamepads.length > 0 ){

        for(let i = 0; i < gamepads.length; i++){

            let index   = i + 1,
                gamepad = gamepads[i]

            if( gamepad != null ){

                let name   = gamepad.id,
                    layout = (name.indexOf('STANDARD GAMEPAD') > -1) ? layouts.layout2 : layouts.layout1,
                    btnVbt = document.querySelector('.vibrate')

                gmpdHTML += `<div class="gmpd-${index} mt-2">`
                gmpdHTML += template.innerHTML
                gmpdHTML += `</div>`

                gmpdElem.innerHTML = gmpdHTML

                if( btnVbt ){

                    btnVbt.addEventListener('click', function(event){

                        let idx = parseInt( this.getAttribute('data-gamepad') )

                        sendVibration( gamepads[ idx ] )

                    })

                }

                if( layout[16] == 1 ){

                    let arrows = gamepad.axes[9]

                    if(arrows >= -1 && arrows < -.70 || arrows >= .9 && arrows < 1.1)
                        document.querySelector( '.gmpd-' + index + ' .' + layout[12] ).classList.add("pressed")

                    if(arrows > -.72 && arrows < -.13)
                        document.querySelector( '.gmpd-' + index + ' .' + layout[15] ).classList.add("pressed")

                    if(arrows > -.15 && arrows < .43)
                        document.querySelector( '.gmpd-' + index + ' .' + layout[13] ).classList.add("pressed")

                    if(arrows > .41 && arrows <= 1)
                        document.querySelector( '.gmpd-' + index + ' .' + layout[14] ).classList.add("pressed")

                }

                for( let i = 0; i < gamepad.buttons.length; i++ ){

                    if( gamepad.buttons[i].pressed ){

                        if( i == 6 || i == 7 ){

                            let position = 70 - ( 70 * gamepad.buttons[i].value ).toFixed(5)

                            document.querySelector( '.gmpd-' + index + ' .' + layout[i] ).style.backgroundPosition = `0 ${position}px`
                            if( position < 17 )
                                document.querySelector( '.gmpd-' + index + ' .' + layout[i] ).style.color = '#fff'

                        } else {

                            document.querySelector( '.gmpd-' + index + ' .' + layout[i] ).classList.add("pressed")
                    
                        }

                    }

                }

                let leftX = gamepad.axes[0],
                    leftY = gamepad.axes[1],
                    rightX= gamepad.axes[2],
                    rightY= (layout[16] == 1) ? gamepad.axes[5] : gamepad.axes[3]

                if( Math.abs(leftX) != 0 )
                    document.querySelector('.gmpd-' + index + ' .axis.left .pointer').style.left = makeFloat(leftX)

                if( Math.abs(leftY) != 0 )
                    document.querySelector('.gmpd-' + index + ' .axis.left .pointer').style.top = makeFloat(leftY)

                if( Math.abs(rightX) != 0 )
                    document.querySelector('.gmpd-' + index + ' .axis.right .pointer').style.left = makeFloat(rightX)

                if( Math.abs(rightY) != 0 )
                    document.querySelector('.gmpd-' + index + ' .axis.right .pointer').style.top = makeFloat(rightY)

            }

        }

        getDisplayByHash()

        requestAnimationFrame(updateGamepad)

    }

}

function updateGamepadList(){

    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []),
        listElem = document.querySelector('#placeList'),
        listHTML = '',
        nameElem = document.querySelector('#placeName'),
        nameHTML = ''

    if( gamepads.length > 0 ){

        listHTML += '<div class="p-1">'

        for(let i = 0; i < gamepads.length; i++){

            let index  = i + 1

            if( gamepads[i] != null ){

                let name = gamepads[i].id

                nameHTML += `<div class="gmpd-${index}"><p class="p-1 pb-0"><span class="badge badge-dark">${index}</span> ${name}`
                if(gamepads[i].vibrationActuator)
                    nameHTML += ` <a href="javascript:void(0)" class="btn btn-sm btn-secondary vibrate" data-gamepad="${i}">Vibrate</a>`
                nameHTML += `</p></div>`

                nameElem.innerHTML = nameHTML

                listHTML += `<a href="#nav-${index}" class="btn btn-success mr-1">
                                Gamepad <span class="badge badge-light">${index}</span>
                            </a>`
                
                listElem.innerHTML = listHTML

            } else {

                listHTML += `<a href="javascript:void(0)" class="btn btn-outline-danger mr-1" disabled>
                                Gamepad <span class="badge badge-danger">${index}</span>
                            </a>`

            }

        }

        listHTML += '</ul>'

    }

    updateGamepad()

}

addEventListener('gamepadconnected', function(event) {

    updateGamepadList()

})

addEventListener('gamepaddisconnected', function(event) {

    updateGamepadList()

})

document.addEventListener("DOMContentLoaded", function(event) {

    

})