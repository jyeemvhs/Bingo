
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
      let winnerName = "";


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
      winnerName = "";

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
        cageReverse[cage[currentIndex]-1] = 1;
        if (currentIndex < numBalls-1)
          currentIndex++;
    }

router.get('/info2', function(req, res){
  let ballNum = -1;
  if (req.query.index == 2) {
    reset();
    res.json({val:req.query.index,ballNum:ballNum});
    return;
  }
  else if (req.query.index == 3) {
        ballNum = cage[currentIndex];
        ChooseBall(); 
        res.json({val:req.query.index,ballNum:ballNum});
        return;
  }
  else if (req.query.index == 4) {
        res.json({val:req.query.index,winnerName:winnerName,message:totalMessage});
         
        return;
  }


  
});




function CreateCard(_ident) {
  

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

        for (let i=0;i<currentIndex;i++) {
              if (value == cage[i])
                   return(1);
        }
        return (0);
    }

    function CheckWin(tempBoard) {
        let total = 0;
        
        for (let row=0;row<NUM_ROWS_CARD;row++) {
            total = 0;
            for (let i=0;i<NUM_COLUMNS_CARD;i++) {
                total += checkValue(tempBoard[row][i],row,i);
            }    
            console.log(total);
            if (total == NUM_ROWS_CARD)
                return (true);
        }
        for (let col=0;col<NUM_COLUMNS_CARD;col++) {
            total = 0;
            for (let i=0;i<NUM_ROWS_CARD;i++) {
                total += checkValue(tempBoard[i][col],i,col);
            }    
            console.log(total);
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
    

router.get('/player2', function(req, res){

  let ident = req.query.identifier; 
  if (req.query.index == 1) {
//Create card numbers    
    if (ident == -1) {
      ident = identifier++;
      CreateCard(ident);
    }
    res.json({val:req.query.index,identifier:ident,board:board1});    
    return;
  }
  else if (req.query.index == 2) {
//Check win    
    if (ident != -1) {
      let name = req.query.name;
      let tempBoard = req.query.board;
      let winner = CheckWin(tempBoard);

// winnerReturn
// 1 = first winner
// -1 = not winner
// 2 = winner but not first       
      let winnerReturn = -1;
      if (winner == true) {
        if (winnerValue == 0) {
          winnerReturn = 1;
          winnerName = name;
        } else
          winnerReturn = 2;
        winnerValue = 1;
      }

      res.json({val:req.query.index,identifier:ident,winner:winnerReturn});   
      return;
    }   
  }
  else if (req.query.index == 3) {

//polling to get mostRecentBall or if reset cage.    
    if (ident != -1) {
      if (resetState) {
          res.json({val:4,identifier:ident,ballNum:0,message:totalMessage});
          return;
      }      
      let ballNum = GetCurrentBall();
      res.json({val:req.query.index,identifier:ident,ballNum:ballNum,winnerName:winnerName,
        message:totalMessage});  
      return;
    }    
  }  
  else if (req.query.index == 5) {  

//A new message was sent.    
    if (ident != -1) {
//console.log(req.query.message);
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
//console.log(totalMessage);

      res.json({val:req.query.index,identifier:ident});  
      return;
    }    

  }    

});


module.exports = router;

