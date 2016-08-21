var SCREEN_WIDTH = 500;
var SCREEN_HEIGHT = 400;

window.addEventListener('load',init);

var canvas;
var ctx;
var mikanX = 0;
var mikanY = 0;
var click_count=0;
var orb_size =50;
var margin_width = 10;
var margin_height= 10;
var mouseX = 0;
var mouseY = 0;
var cur_mode;
var select_color;
var button_l=false;
var icolor =['R','G','B','Y','P','H','J','D'];
var otirand = [true,true,true,true,true,true,true,true];
var step_count=0;
var isKepri = false;

function init(){
  canvas = document.getElementById('maincanvas');

  if(document.addEventListener){

    // �}�E�X�{�^���������Ǝ��s�����C�x���g
    document.addEventListener("mousedown" , MouseEventFunc);
    // �}�E�X�J�[�\�����ړ����邽�тɎ��s�����C�x���g
    document.addEventListener("mousemove" , MouseEventFunc);
    // �}�E�X�{�^���𗣂��Ǝ��s�����C�x���g
    document.addEventListener("mouseup" , MouseEventFunc);
    // �R���e�L�X�g���j���[���\������钼�O�Ɏ��s�����C�x���g
    document.addEventListener("contextmenu" , MouseEventFunc);

    // �A�^�b�`�C�x���g�ɑΉ����Ă���
  }else if(canvas.attachEvent){

    // �}�E�X�{�^���������Ǝ��s�����C�x���g
    canvas.attachEvent("onmousedown" , MouseEventFunc);
    // �}�E�X�J�[�\�����ړ����邽�тɎ��s�����C�x���g
    canvas.attachEvent("onmousemove" , MouseEventFunc);
    // �}�E�X�{�^���𗣂��Ǝ��s�����C�x���g
    canvas.attachEvent("onmouseup" , MouseEventFunc);
    // �R���e�L�X�g���j���[���\������钼�O�Ɏ��s�����C�x���g
    canvas.attachEvent("oncontextmenu" , MouseEventFunc);

  }else{
    console.log("event listener is not found");
  }
  ctx = canvas.getContext('2d');

  margin_width =margin_width  - canvas.style.margin;
  margin_height=margin_height - canvas.style.margin;
  canvas.width = margin_width*2 + board.width*orb_size;
  canvas.height= margin_height*2 + board.height*orb_size;

  board.init();
  result.init();
  history.init();

  Asset.loadAssets(function(){
    //�A�Z�b�g�����ׂēǂݍ��ݏI�������A
    //�Q�[���̍X�V�������n�߂�悤�ɂ���
    requestAnimationFrame(update);
  })
}


function update(){
  requestAnimationFrame(update);
  board.moving(cur_mode);
  if(cur_mode== 'orbs'){
    board.change_color(select_color);
  }
  render();
  render_orbs(cur_mode);
}
function render_orbs(mode){

  for(var height = 0; height < board.height ; height++){
    for(var width = 0; width < board.width ; width++){
      var x =width*orb_size + margin_width;
      var y =height*orb_size + margin_height;
      // �h���b�v��\������
      // ����ł���h���b�v�̓}�E�X�ɒǏ]������
      if(board.cell[width][height]!== 'vanished'){
        if(board.isTouch && board.touchX == width && board.touchY == height && (mode == 'normal'|| mode =='ctw')){
          ctx.drawImage(Asset.images[board.cell[width][height]],mouseX-40,mouseY-40);
        }else{
          ctx.drawImage(Asset.images[board.cell[width][height]],x,y);
        }
      }
    }
  }

}

function render(){
  //�S�̂��N���A
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //�h���b�v��\��

  for(var height = 0; height < board.height ; height++){
    for(var width = 0; width < board.width ; width++){
      var x =width*orb_size + margin_width;
      var y =height*orb_size + margin_height;
      //�w�i��\��
      if((height+width)%2 == 0){
         ctx.drawImage(Asset.images['B1'],x,y);
      }else{
         ctx.drawImage(Asset.images['B2'],x,y);
      }
    }
  }

}




//////�摜�ǂݍ��݂̏���///////////

