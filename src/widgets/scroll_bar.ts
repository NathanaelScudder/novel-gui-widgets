import { Gradient } from "@svgdotjs/svg.js";
import {IdleUpWidgetState, PressedWidgetState, DragWindowState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";
import { Button } from "./button";

export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
}

class ScrollRail extends Widget {
    private _rect: Rect;
    private defaultWidth: number = 80;
    private defaultHeight: number = 15;
    private eventRect: Rect;
    private clientX: number = 0;
    private clientY: number = 0;

    constructor(parent:Window) {
        super(parent);
        // set defaults
        this.height = this.defaultWidth;
        this.width = this.defaultHeight;
        // set Aria role
        this.role = RoleType.none;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
    }

    set railWidth(newSize: number) {
        this.width = newSize;
        this.update();
    }

    get railWidth(): number {
        return this.width;
    }

    set railHeight(newSize: number) {
        this.height = newSize;
        this.update();
    }

    get railHeight(): number {
        return this.height;
    }

    get x(): number {
        return +this.outerSvg.x();
    }

    get y(): number {
        return +this.outerSvg.y();
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("black");

        this._backcolor = "white";
        
        // Set the outer svg element 
        this.outerSvg = this._group;
        // Add a transparent rect on top of text to 
        // prevent selection cursor and to handle mouse events
        this.eventRect = this._group.rect(this.width, this.height).opacity(0).attr('id', 0);

        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this.eventRect);
    }

    override update(): void {
        if(this._rect != null) {
            this._rect.fill(this.backcolor);
            this._rect.width(this.width);
            this._rect.height(this.height);
            this.eventRect.width(this.width);
            this.eventRect.height(this.height);
        }
        
        super.update();
    }

    onClick(railAction: {(railState: EventArgs): void}): void {
        this.attach(() => {
            railAction(new EventArgs(this, new PressedWidgetState(),
                {"xPos": this.clientX, "yPos": this.clientY}));
        });
    }
    
    idleupState(): void {
        // unimplemented
    }
    idledownState(): void {
        // unimplemented
    }
    pressedState(): void {
        if (this.rawEvent != null){
            let e = this.rawEvent as MouseEvent;
            this.clientX = e.clientX;
            this.clientY = e.clientY;
            this.raise(new EventArgs(this));
        }
    }
    pressReleaseState(): void {
        // unimplemented
    }
    hoverState(): void {
        // unimplemented
    }
    hoverPressedState(): void {
        // unimplemented
    }
    pressedoutState(): void {
        // unimplemented
    }
    moveState(): void {
        // unimplemented
    }
    keyupState(keyEvent?: KeyboardEvent): void {
        // unimplemented
    }
}

class ScrollThumb extends Widget {
    private _body: Rect;
    // private defaultWidth: number = 50;
    private defaultWidth: number = 150;
    private defaultHeight: number = 50;
    private isDragging = false;
    private xPos: number = 0;
    private yPos: number = 0;
    private startDragX = 0;
    private startDragY = 0;
    private minY: number = 0;
    private maxY: number = 1000;
    private draggedDirection: Direction;

    constructor(parent:Window, minY: number, maxY: number){
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this.minY = minY;
        this.maxY = maxY;

        // set Aria role
        this.role = RoleType.none;
        //mark widget as draggable
        this.isDraggable = true;
        // set default or starting state
        this.setState(new IdleUpWidgetState());

        // render widget
        this.render();
    }

    set minimumScroll(newMinimum: number) {
        this.minY = newMinimum;
        this.update();
    }

    set maximumScroll(newMaximum: number) {
        this.maxY = newMaximum;
        this.update();
    }

    get x(): number {
        return +this.outerSvg.x();
    }

    get y(): number {
        return +this.outerSvg.y();
    }

    set thumbWidth(newSize: number) {
        this.width = newSize;
        this.update();
    }

    get thumbWidth(): number {
        return this.width;
    }

    set thumbHeight(newSize: number) {
        this.height = newSize;
        this.update();
    }

    get thumbHeight(): number {
        return this.height;
    }

    render(): void {
        this._group = (this.parent as Window).window.group();


        this._body = this._group.rect(this.defaultWidth,this.defaultHeight).stroke("black").fill("green").move(1,25);

        // Set the outer svg element 
        this.outerSvg = this._group;

        this.backcolor = "green";
        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this._body);
    }
    
    private initMove(clientX:number, clientY:number){
        this.isDragging = true;
        this.xPos = +this.outerSvg.x();
        this.yPos = +this.outerSvg.y();
        this.startDragX = clientX;
        this.startDragY = clientY;
    }
    
    private moveObj(event: MouseEvent){
        window.requestAnimationFrame(() => {
            const deltaY = event.clientY - this.startDragY; 
            const newY = deltaY + this.yPos;

            if (newY >= this.minY && newY <= this.maxY) {
                this.draggedDirection = (newY > this.yPos) ? Direction.DOWN : Direction.UP;
                this.move(this.xPos, newY);
                this.raise(new EventArgs(this));
            }
        });
    }

    override update(): void {
        if(this._body != null) {
            this._body.fill(this.backcolor);
            this._body.width(this.width);
            this._body.height(this.height);
        }
            
        super.update();
    }

    onDrag(dragAction: {(widgetState: EventArgs): void}): void {
        this.attach(() => {
            dragAction(new EventArgs(this, new DragWindowState(), this.draggedDirection));
        })
    }

    idleupState(): void {
    }
    idledownState(): void {
    }
    pressedState(): void {
        if (this.rawEvent != null){
            let e = this.rawEvent as MouseEvent;
            this.initMove(e.clientX, e.clientY);
        }
    }
    pressReleaseState(): void {
    }
    hoverState(): void {
        this.isDragging = false;
    }
    hoverPressedState(): void {
    }
    pressedoutState(): void {
    }
    moveState(): void {
        if (this.isDragging){
            if (this.rawEvent != null){
                let e = this.rawEvent as MouseEvent;
                this.moveObj(e);
            }
        }
    }
    keyupState(keyEvent?: KeyboardEvent): void {
    }
}

