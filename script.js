





const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const gameBoard = (() => {
    let board = new Array(9)
    const getField = (num) => board[num]

    const setField = (num, player) => {
        const htmlField = document.querySelector(`.game-container button:nth-child(${num+1}) p`)
        htmlField.textContent = player.getSign()
        board[num] = player.getSign()
    }


    const getEmptyFieldIdx = () => {
        fields = [];

        for(let i = 0; i < board.length; i++){
            const field = board[i];
            if(field == undefined){
                fields.push(i);
            }
        }
        return fields
    }   


    const clear = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = undefined
        }
    }

    return {getField, setField, getEmptyFieldIdx ,clear}
})();


const Player = (sign) => {
    let _sign = sign;
    
    const getSign = () => _sign;
    const setSign = (sign, reset) => {
        const signbtn = document.querySelector(`.btn-p.${sign}`);

        if(reset){
            signbtn.classList.remove('activesign')
        }else{
            signbtn.classList.add('activesign')
            signbtn.classList.remove('notactive')
        }
        
        

        _sign = sign

    }

    const removeSign = (sign) => {
        const signbtn = document.querySelector(`.btn-p.${sign}`);

        signbtn.classList.add('notactive')
        signbtn.classList.remove('activesign')

    }
    return {getSign, setSign, removeSign}
}

const botLogic = (() => {

    const chooseNum = () => {
        
        let choice = null;

        const emptyFieldIdx = gameBoard.getEmptyFieldIdx();

        const value = Math.floor(Math.random() * emptyFieldIdx.length )

        choice = emptyFieldIdx[value]




    return choice
    }


    return {chooseNum}
})();


const players = (() => {
    const Xplayer = Player('X')
    const OBotplayer = Player('O')

    const getXplayer = () => Xplayer
    const getOBotplayer = () => OBotplayer


   //steps
    async function humanStep(num) {
        const field = gameBoard.getField(num);
        if(field == undefined){
            gameBoard.setField(num, Xplayer);

            if(gameControls.checkWin(gameBoard) === true){
                gameControls.deactivate()
                await sleep(50 + (Math.random() * 500));
                gameControls.endGame(Xplayer.getSign())
                
            }
            else if(gameControls.checkForDraw(gameBoard) === true){
                gameControls.endGame('Draw')
            }
            else{
                gameControls.deactivate();
                await sleep(250 + (Math.random * 300));
                aiStep();
                if(!gameControls.checkWin(gameBoard)){
                    gameControls.activate()
                }
            
            }
            
            
        }
    }

    async function aiStep () {
        const num = botLogic.chooseNum()

        
        gameBoard.setField(num, players.getOBotplayer())

        if(gameControls.checkWin(gameBoard) === true){
            gameControls.endGame(OBotplayer.getSign())

        }else if(gameControls.checkForDraw(gameBoard) === true){
            gameControls.endGame('Draw')
        }

        
    
    }

    return {getOBotplayer, getXplayer, aiStep, humanStep}
})();