var Asset ={};
//�A�Z�b�g�̒�`
Asset.assets = [
  { type: 'image', name: 'R', src: 'assets/R.gif'},
  { type: 'image', name: 'G', src: 'assets/G.gif'},
  { type: 'image', name: 'B', src: 'assets/B.gif'},
  { type: 'image', name: 'Y', src: 'assets/Y.gif'},
  { type: 'image', name: 'P', src: 'assets/P.gif'},
  { type: 'image', name: 'H', src: 'assets/H.gif'},
  { type: 'image', name: 'J', src: 'assets/J.gif'},
  { type: 'image', name: 'D', src: 'assets/D.gif'},
  { type: 'image', name: 'B1', src: 'assets/B1.png'},
  { type: 'image', name: 'B2', src: 'assets/B2.png'},
];
//�ǂݍ��񂾉摜
Asset.images ={};

Asset.loadAssets = function(onComplete){
  var total = Asset.assets.length; //�A�Z�b�g�̍��v��
  var loadCount = 0;//�ǂݍ��݊��������A�Z�b�g�̐�

  //�A�Z�b�g���ǂݍ��ݏI������Ƃ��ɌĂ΂��R�[���o�b�N�֐�
  var onLoad = function(){
    loadCount++;
    if(loadCount >= total){
      onComplete();
    }
  };

  //�摜�̓ǂݍ���
  Asset._loadImage = function(asset, onLoad){
    var image = new Image();
    image.src = asset.src;
    image.onload = onLoad;
    Asset.images[asset.name] = image;
  };

  //���ׂẴA�Z�b�g��ǂݍ���
  Asset.assets.forEach(function(asset){
    switch(asset.type){
      case 'image':
        Asset._loadImage(asset, onLoad);
        break;
    }
  });


}

//�}�E�X�C�x���g�̏���
function MouseEventFunc(e){
  if(e.buttons !== undefined){
    var data = e.buttons;
    button_l = ((data & 0x0001) ? true : false);
    var button_r = ((data & 0x0002) ? true : false);
    var button_c = ((data & 0x0004) ? true : false);

    
    //�N���b�N�����ςȂ��̎�
    if(button_l){
      //���W���擾
      mouseX = e.clientX;
      mouseY = e.clientY;
          }else{
      board.isTouch = false;
      board.isBefore= false;
    }


  }
}



//�p�Y�h���̃{�[�h���쐬
var board ={};
board.height = 5;
board.width = 6;
board.cell = {};
board.isTouch = false;
board.touchX = 0;
board.touchY = 0;
board.isBefore= false;
board.beforeX = 0;
board.beforeY = 0;

board.init = function(){
  board.height = 5;
  board.width = 6;
  // cell��2�����z����쐬�����h���b�v��ǉ�����
  board.cell = new Array();
  for(var width = 0; width < board.width ; width++){
    board.cell[width] = new Array();
    for(var height =0; height<board.height ; height++){
      board.cell[width][height]='B';
    }
      board.cell[width][0]='R';
  }
  console.log("board initialize is finished .")
}

// ���E���ׂ�����h���b�v�����ւ�
board.moving = function(mode){
  //�����܂�
  if(    mouseX>= margin_width 
      && mouseX <= margin_width + board.width*orb_size
      && mouseY>= margin_height
      && mouseY <= margin_height + board.height*orb_size
      && button_l
    ){

    board.isBefore=board.isTouch;
    board.beforeX = board.touchX ;
    board.beforeY = board.touchY ;

    board.isTouch = true;
    board.touchX = Math.floor( (mouseX-margin_width)/orb_size);
    board.touchY = Math.floor( (mouseY-margin_height)/orb_size);
    console.log("clicked! ("+ board.touchX+","+board.touchY+")");
  }else{
    board.isTouch = false;
    board.isBefore= false;
  }

  if(board.isBefore && board.isTouch && (mode == 'normal' || mode == 'ctw')){
    if(board.touchX !== board.beforeX || board.touchY !== board.beforeY ){
      var tmp = board.cell[board.touchX][board.touchY];
      board.cell[board.touchX][board.touchY]=board.cell[board.beforeX][board.beforeY];
      board.cell[board.beforeX][board.beforeY]=tmp;
    }
  }
}

// color���[�h�̍ۂɐF�̕ύX���s���֐�
board.change_color= function(select){
  if(   mouseX>= margin_width 
      && mouseX <= margin_width + board.width*orb_size
      && mouseY>= margin_height
      && mouseY <= margin_height + board.height*orb_size
      && button_l){
    board.cell[board.touchX][board.touchY]=select;
  }
}