class ScrollBar extends Widget {
    private thumbdivisor: number = 10;
    private defaultHeight: number = 160;
    private defaultWidth: number = 25;
    private scrollRail: ScrollRail;
    private upButton: Button;
    private downButton: Button;
    private scrollThumb: ScrollThumb;

    constructor(parent:Window) {
        super(parent);

        // set Aria role
        this.role = RoleType.scrollbar;

        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        // prevent text selection
        this.selectable = false;
    }

    set barHeight(newHeight: number) {
        this.scrollRail.railHeight = newHeight;
        this.update();
    }

    private snapToTop(): boolean {
        if (this.scrollThumb.y <= this.scrollRail.y) {
            this.scrollThumb.move(this.scrollThumb.x, this.scrollRail.y)
            return true;
        }

        return false;
    }

    private snapToBottom(): boolean {
        if (this.scrollThumb.y >= (this.scrollRail.y + this.scrollRail.railHeight - this.downButton.buttonHeight)) {
            this.scrollThumb.move(this.scrollThumb.x, this.scrollRail.y + this.scrollRail.railHeight - this.downButton.buttonHeight)
            return true;
        }

        return false;
    }

    onChange(changeAction: {(widgetState: EventArgs): void}): void {
        this.upButton.onClick((buttonState: EventArgs) => {
            const currentY = this.scrollThumb.y;
            const newY = this.scrollThumb.y - (this.scrollRail.railHeight / this.thumbdivisor / 2);

            this.scrollThumb.move(this.scrollThumb.x, newY);
            const wasSnapped = this.snapToTop();

            if ((currentY !== newY) && (!wasSnapped)) {
                changeAction(new EventArgs(this.upButton, new PressedWidgetState(), Direction.UP));
            }
        });

        this.downButton.onClick((buttonState: EventArgs) => {
            const currentY = this.scrollThumb.y;
            const newY = this.scrollThumb.y + (this.scrollRail.railHeight / this.thumbdivisor / 2);

            this.scrollThumb.move(this.scrollThumb.x, newY);
            const wasSnapped = this.snapToBottom();

            if ((currentY !== newY) && (!wasSnapped)) {
                changeAction(new EventArgs(this.downButton, new PressedWidgetState(), Direction.DOWN));
            }
        });

        this.scrollThumb.onDrag((widgetState: EventArgs) => {
            changeAction(new EventArgs(this.scrollThumb, new PressedWidgetState(), widgetState.itemRef));
        });

        this.scrollRail.onClick((railState: EventArgs) => {
            const {xPos, yPos} = railState.itemRef;
            const currentY = this.scrollThumb.y;
            this.scrollThumb.move(this.scrollThumb.x, yPos);

            this.snapToTop();
            this.snapToBottom();

            if (currentY > yPos) {
                changeAction(new EventArgs(this.scrollRail, new PressedWidgetState(), Direction.UP));
            } 
            else if (currentY < yPos) {
                changeAction(new EventArgs(this.scrollRail, new PressedWidgetState(), Direction.DOWN));
            }
        });
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        this.scrollRail = new ScrollRail(this.parent as Window);
        this.scrollRail.railHeight = this.defaultHeight;
        this.scrollRail.railWidth = this.defaultWidth;

        this.upButton = new Button(this.parent as Window);
        this.upButton.buttonWidth = this.defaultWidth;
        this.upButton.buttonHeight = 20;
        this.upButton.label = "^";

        this.downButton = new Button(this.parent as Window);
        this.downButton.buttonWidth = this.defaultWidth;
        this.downButton.buttonHeight = 20;
        this.downButton.label = "v";

        this.scrollThumb = new ScrollThumb(this.parent as Window, +this.outerSvg.y(), +this.outerSvg.y() + this.scrollRail.railHeight);
        this.scrollThumb.thumbWidth = this.defaultWidth;
        this.scrollThumb.thumbHeight = this.scrollRail.railHeight / this.thumbdivisor;
        
        this.scrollRail.move(+this.outerSvg.x(), +this.outerSvg.y());
        this.upButton.move(+this.outerSvg.x(), +this.outerSvg.y() - this.upButton.buttonHeight);
        this.downButton.move(+this.outerSvg.x(), +this.outerSvg.y() + this.scrollRail.railHeight);
        this.scrollThumb.move(+this.outerSvg.x(), +this.outerSvg.y() );
    }

    override move(x: number, y: number): void {
        super.move(x, y);

        this.scrollRail.move(x, y);
        this.upButton.move(x, y - this.upButton.buttonHeight);
        this.downButton.move(x, y + this.scrollRail.railHeight);

        this.scrollThumb.move(x, y );
        this.scrollThumb.minimumScroll = y;
        this.scrollThumb.maximumScroll = y + this.scrollRail.railHeight - this.downButton.buttonHeight;

        this.update();
    }

    idleupState(): void {
        // unimplemented
    }
    idledownState(): void {
        // unimplemented
    }
    pressedState(): void {
        // unimplemented
    }
    pressReleaseState(): void {
        // unimplemented
    }
    hoverState(): void {
        // unimplemented
    }
    hoverPressedState(): void {
        // unimplemented
    }
    pressedoutState(): void {
        // unimplemented
    }
    moveState(): void {
        // unimplemented
    }
    keyupState(keyEvent?: KeyboardEvent): void {
        // unimplemented
    }

}

export {ScrollBar};