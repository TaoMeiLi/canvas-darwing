/* jshint esversion: 6 */ 
import React, { Component } from 'react';
import { } from 'react-bootstrap';
import './App.less';
import canvasData from './App_json';
import LineWidth from './components/lineWidth/index';
import SetColor from './components/setColor/index';

let myCanvas = null,
  pen = null;
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tools: canvasData.tool,
      backgroundSet: canvasData.backgroundSet,
      canvasWidth: '800',   
      canvasHeight: '500',
      toolType: 'freeForm',               // 默认工具 => 曲线
      lineWidth: 1,                       // 线宽
      lineColor: 'rgba(0,0,0,1)',         // 线条颜色
      backgroundColor: 'rgba(0,0,0,1)',    // 画布背景颜色
      backgroundSetType: 2,                // 画布背景设置 0:无背景  1:背景颜色 2:背景图
      isDown: false,
      isOver: false,
      isUp: false,
      isMove: false,
      penStartX: 0,
      penStartY: 0
    };
  }
  render() {
    let { canvasWidth, canvasHeight, tools, lineWidth, lineColor, backgroundColor, backgroundSet,backgroundSetType } = this.state;
    if (!canvasData) return false;

    return (
      <div className="App">
        <aside className="toolBar">
          <p>工具栏</p>
          {
            tools.map((item,index)=> (
              <button 
                className={`tool ${item.type}_tool ${item.selected ? "active" : ''}`} 
                key={index}
                data-type={item.type}
                onClick={this.onClickToolBar.bind(this,item.type)}></button>
            ))
          }
         <LineWidth 
          lineWidth={lineWidth}
          setLineWidth={this.setLineWidth.bind(this)} />
          <div className="line-color">
              <label>线条颜色</label>
              <div className="line-preview-color"  onClick={this.onCheckColor.bind(this,'lineColor')}></div>
          </div>
          
          <div className="control-background">
            画布背景
            <select name="canvasBackground" value={backgroundSetType} id="canvasBackground" onChange={this.onChangeCanvasBackground.bind(this)}>
              {
                backgroundSet.map((item,index) => (
                  <option value={item.type} key={index} >{item.name}</option>
                ))
              }
            </select>
          </div>

          {
            backgroundSetType === 1 
            ? <div className="background-color">
                <label>画布背景颜色</label>
                <div className="fill-preview-color" onClick={this.onCheckColor.bind(this,'backgroundColor')}></div>
            </div>
            : null
          }
          
          {
            backgroundSetType === 2 
            ? <div className="file-box">
                <label>选择画布背景图</label>
                <input className="file" type="file" name="imgurl" id="file" /> 
            </div>
            : null
          }
          <div className="btns">
              <button className="btn clear">清空画布</button>
              <button className="btn save">保存绘画</button>
          </div>
        </aside>
        <div className="canvasBox">
          <canvas 
            id="myCanvas" 
            width={canvasWidth} 
            height={canvasHeight}
            onMouseDown={this.myCanvasOnMouseDown.bind(this)}
            onMouseMove={this.myCanvasOnMouseMove.bind(this)}
            onMouseUp={this.myCanvasOnMouseUp.bind(this)}
            onMouseOver={this.myCanvasOnMouseOver.bind(this)} >
          </canvas>
        </div>
      </div>
    );
  }
  componentDidMount() {
    myCanvas = document.getElementById('myCanvas'),
    pen = myCanvas.getContext("2d");


  }
  /**
   * 画图
   */
  // 按下鼠标
  myCanvasOnMouseDown(ev) {
    console.log('down')
    this.setState({
      isDown: true,
      isUp: false
    })
    let penStartX = ev.pageX - myCanvas.offsetLeft,
        penStartY = ev.pageY - myCanvas.offsetTop,
        { lineColor, lineWidth, toolType} = this.state,
        _me = this;

    pen.save();
    pen.beginPath();

    switch(toolType) {
      case 'freeForm':
        _me.freeFormToolDown(penStartX,penStartY);
        break;
      case 'line':
        _me.lineToolDown(penStartX,penStartY);
        break;
      case 'arrow':
        _me.arrowToolDown(penStartX,penStartY);
        break;
      case 'box':
        _me.boxToolDown(penStartX,penStartY);


    }
      
      
  }

  // 移动鼠标
  myCanvasOnMouseMove(ev) {
    const { isDown ,isUp, toolType } = this.state;
    let pageX = ev.pageX - myCanvas.offsetLeft,
        pageY = ev.pageY - myCanvas.offsetTop,
        _me = this;

    if(isDown && !isUp) {
      console.log('move')
      switch(toolType) {
        case 'freeForm':
          _me.freeFormToolMove(pageX,pageY);
          break;
        case 'erase':
          _me.eraseToolMove(pageX,pageY);
          break;
      }
    } else {
      ev.preventDefault();
      return;
    }
   
  }

  // 松开鼠标
  myCanvasOnMouseUp(ev) {
    this.setState({
      isDown: false,
      isUp: true
    })
    let { toolType } = this.state, 
        pageX = ev.pageX - myCanvas.offsetLeft,
        pageY = ev.pageY - myCanvas.offsetTop,
        _me = this;
    switch(toolType) {
      case 'line':
        _me.lineToolUp(pageX,pageY);
        break;
      case 'arrow': 
        _me.arrowToolUp(pageX,pageY);
        break;
      case 'box': 
        _me.boxToolUp(pageX,pageY);
        break;
      
    }
    console.log('up')
  }

  myCanvasOnMouseOver(ev) {
    console.log('over')
    ev.preventDefault();
  }

  // 更新lineWidth
  setLineWidth(lineWidth){
    this.setState({
      lineWidth
    })
  }
  // 选择工具
  onClickToolBar(type,e) {
    let {tools} = this.state,
    toolType = this.state.toolType;
    tools.forEach((item,index) => {
      tools[index].selected = false;
      if(item.type === type) {
        tools[index].selected = true;
        toolType = tools[index].type;
      }
    }); 
    console.log(toolType,'工具');
    this.setState({
      tools,
      toolType,
    });
  }

  // 打开颜色选择器
  onCheckColor(type){
    let { lineColor, backgroundColor} = this.state;
    console.log(type);

  }

  // 选择画布背景
  onChangeCanvasBackground(e) {
    let newType = Number(e.target.value);
    this.setState({
      backgroundSetType:newType
    })
  }

  /**
   * 曲线
   */
  freeFormToolDown(penStartX,penStartY) {
    let {lineColor, lineWidth} = this.state;

    pen.strokeStyle = lineColor;
    pen.lineWidth = lineWidth; 
    pen.lineCap="round";
    pen.moveTo(penStartX, penStartY);
  }
  freeFormToolMove(pageX,pageY) {
    pen.lineTo(pageX, pageY);
    pen.stroke();
  }

  /**
   * 直线
   */
  lineToolDown(penStartX,penStartY) {
    let {lineColor, lineWidth} = this.state;

    pen.strokeStyle = lineColor;
    pen.lineWidth = lineWidth; 
    pen.lineCap="round";
    pen.moveTo(penStartX, penStartY);
  }
  lineToolUp(pageX,pageY) {
    pen.lineTo(pageX,pageY);
    pen.closePath();
    pen.stroke();
  }

  /**
   * 箭头
   */
  arrowToolDown(penStartX,penStartY) {
    this.setState({
      penStartX,
      penStartY,
    })
    let {lineColor, lineWidth} = this.state;

    pen.strokeStyle = lineColor;
    pen.lineWidth = lineWidth;
    pen.lineCap="round";
    // 线
    pen.moveTo(penStartX,penStartY);
  }
  arrowToolUp(pageX,pageY) {
    let endX = pageX,
        endY = pageY,
        {lineColor, lineWidth,penStartX,penStartY} = this.state,
        angle = Math.atan2((endY-penStartY),(endX-penStartX));
        console.log(angle,'angle');
    pen.lineTo(endX,endY);
    pen.stroke();
    pen.restore(); 

    // 三角形
    let LEN = lineWidth * 5;
    pen.save();
    pen.beginPath();
    pen.translate(endX, endY);
    pen.rotate(Math.PI/2+angle);
    pen.lineWidth = 1;
    pen.strokeStyle = lineColor;
    pen.moveTo(0,0);
    pen.lineTo(-LEN/2,Math.sqrt(Math.pow(LEN,2) - Math.pow(LEN/2,2)));
    pen.lineTo(LEN/2,Math.sqrt(Math.pow(LEN,2) - Math.pow(LEN/2,2)));
    pen.fillStyle = lineColor;
    pen.fill();
    pen.closePath();
    pen.stroke();
    pen.translate(0, 0);
    pen.restore();
  }
  /**
   * 矩形
   */
  boxToolDown(penStartX,penStartY) {
    this.setState({
      penStartX,
      penStartY,
    })
    let {lineColor, lineWidth} = this.state;
    pen.lineWidth = lineWidth;
    pen.strokeStyle = lineColor;
  }
  boxToolUp(pageX,pageY) {
    let { penStartX,penStartY } = this.state;
    let w = pageX - penStartX,
        h = pageY - penStartY;
                    
    pen.rect(penStartX, penStartY, w, h );
    pen.stroke();
  }

  /**
   * 橡皮擦
   */
  eraseToolMove(pageX,pageY) {
    let { lineWidth } = this.state;
    pen.save()
    pen.beginPath()
    pen.arc(pageX,pageY,lineWidth/2,0,2*Math.PI);
    pen.clip()
    pen.clearRect(0,0,myCanvas.width,myCanvas.height);
    pen.restore();
  }
  /**
   * 文字
   */
  text(){
    
  }

}

export default App;