// �p�Y�����s�������ʂ�result�ɕۑ�
var result ={};
result.combo = {};
result.dell = {};
result.plus ={};
result.line= {};
result.length = {};

//�R���{���A�������h���b�v�̐��A�萔��������
result.init = function(){
  result.combo =  0;
  result.dell = new Array();
  for(var i=0; i< icolor.length ;i++){
    result.dell[icolor[i]] = new Array();
  }
  result.plus = new Array();
  for(var i=0; i< icolor.length ;i++){
    result.plus[icolor[i]] = 0;
  }
  result.line = new Array();
  for(var i=0; i< icolor.length ;i++){
    result.line[icolor[i]] = 0;
  }
  result.length = 0;
}
// �v�Z�����Aboard.cell��result���X�V
board.execute= function(){
  result.init();
  var tmp = -1;
    while(tmp !== result.combo){
      tmp = result.combo;
      board.elace(isKepri,result);
      board.falling();
      board.fill_random(otirand);
    }
}

board.fill_random = function(otirand){

  var index;
  var flag=true;
  for(var i = 0; i<otirand.length;i++){
    if(otirand[i])flag=false;
  }
  if(flag)return ;
  for(var width = 0; width < board.width ; width++){
    for(var height =board.height-1; height>=0 ; height--){
      if(board.cell[width][height] == 'vanished' ){
        do{
          index = Math.floor( Math.random()* 8);
        }while(!otirand[index]);
        board.cell[width][height] = icolor[index];
      }
    }
  }

  history.push(board.cell);
}

board.falling = function(){
  var count =board.height-1;
  for(var width = 0; width < board.width ; width++){
    count =board.height-1;
    for(var height =board.height-1; height>=0 ; height--){
      if(board.cell[width][height] !== 'vanished' ){
        board.cell[width][count] =board.cell[width][height];
        if(count !== height){
        board.cell[width][height] = 'vanished';
        }
        count-=1;
      }
    }
  }
  history.push(board.cell);
}