const gameControls = (() => {

    const htmlBoard = Array.from(document.querySelectorAll('button.field'))

    const deactivate = () => {
        htmlBoard.forEach(field => {
            field.setAttribute('disabled', '');
        });
    }

    const activate = () => {
        htmlBoard.forEach(field => {
            field.removeAttribute('disabled');
        });
    }

    const clear = () => {
        htmlBoard.forEach(field => {
            const p = field.childNodes[0]
            p.classList = []
            p.textContent = '';
        });
    }


    //check for win
    const checkForRows = (_board) => {
        for (let i = 0; i < 3; i++){
            let row = [];
            for (let j = i * 3; j < i * 3 + 3; j++){
                row.push(_board.getField(j))
            }

            if(row.every(field => field == 'X') || row.every(field => field == 'O')){
                return true
            }
        }
        return false
    }


    const checkForColumns = (_board) => {
        for(let i = 0; i < 3; i++){
            let column = [];
            for(let j = 0; j < 3 ;j++){
                column.push(_board.getField(i + 3 * j))
            }

            if(column.every(field => field == 'X') || column.every(field => field =='O')){
                return true
            }
        }
        return false
    } 

    
    const checkForDiagnols = (_board) => {
        firstdiagnol = [_board.getField(0), _board.getField(4), _board.getField(8)]
        secdiagnol = [_board.getField(2), _board.getField(4), _board.getField(6)]
    
        if(firstdiagnol.every(field => field == 'X') || firstdiagnol.every(field => field =='O')){
            return true
        } 
        else if (secdiagnol.every(field => field == 'X' ) || secdiagnol.every(field => field == 'O')){
            return true
        }

    }


    const checkWin = (_board) => {
        if(checkForRows(_board) || checkForColumns(_board) || checkForDiagnols(_board)){
            
            return true
            
        }
        return false
    }

    const checkForDraw = (_board) => {
        if (checkWin(_board)){
            return false
        }

        for (let i = 0; i < 9; i++){
            const field = _board.getField(i);
            if(field == undefined){
                return false
            }
        }

        return true
    }



    //ending Game

    async function endGame(winnerSign){

        const cover = document.createElement('div')
        cover.classList.add('coverShow')
        document.body.appendChild(cover)

        const wintext = document.createElement('div')
        

        if( winnerSign === 'X' || winnerSign === 'O'){
            const winHeader = document.createElement('h1')
            winHeader.textContent = 'The Winner'

            winHeader.style.fontSize = "50px"

            wintext.appendChild(winHeader)
        }

        

        
        
        const sign = document.createElement('h1')
        sign.textContent = winnerSign;
        sign.style.fontSize = "40px"
        wintext.appendChild(sign);

    
        
        wintext.classList.add('winText')

    
        
        document.body.appendChild(wintext)

        
        
        await sleep(1000 + (Math.random() * 500));

      
        //hide cover 
        cover.classList.remove('coverShow')
        cover.classList.add('cover')
        
        //hide text
        
        wintext.classList.add('hide')
        
        Back.restart()
        Back.resetSign()

    }

    
    return {
        deactivate,
        activate,
        clear, 
        checkForRows,
        checkForColumns,
        checkForDiagnols,
        checkWin,
        checkForDraw,
        endGame}
})();



const Back = (() => {

    const x = document.querySelector('.X')
    const o = document.querySelector('.O')


    const restart = () => {
        gameControls.clear()
        gameBoard.clear()
        gameControls.activate()
    }

    function setFieldSign(num){   
        players.humanStep(num)
        

    }

    const resetSign = () => {
        players.getXplayer().setSign('X', true)
        players.getOBotplayer().setSign('O', true)


    }

    const changeSign = (sign) => {
        if(sign == 'X'){
            players.getOBotplayer().setSign('O')
            players.getOBotplayer().removeSign('X')

            players.getXplayer().setSign('X')
            players.getXplayer().removeSign('O')
            

        }else if(sign == 'O'){
            players.getOBotplayer().setSign('X')
            players.getOBotplayer().removeSign('O')

            players.getXplayer().setSign('O')
            players.getXplayer().removeSign('X')
            
        }

        Back.restart();
        

    }


    const init = (() => {
        const htmlBoard = Array.from(document.querySelectorAll('button.field'))


        for(let i = 0; i< htmlBoard.length; i++){
            const field = htmlBoard[i]
            field.addEventListener('click', function(){
                setFieldSign(i)
            })
        }


        x.addEventListener('click', 
        function() {Back.changeSign('X')})
        
        o.addEventListener('click',
        function() {Back.changeSign('O')})

    })();

    return {
        resetSign,
        changeSign,
        setFieldSign,
        restart}
})();


//////make a start screen with seeing only the header
//////and the sign choosing buttons
//////then after choosing fade away the screen and 
//////and still let them change sign