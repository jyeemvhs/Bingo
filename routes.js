
var express = require("express");
var router = express.Router();

    let NUM_ROWS_CAGE = 5;
    let NUM_COLUMNS_CAGE = 15;
    let NUM_VALUES_PER_ROW = NUM_COLUMNS_CAGE;
    
    
    let numBalls = NUM_VALUES_PER_ROW*NUM_ROWS_CAGE;
    let cage=[];
    let cageReverse=[];
    let currentIndex=0;

    let identifier = 1;

    let resetState = false;

    let NUM_ROWS_CARD = 5;
    let NUM_COLUMNS_CARD = 5;  

    let board1;
      board1 = Create2DArray(NUM_ROWS_CARD*NUM_COLUMNS_CARD);

      let winnerValue = 0;
      let winnerName1 = "";
      let winnerName2 = "";
      let winnerName3 = "";
      let winnerName4 = "";

      let gameType = 1;

      let howManyA = 1;
      let numbers=[];


      let totalMessage = "";
      let messages;
      let numMessages = 6;
      messages = Create2DArray(numMessages);
      for (let a=0;a<numMessages;a++)
        messages[a] = "";
      let currMessage = 0;

    reset();

function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}



function reset() {
//      totalMessage = "";
      winnerValue = 0;
      winnerName1 = "";
      winnerName2 = "";
      winnerName3 = "";
      winnerName4 = "";

    resetState = true;
        currentIndex = 0;
        for (let i=0;i<numBalls;i++) {
            cage[i] = 0;
            cageReverse[i] = 0;
        }


        let keepLooping = true;
        let order = 1;
        while (keepLooping) {
            let randomNum = Math.floor(Math.random()*numBalls);
            while (cage[randomNum] != 0) {
                randomNum = Math.floor(Math.random()*numBalls);
            }
            cage[randomNum] = order;
            order++;
            if (order == numBalls+1)
                keepLooping = false;
        }


}




let infoVal = 0;
router.get("/",function(request,response){
  response.sendFile(__dirname + "/public/views/index.html");
});
router.get("/info",function(request,response){
  infoVal++;
  response.sendFile(__dirname + "/public/views/info.html");
});

var infoList = [];

router.post('/change', function(req, res){

  if (req.body.index < 0 || req.body.name == "") {
    res.json(null);
  } else {
    temp = {name:req.body.name,color:req.body.color,rating:req.body.rating};
    infoList[req.body.index] = temp;
    res.json(infoList[req.body.index]);
  }

});

    function ChooseBall() {
      resetState = false;
//console.log("numBalls = " + numBalls);
//console.log(currentIndex + howManyA);
      if (currentIndex + howManyA > numBalls) {
  //      console.log("change howMany");
        howManyA = numBalls - currentIndex; 
      }
   //   if (currentIndex == numBalls) {
   //     return (cage[currentIndex-1]);
   //   }

      let j = currentIndex;
      for (let i=0;i<howManyA;i++) {
        cageReverse[cage[j++]-1] = 1;
        numbers[i] = cage[currentIndex++];
      }
//      cageReverse[cage[currentIndex]-1] = 1;
//      return (cage[currentIndex++]);
    }

router.get('/info2', function(req, res){

  if (req.query.index == 2) {
    reset();
    gameType = req.query.gameType;
    res.json({val:req.query.index});
    return;
  }
  else if (req.query.index == 3) {
//        console.log(req.query.howMany);
        howManyA = Number(req.query.howMany);
  //        let ballNumA = -1;
  //        ballNumA = ChooseBall(); 
        ChooseBall(); 
//        console.log("howMany really " + howManyA);
//        res.json({val:req.query.index,howMany:howMany,ballNum:ballNumA});
        res.json({val:req.query.index,howMany:howManyA,numbers:numbers});
        return;
  }
  else if (req.query.index == 4) {
        res.json({val:req.query.index,winnerName1:winnerName1,winnerName2:winnerName2,
        winnerName3:winnerName3,winnerName4:winnerName4,message:totalMessage});
         
        return;
  }
  else if (req.query.index == 6) {
      totalMessage = "";
      for (let a=0;a<numMessages;a++)
        messages[a] = "";
      currMessage = 0;

        res.json({val:req.query.index});     
        return;
  }


  
});