board.elace =function(isKepri, result){
  
  //�ԕ���p�ӂ����z��𐶐�����֐���p��
  var _make_Array = function(){
    var array = [];
    for(var width = 0; width < board.width +2 ; width++){
      array[width] = new Array();
      for(var height =0; height < board.height +2  ; height++){
        array[width][height] = 'vanished';
      }
    }
    return array;
  }

  // �z��̕����𐶐�
  function _copy_Array(src){
    var array =[];
    for(var i =0; i<src.length;i++){
      if(Array.isArray(src[i])){
        array[i] = _copy_Array(src[i]);
      }else{
        array[i] = src[i];
      }
    }
    return array;
  }

  // �z��̔�r���s��
  function _comp_Array(a,b){
    var str_a = JSON.stringify(a);
    var str_b = JSON.stringify(b);
    return str_a === str_b
  }

  var state = _make_Array();
  var erace_state= _make_Array();
  var erace_copy;


  // �ԕ���p�ӂ����z��ɔՖʂ𕡐�
  for(var width = 0; width < board.width ; width++){
    for(var height =0; height<board.height ; height++){
      state[width+1][height+1]=board.cell[width][height];
    }
  }

  //������h���b�v���擾
  for(var countW = 1; countW < board.width +1 ; countW++){
    for(var countH = 1; countH < board.height +1 ; countH++){
      //���ɂȂ����ď�����h���b�v��T��
      if(state[countW][countH]==state[countW+1][countH] 
          && state[countW][countH]==state[countW-1][countH] 
          && state[countW][countH]!=='vanished'){
        erace_state[countW][countH]   = state[countW][countH];
        erace_state[countW+1][countH] = state[countW][countH];
        erace_state[countW-1][countH] = state[countW][countH];
      }
      //�c�ɂȂ����ď�����h���b�v��T��
      if(state[countW][countH]==state[countW][countH+1] 
          && state[countW][countH]==state[countW][countH-1] 
          && state[countW][countH]!=='vanished'){
        erace_state[countW][countH]    = state[countW][countH];
        erace_state[countW][countH +1] = state[countW][countH];
        erace_state[countW][countH -1] = state[countW][countH];
      }
    }
  }

  erace_copy = _copy_Array(erace_state);

  //�ꏏ�ɏ�����h���b�v���擾���������s��
  for(var countW = 1; countW < board.width +1 ; countW++){
    for(var countH = 1; countH < board.height +1 ; countH++){
      //�u���b�N�X�R�[�v�̑���
      (function(countW,countH){
        if(erace_state[countW][countH]=='vanished')return 1;
        var tmp = _make_Array();
        var before ;
        var dirX = [1,-1,0,0];
        var dirY = [0,0,1,-1];
        tmp[countW][countH] = erace_state[countW][countH];
        
        // ��x�ɂ܂Ƃ܂��ď�����h���b�v��I�яo���B
        // todo �x��������ォ�����������Ƃ܂��ɂ���B
        do{
          before = _copy_Array(tmp);

          for(var countW = 1; countW < board.width +1 ; countW++){
            for(var countH = 1; countH < board.height +1 ; countH++){
              if(tmp[countW][countH]!=='vanished'){
                for(var dir = 0; dir < 4; dir ++){
                  if(erace_state[countW+dirX[dir]][countH+dirY[dir]] 
                      == tmp[countW][countH]){
                    tmp[countW+dirX[dir]][countH+dirY[dir]] =tmp[countW][countH];
                  }
                }
              }
            }
          }

        }while( !_comp_Array(before,tmp) );

        // erace_state����tmp�̃h���b�v������
        for(var countW = 1; countW < board.width +1 ; countW++){
          for(var countH = 1; countH < board.height +1 ; countH++){
            if(tmp[countW][countH]!=='vanished'){
              erace_state[countW][countH] = 'vanished';
            }
          }
        }

        //tmp��������擾����
        //�h���b�v�̐��𐔂���B
        //����������邩�ǂ���
        //�\�����������邩�ǂ���
        var count = 0;
        var color;
        var isPlus = false;
        var isLine = false;
        var isBufLine = true;
        for(var countH = 1; countH < board.height +1 ; countH++){
          isBufLine =true;
          for(var countW = 1; countW < board.width +1 ; countW++){
            if(tmp[countW][countH]!=='vanished'){
              count++;
              color = tmp[countW][countH];
              if( tmp[countW][countH] == tmp[countW+1][countH] 
                  &&tmp[countW][countH] == tmp[countW-1][countH] 
                  &&tmp[countW][countH] == tmp[countW][countH+1] 
                  &&tmp[countW][countH] == tmp[countW+1][countH-1] 
                ){
                isPlus = true;
               }
            }else{
              isBufLine = false;
            }
          }
          if(isBufLine) isLine =true;
        }
        if(count !== 5) isPlus = false; 
        console.log(count);
        if(isKepri&&count<=4){
          // erace_state����tmp�̃h���b�v������
          for(var countW = 1; countW < board.width +1 ; countW++){
            for(var countH = 1; countH < board.height +1 ; countH++){
              if(tmp[countW][countH]!=='vanished'){
                erace_copy[countW][countH] = 'vanished';
              }
            }
          }
        }else{
          // ���ʂ�result�ɋL�^
          result.combo +=1;
          result.dell[color].push(count);
          if(isLine) result.line[color] += 1;
          if(isPlus) result.plus[color] += 1;
        }

      })(countW,countH);
    }
  }

  //board����R���{�ŏ������h���b�v������
  for(var width = 0; width < board.width ; width++){
    for(var height =0; height<board.height ; height++){
      if(erace_copy[width+1][height+1]!== 'vanished'){
        board.cell[width][height] = 'vanished';
      }
    }
  }
  history.push(board.cell);
  return  0;
}

//�{�^���̃N���b�N��������
function set_mode(mode){
  cur_mode=mode;
  console.log(cur_mode);
  history.push(board.cell);
}

function set_color(clr){
  cur_mode="orbs"
    select_color = clr;
  console.log(select_color);
}
// �{�[�h�̑傫����ύX
function newBoard(){
  if(isFinite(document.dict.width.value)&&isFinite(document.dict.height.value)){
    if(   document.dict.width.value>0 
        &&document.dict.width.value<20
        &&document.dict.height.value>0 
        &&document.dict.height.value<20
      ){
        board.width=document.dict.width.value;
        board.height=document.dict.height.value;
        canvas.width = margin_width*2 + board.width*orb_size;
        canvas.height= margin_height*2 + board.height*orb_size;

      }else{
        alert("1����19�܂ł̔��p��������͂��Ă��������B");
      return ;
    }
  }else{
    alert("��������͂��Ă�������(1�ȏ�20����)");
    return ;
  }

  console.log(document.dict.width.value);
  // cell��2�����z����쐬�����h���b�v��ǉ�����
  board.cell = new Array();
  for(var width = 0; width < board.width ; width++){
    board.cell[width] = new Array();
    for(var height =0; height<board.height ; height++){
      board.cell[width][height]='B';
    }
      board.cell[width][0]='R';
  }
  
}

