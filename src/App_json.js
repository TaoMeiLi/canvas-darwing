const canvasData = {
    tool: [
        {
            name: "曲线",
            type: "freeForm",
            selected: true
        },
        {
            name: "直线",
            type: "line",
            selected: false
        },
        {
            name: "剪头",
            type: "arrow",
            selected: false
        },
        {
            name: "矩形",
            type: "box",
            selected: false
        },
        {
            name: "文字",
            type: "text",
            selected: false
        },
        {
            name: "橡皮擦",
            type: "erase",
            selected: false
        }
    ],
    backgroundSet: [
        {
            name: "透明背景",
            type: 0,
            selected: false
        },
        {
            name: "背景颜色",
            type: 1,
            selected: false
        },
        {
            name: "背景图",
            type: 2,
            selected: true
        }
    ]
};

export default canvasData;