function CreateCard() {
  

        for (let zrow=0;zrow<NUM_ROWS_CARD;zrow++) {
          for (let zcol=0;zcol<NUM_COLUMNS_CARD;zcol++) {

                  board1[zrow][zcol] = -1;

           }
        } 




        for (let col=0;col<NUM_COLUMNS_CARD;col++) {
           for (let row=0;row<NUM_ROWS_CARD;row++) {
               let keepLooping = true;
               let randomVal = Math.floor(Math.random()*NUM_VALUES_PER_ROW+1) + NUM_VALUES_PER_ROW * col;
               while (keepLooping) {
                   let goodVal = true;
                   for (let j=0;j<NUM_ROWS_CARD;j++) {


                          if (board1[j][col] == randomVal) {
                              goodVal = false;
                          }       

                   }
                   if (goodVal) {
                       keepLooping = false;
                   }
                   else {
                       randomVal = Math.floor(Math.random()*NUM_VALUES_PER_ROW+1) + NUM_VALUES_PER_ROW * col;               
                   }
               }




                 board1[row][col] = randomVal; 


           }
        }        



}

  function GetCurrentBall() {
    if (currentIndex == 0)
      return (-1);
    return (cage[currentIndex-1]);
  }

//Check to see if the card is a winner.
//Check the card to see the value exists on the card.
    function checkValue(value,row,col) {
        if (row == Math.floor(NUM_ROWS_CARD/2) && col == Math.floor(NUM_COLUMNS_CARD/2))
          return (1);
        if (cageReverse[value-1] == 1)
          return(1);
//        for (let i=0;i<currentIndex;i++) {
//              if (value == cage[i]) {
//                   return(1);
//              }
//        }
        return (0);
    }

    function CheckWinRegular(tempBoard) {
        let total = 0;
        
        for (let row=0;row<NUM_ROWS_CARD;row++) {
            total = 0;
            for (let i=0;i<NUM_COLUMNS_CARD;i++) {
                total += checkValue(tempBoard[row][i],row,i);
            }    
            if (total == NUM_ROWS_CARD)
                return (true);
        }
        for (let col=0;col<NUM_COLUMNS_CARD;col++) {
            total = 0;
            for (let i=0;i<NUM_ROWS_CARD;i++) {
                total += checkValue(tempBoard[i][col],i,col);
            }    
            if (total == NUM_ROWS_CARD)
                return (true);
        }


        total = 0;
        for (let i=0;i<NUM_ROWS_CARD;i++) {
            total += checkValue(tempBoard[i][i],i,i);
        }    
        if (total == NUM_ROWS_CARD)
            return (true);
        
        total = 0;
        for (let i=0;i<NUM_ROWS_CARD;i++) {
            total += checkValue(tempBoard[i][4-i],i,4-i);
        }    
        if (total == NUM_ROWS_CARD)
            return (true);
        
        return (false);
    }
    

//////
    function CheckWin4Corners(tempBoard) {
        let total = 0;

        total = 0;
        total += checkValue(tempBoard[0][0],0,0);
        total += checkValue(tempBoard[4][4],4,4);
        total += checkValue(tempBoard[0][4],0,4);
        total += checkValue(tempBoard[4][0],4,0);
        if (total == 4)
            return (true);
        return (false);
    }
    
    function CheckWinOx(tempBoard) {

      if (checkValue(tempBoard[0][0],0,0) == 0)
        return (false);
      if (checkValue(tempBoard[0][1],0,1) == 0)
        return (false);
      if (checkValue(tempBoard[0][2],0,2) == 0)
        return (false);

      if (checkValue(tempBoard[1][0],1,0) == 0)
        return (false);
      if (checkValue(tempBoard[1][2],1,2) == 0)
        return (false);

      if (checkValue(tempBoard[2][0],2,0) == 0)
        return (false);
      if (checkValue(tempBoard[2][1],2,1) == 0)
        return (false);
      if (checkValue(tempBoard[2][2],2,2) == 0)
        return (false);

      if (checkValue(tempBoard[3][3],3,3) == 0)
        return (false);
      if (checkValue(tempBoard[4][4],4,4) == 0)
        return (false);

      if (checkValue(tempBoard[4][2],4,2) == 0)
        return (false);
      if (checkValue(tempBoard[2][4],2,4) == 0)
        return (false);

        return (true);
    }
    

    function CheckWin2021(tempBoard) {

      if (checkValue(tempBoard[0][0],0,0) == 0)
        return (false);
      if (checkValue(tempBoard[0][1],0,1) == 0)
        return (false);
      if (checkValue(tempBoard[0][2],0,2) == 0)
        return (false);

      if (checkValue(tempBoard[1][2],1,2) == 0)
        return (false);
      if (checkValue(tempBoard[2][1],2,1) == 0)
        return (false);
      if (checkValue(tempBoard[3][0],3,0) == 0)
        return (false);

      if (checkValue(tempBoard[4][0],4,0) == 0)
        return (false);
      if (checkValue(tempBoard[4][1],4,1) == 0)
        return (false);
      if (checkValue(tempBoard[4][2],4,2) == 0)
        return (false);


      if (checkValue(tempBoard[0][4],0,4) == 0)
        return (false);
      if (checkValue(tempBoard[1][4],1,4) == 0)
        return (false);
      if (checkValue(tempBoard[2][4],2,4) == 0)
        return (false);
      if (checkValue(tempBoard[3][4],3,4) == 0)
        return (false);
      if (checkValue(tempBoard[4][4],4,4) == 0)
        return (false);




        return (true);
    }

    function CheckWinChunHoon(tempBoard) {

      if (checkValue(tempBoard[0][0],0,0) == 0)
        return (false);
      if (checkValue(tempBoard[0][1],0,1) == 0)
        return (false);
      if (checkValue(tempBoard[0][2],0,2) == 0)
        return (false);

      if (checkValue(tempBoard[1][0],1,0) == 0)
        return (false);

      if (checkValue(tempBoard[2][0],2,0) == 0)
        return (false);
      if (checkValue(tempBoard[2][1],2,1) == 0)
        return (false);
      if (checkValue(tempBoard[2][2],2,2) == 0)
        return (false);

      if (checkValue(tempBoard[2][4],2,4) == 0)
        return (false);

      if (checkValue(tempBoard[3][2],3,2) == 0)
        return (false);
      if (checkValue(tempBoard[3][3],3,3) == 0)
        return (false);
      if (checkValue(tempBoard[3][4],3,4) == 0)
        return (false);

      if (checkValue(tempBoard[4][2],4,2) == 0)
        return (false);
      if (checkValue(tempBoard[4][4],4,4) == 0)
        return (false);

      return (true);
    }

