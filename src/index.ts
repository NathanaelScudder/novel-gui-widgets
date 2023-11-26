import { Shape, Text } from "@svgdotjs/svg.js";
import { GridLayoutManager } from "./core/grid";
import {EventArgs, Window} from "./core/ui"
import {Button} from "./widgets/button"
import { CheckBox } from "./widgets/check_box";
import { DirectionalController } from "./widgets/directional_controller";
import {Heading} from "./widgets/heading"
import { RadioGroup } from "./widgets/radio_group";
import { Direction, ScrollBar } from "./widgets/scroll_bar";
import { TextBox } from "./widgets/textbox";

let w = new Window(window.innerHeight-10,'100%');

const gridMinY = 8;
const gridMinX = 160;
const gridMaxY = 360;
const gridMaxX = 660;
const group = w.window.group();
const gridSquare = group.rect(gridMaxX - gridMinX, gridMaxY - gridMinY);
gridSquare.move(gridMinX, gridMinY);
gridSquare.stroke("black");
gridSquare.fill("white");

const moveableObjectWidth = 20;
let moveableObject: Shape = undefined;

const centerObject = (): void => {
    if (moveableObject) {
        moveableObject.move(gridMinX + ((gridMaxX - gridMinX) / 2), gridMinY + ((gridMaxY - gridMinY) / 2));
    }
};

let objectBlue = 0;
let objectRed = 0;
let objectGreen = 0;

let radioGroup = new RadioGroup(w, 3);
radioGroup.tabindex = 6;
radioGroup.fontSize = 14;
radioGroup.radius = 25;
radioGroup.label = ["Rectangle", "Circle", "Ellipse"];
radioGroup.onClick((buttonState: EventArgs) => {
    const {id, state} = buttonState.itemRef;
    console.log(`Radio button "${buttonState.obj._input}" with id ${id} was set to ${(state) ? "active" : "inactive"}`);
    if (state) {
        if (moveableObject) {
            moveableObject.remove();
        }

        switch (id) {
            case 1:
                moveableObject = group.rect(moveableObjectWidth, moveableObjectWidth);
                break;
            case 2:
                moveableObject = group.circle(moveableObjectWidth);
                break;
            case 3:
                moveableObject = group.ellipse(moveableObjectWidth, moveableObjectWidth / 2);
                break;
        }
        
        moveableObject.fill(`rgb(${objectRed}, ${objectGreen}, ${objectBlue})`);
        moveableObject.stroke("black");
        centerObject();
    }
});
radioGroup.move(12, 140);

let consoleGrid = new GridLayoutManager(3, 1, 120, 40, w);
consoleGrid.createGridVisualization();

let ckbx1 = new CheckBox(w);
ckbx1.tabindex = 3;
ckbx1.fontSize = 14;
ckbx1.boxWidth = 25;
ckbx1.boxHeight = 25;
ckbx1.label = "Blue";
ckbx1.onClick((buttonState: EventArgs) => {
    console.log(`Checkbox "${buttonState.obj._input}" was ${(buttonState.itemRef) ? "checked" : "unchecked"}`);
    objectBlue = (buttonState.itemRef) ? 255 : 0;
    if (moveableObject) {
        moveableObject.fill(`rgb(${objectRed}, ${objectGreen}, ${objectBlue})`);
    }
});

let ckbx2 = new CheckBox(w);
ckbx2.tabindex = 4;
ckbx2.fontSize = 14;
ckbx2.boxWidth = 25;
ckbx2.boxHeight = 25;
ckbx2.label = "Green";
ckbx2.onClick((buttonState: EventArgs) => {
    console.log(`Checkbox "${buttonState.obj._input}" was ${(buttonState.itemRef) ? "checked" : "unchecked"}`);
    objectGreen = (buttonState.itemRef) ? 255 : 0;
    if (moveableObject) {
        moveableObject.fill(`rgb(${objectRed}, ${objectGreen}, ${objectBlue})`);
    }
});

let ckbx3 = new CheckBox(w);
ckbx3.tabindex = 5;
ckbx3.fontSize = 14;
ckbx3.boxWidth = 25;
ckbx3.boxHeight = 25;
ckbx3.label = "Red";
ckbx3.onClick((buttonState: EventArgs) => {
    console.log(`Checkbox "${buttonState.obj._input}" was ${(buttonState.itemRef) ? "checked" : "unchecked"}`);
    objectRed = (buttonState.itemRef) ? 255 : 0;
    if (moveableObject) {
        moveableObject.fill(`rgb(${objectRed}, ${objectGreen}, ${objectBlue})`);
    }
});

consoleGrid.addWidget({
    element: ckbx1
});

consoleGrid.addWidget({
    element: ckbx2
});


consoleGrid.addWidget({
    element: ckbx3
});

let btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14;
btn.buttonHeight = 40;
btn.label = "Reset";
btn.move(12, 320);
btn.onClick((buttonState: EventArgs) => {
    console.log(`Button "${buttonState.obj._input}" was clicked`);
    centerObject();
});

let currentFactor = 0;
let distance = 25;
let currentAngle = 0;

let directionalController = new DirectionalController(w);
directionalController.move(720, 250);
directionalController.label = "Object Control";
directionalController.onDrag((widgetState: EventArgs) => {
    const {dragFactor, angle} = widgetState.itemRef;
    console.log(`dragFactor: ${dragFactor}, angle: ${angle}`);
    currentFactor = dragFactor;
    currentAngle = angle * (Math.PI / 180);
});

setInterval(() => {
    if (moveableObject && currentFactor != 0) {
        const dx = +moveableObject.x() - (distance * Math.cos(currentAngle) * currentFactor)
        const dy = +moveableObject.y() - (distance * Math.sin(currentAngle) * currentFactor)

        if ((dx < (gridMaxX - moveableObjectWidth) && dx > gridMinX) && 
            (dy < (gridMaxY - moveableObjectWidth) && dy > gridMinY)) {
            moveableObject.move(dx, dy);
        }
    }
}, 250);