// importing local code, code we have written
import { Gradient } from "@svgdotjs/svg.js";
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";

class Button extends Widget{
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "Button";
    private defaultFontSize: number = 18;
    private defaultSize: number = 80;
    private eventRect: Rect;

    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultSize;
        this.width = this.defaultSize;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        // set Aria role
        this.role = RoleType.button;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        // prevent text selection
        this.selectable = false;
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

    set buttonWidth(newSize: number) {
        this.width = newSize;
        this.update();
    }

    get buttonWidth(): number {
        return this.width;
    }

    set buttonHeight(newSize: number) {
        this.height = newSize;
        this.update();
    }

    get buttonHeight(): number {
        return this.height;
    }

    private positionText() {
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._text.x(+this._rect.x() + ((this.width - this._text.length()) / 2));

        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("black");
        this._text = this._group.text(this._input);

        this._backcolor = "green";
        

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
        if(this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }
            
        if(this._rect != null) {
            this._rect.fill(this.backcolor);
            this._rect.width(this.width);
            this._rect.height(this.height);
            this.eventRect.width(this.width);
            this.eventRect.height(this.height);
        }
            
        super.update();
    }
    
    pressReleaseState(): void {
        let radial = this._group.gradient('radial', (add: Gradient) => {
            add.stop(0, 'blue');
            add.stop(1, 'green');
        });
        this._rect.fill(radial);

        if (this.previousState instanceof PressedWidgetState)
            this.raise(new EventArgs(this));
    }

    onClick(buttonAction: {(buttonState: EventArgs): void}): void {
        this.attach(() => {
            buttonAction(new EventArgs(this));
        });
    }
 
    idleupState(): void {
        this.backcolor = "green";
    }
    idledownState(): void {
        // unimplemented
    }
    pressedState(): void {
        // unimplemented
    }
    hoverState(): void {
        this.backcolor = "blue";
    }
    hoverPressedState(): void {
        // unimplemented
    }
    pressedoutState(): void {
        this.backcolor = "green";
    }
    moveState(): void {
        // unimplemented
    }
    keyupState(keyEvent?: KeyboardEvent): void {
        // unimplemented
    }
}

export {Button}