////




router.get('/player2', function(req, res){

  let ident = req.query.identifier; 
  if (req.query.index == 1) {
//Create card numbers
      ident = identifier++;
      CreateCard();
      if (currentIndex == 0)
        res.json({val:req.query.index,identifier:ident,board:board1,playValid:true});    
      else
        res.json({val:req.query.index,identifier:ident,board:board1,playValid:false});    
  }
  else if (req.query.index == 2) {
//Check win    
    if (req.query.name == "") {
      res.json({val:req.query.index,identifier:ident,winner:-4});   
      return;      
    }


    if (ident != -1) {
      let name = req.query.name;
      let tempBoard = req.query.board;
      let winner = false;
      if (gameType == 1)
        winner = CheckWinRegular(tempBoard);
      else if (gameType == 2)
        winner = CheckWin4Corners(tempBoard);
      else if (gameType == 3)
        winner = CheckWinOx(tempBoard);
      else if (gameType == 4)
        winner = CheckWin2021(tempBoard);
      else if (gameType == 5)
        winner = CheckWinChunHoon(tempBoard);

// winnerReturn
// -1 = no bingo
// pos number = yes bingo and the place you finished    
      let winnerReturn = -1;
      if (winner == true) {
        if (winnerValue == 0) {
          winnerName1 = name;
        } else if (winnerValue == 1) {
          winnerName2 = name;
        }  else if (winnerValue == 2) {
          winnerName3 = name;
        }  else if (winnerValue == 3) {
          winnerName4 = name;
        }
        winnerValue++;
        winnerReturn = winnerValue;
      }

      res.json({val:req.query.index,identifier:ident,winner:winnerReturn});   
      return;
    }   
  }
  else if (req.query.index == 3) {

    if (ident != -1) {
      if (resetState) {
//polling to get reset cage.    
          res.json({val:4,identifier:ident,ballNum:0,gameType:gameType});
          return;
      }      
//polling to get mostRecentBall.    

//      let ballNumB = GetCurrentBall();
//      res.json({val:req.query.index,identifier:ident,ballNum:ballNumB,
      res.json({val:req.query.index,identifier:ident,howMany:howManyA,numbers:numbers,
      winnerName1:winnerName1,winnerName2:winnerName2,
      winnerName3:winnerName3,winnerName4:winnerName4,
      gameType:gameType});  
      return;
    }    
  }  
  else if (req.query.index == 30) {
//polling to get messages.    
      res.json({val:req.query.index,message:totalMessage});  
      return;
  }    
  else if (req.query.index == 5) {  
//A new message was sent.    
    if (ident != -1) {
      messages[currMessage] = req.query.message;
      let index = currMessage;
      currMessage++;
      if (currMessage > numMessages-1)
        currMessage = 0;

      totalMessage = "";
      for (let i=0;i<numMessages-1;i++) {
        totalMessage += messages[index] + "\n";
        index--;
        if (index < 0)
          index = numMessages-1;
      }
      totalMessage += messages[index];
      res.json({val:req.query.index,identifier:ident});  
      return;
    }    

  }    

});


module.exports = router;

