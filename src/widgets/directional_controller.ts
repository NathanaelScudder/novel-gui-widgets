import { Circle } from "@svgdotjs/svg.js";
import {IdleUpWidgetState, DragWindowState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Text, Box} from "../core/ui";

class DragDot extends Widget {
    private _body: Circle;
    private defaultRadius: number = 12;
    private isDragging = false;
    private xPos: number = 0;
    private yPos: number = 0;
    private startDragX = 0;
    private startDragY = 0;
    private controller: DirectionalController;

    constructor(parent:Window, controller: DirectionalController){
        super(parent);
        // set defaults
        this.height = this.defaultRadius;
        this.width = this.defaultRadius;
        this.controller = controller;

        // set Aria role
        this.role = RoleType.widget;
        // mark widget as draggable
        this.isDraggable = true;
        // set default or starting state
        this.setState(new IdleUpWidgetState());

        // render widget
        this.render();
    }

    set radius(newRadius: number) {
        this.height = newRadius;
        this.width = newRadius;
        this.update();
    }

    get radius(): number {
        return this.width;
    }

    get x(): number {
        return +this.outerSvg.x();
    }

    get y(): number {
        return +this.outerSvg.y();
    }

    get centerX(): number {
        return +this.outerSvg.x() + this.width;
    }

    get centerY(): number {
        return +this.outerSvg.y() + this.width;
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._body = this._group.circle(this.defaultRadius)
                                .stroke("black")
                                .fill("green")
                                .move(1,25);

        // Set the outer svg element 
        this.outerSvg = this._group;

        this.backcolor = "green";
        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this._body);
    }

    private initMove(clientX: number, clientY: number){
        this.isDragging = true;
        this.xPos = +this.outerSvg.x();
        this.yPos = +this.outerSvg.y();
        this.startDragX = clientX;
        this.startDragY = clientY;
    }

    private moveObj(event: MouseEvent){
        window.requestAnimationFrame(() => {
            const deltaY = event.clientY - this.startDragY; 
            const deltaX = event.clientX - this.startDragX; 
            const newY = deltaY + this.yPos;
            const newX = deltaX + this.xPos;

            if (this.isInBounds(newX + this.radius, newY + this.radius)) {
                this.move(newX, newY);
                this.raise(new EventArgs(this), new DragWindowState());
            }
        });
    }

    private isInBounds(newX: number, newY: number): boolean {
        return ((newX - this.controller.centerX) ** 2) + ((newY - this.controller.centerY) ** 2)
         < (this.controller.radius ** 2);
    }

    override update(): void {
        if(this._body != null) {
            this._body.fill(this.backcolor);
            this._body.radius(this.width);
        }
            
        super.update();
    }

    snapBackToCenter() {
        this.move(+this.controller.outerSvg.x() + this.controller.radius - this.radius,
            +this.controller.outerSvg.y() + this.controller.radius - this.radius);

        this.raise(new EventArgs(this));
    }

    onDrag(dragAction: {(widgetState: EventArgs): void}): void {
        this.attach(() => {
            dragAction(new EventArgs(this, new DragWindowState(),
             {dragFactor: parseFloat(this.getDragFactor().toFixed(2)),
              angle: parseFloat(this.getAngle().toFixed(2))}));
        })
    }

    private getDragFactor(): number {
        return (Math.sqrt(((this.centerX - this.controller.centerX) ** 2) + ((this.centerY - this.controller.centerY) ** 2)))
            / this.controller.radius;
    }

    private getAngle(): number {
        return (Math.atan2(this.controller.centerY - this.centerY, this.controller.centerX - this.centerX)) * (180 / Math.PI);
    }

    idleupState(): void {
        this.snapBackToCenter();
    }
    idledownState(): void {
    }
    pressedState(): void {
        if (this.rawEvent != null) {
            let e = this.rawEvent as MouseEvent;
            this.initMove(e.clientX, e.clientY);
        }
    }
    pressReleaseState(): void {
        this.snapBackToCenter();
    }
    hoverState(): void {
        this.isDragging = false;
    }
    hoverPressedState(): void {
    }
    pressedoutState(): void {
        this.snapBackToCenter();
    }
    moveState(): void {
        if (this.isDragging){
            if (this.rawEvent != null){
                let e = this.rawEvent as MouseEvent;
                this.moveObj(e);
                this.raise(new EventArgs(this));
            }
        }
    }
    keyupState(keyEvent?: KeyboardEvent): void {
    }
}

class DirectionalController extends Widget {
    private _body: Circle;
    private defaultRadius: number = 60;
    private dragDot: DragDot;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "Directional Controller";
    private defaultFontSize: number = 18;

    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultRadius;
        this.width = this.defaultRadius;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;

        // set Aria role
        this.role = RoleType.widget;
        // mark widget as draggable
        this.isDraggable = true;
        // set default or starting state
        this.setState(new IdleUpWidgetState());

        // render widget
        this.render();
    }

    set radius(newRadius: number) {
        this.height = newRadius;
        this.width = newRadius;
        this.update();
    }

    get radius(): number {
        return this.width;
    }

    get centerX(): number {
        return +this.outerSvg.x() + this.width;
    }

    get centerY(): number {
        return +this.outerSvg.y() + this.width;
    }

    set fontSize(size:number){
        this._fontSize= size;
        this.update();
    }

    set label(text: string) {
        this._input = text;
        this.update();
    }

    get label(): string {
        return this._input;
    }

    override update(): void {
        if (this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }

        if(this._body != null) {
            this._body.fill(this.backcolor);
            this._body.radius(this.width);
        }
        
        this.dragDot.snapBackToCenter();
        super.update();
    }

    private positionText() {
        let box:Box = this._text.bbox();

        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._body.y() + ((+this._body.height()/2)) - (box.height/2));
        this._text.x(+this._body.x() + (+this._body.width()) + 10);

        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this._body = this._group.circle(this.width);
        this._body.stroke("black");
        this._text = this._group.text(this._input);

        this._backcolor = "white";
        
        // Set the outer svg element 
        this.outerSvg = this._group;

        this.dragDot = new DragDot(this.parent as Window, this);
        this.dragDot.radius = this.width / 4;
    }

    override move(x: number, y: number): void {
        super.move(x, y);

        this.dragDot.move(x + (this.width / 4), y + (this.width / 4));

        this.update();
    }

    onDrag(dragAction: {(widgetState: EventArgs): void}): void {
        this.dragDot.onDrag(dragAction);
    }

    idleupState(): void {
    }
    idledownState(): void {
    }
    pressedState(): void {
    }
    pressReleaseState(): void {
    }
    hoverState(): void {
    }
    hoverPressedState(): void {
    }
    pressedoutState(): void {
    }
    moveState(): void {
    }
    keyupState(keyEvent?: KeyboardEvent): void {
    }
}

export {DirectionalController};