//�����O�`
function unko_no_umi(){
  for(var height = 0; height < board.height ; height++){
    for(var width = 0; width < board.width ; width++){
      board.cell[width][height]='D';
    }
  }

}

function onRadioButtonChange(entry){
  otirand[entry]=!otirand[entry];
  console.log(otirand);
}

function stepbystep(){
  if(step_count%3 == 0){
    board.elace(isKepri,result);
  }else if(step_count%3 ==1){
    board.falling();
  }else{
    board.fill_random(otirand);
  }
  step_count+=1;
}
function stepbystep_without_otikon(){
  if(step_count%3 == 0){
    board.elace(isKepri,result);
  }else if(step_count%3 ==1){
    board.falling();
  }else{
    step_count+=1;
    stepbystep_without_otikon();
    step_count-=1;
  }
  step_count+=1;
}

function change_mode_Kepri(){
  isKepri = !isKepri;
  console.log(isKepri);
}
function erace_button(){
board.elace(isKepri,result);
}

//�z��̃R�s�[
function copy_Array(src){
  var array =[];
  for(var i =0; i<src.length;i++){
    if(Array.isArray(src[i])){
      array[i] = copy_Array(src[i]);
    }else{
      array[i] = src[i];
    }
  }
  return array;
}

////////////////////�����@�\//////////////////////
//  �����ɒǉ��Fhistory.push(src);              //
//  ���ɐi�ށFhistory.next(src);                //
//  �O�ɖ߂�Fhistory.prev(src);                //
//////////////////////////////////////////////////
var history ={};
history.id ={};
history.cur ={};
history.index ={};
history.max = {};
history.data ={};

//�����̏�����
history.init = function(){
  history.id = [];
  history.cur = 0;
  history.maxid = 0;
  history.max = 100;
  history.data = [];
};

//���̗����ɐi��
history.next = function(src){
 var curindex = history.id.indexOf(history.cur);
 var nextindex = curindex+1;
 if(nextindex < history.id.length){
   history.cur = history.id[nextindex];
 history.load(src);
 }
}

//�O�̗����ɖ߂�
history.prev = function(src){
 var curindex = history.id.indexOf(history.cur);
 var previndex = curindex-1;
 if(previndex >=0){
   history.cur = history.id[previndex];
   history.load(src);
 }
}

//cur�̗�����ǂݏo����src�ɃR�s�[����@�\
history.load = function(src){
 var curindex = history.id.indexOf(history.cur);
 board.cell = copy_Array(history.data[curindex])
}

//�ŐV�̍s����ǉ�
history.push = function(src){
  history.maxid++;
  while(history.id.length >0 && history.id.indexOf(history.cur) !== ( history.id.length -1) ){
    history.pop_back();
  }
  history.id.push(history.maxid);
  history.data.push(copy_Array(src));
  history._checksize();
  history.cur=history.maxid;
  console.log(history);
}
//�ŐV�̍s�����폜
history.pop_back = function(){
  //id + data ��popback
  history.id.pop();
  history.data.pop();
}

//�Ō�̍s�����폜
history.pop_front = function(){
  history.id.shift();
  history.data.shift();
}

//�q�X�g���[�T�C�Y�̃`�F�b�N���s���A�Â��s�����폜����
history._checksize = function(){
  while(history.data.length > history.max ){
    history.pop_front();
  }
}

//�ŏ��̍s���Ɉړ�
history.first = function(src){
  if(history.id.length<=0)return 1;
 history.cur = history.id[0];
 history.load(src);
 return 0;
}

//�Ō�̍s���Ɉړ�
history.end = function(src){
  if(history.id.length<=0)return 1;
 history.cur = history.id[history.id.length-1];
 history.load(src);
 return 0;
}
//�����{�^���̐���
function onHistoryButton(nButton){
  console.log(nButton+"is clicked ")
  if(nButton == 0){
    history.first(board.cell);
  }else if(nButton ==1){
    history.prev(board.cell);
  }else if(nButton ==2){
    history.next(board.cell);
  }else if(nButton ==3){
    history.end(board.cell);
  }
  console.log(history);
}
