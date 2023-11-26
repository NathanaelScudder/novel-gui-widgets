import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";

class RadioButton extends Widget {
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "Radio Button";
    private defaultFontSize: number = 18;
    private defaultSize: number = 18;
    private eventRect: Rect;
    private buttonID: number;
    private buttonState: boolean;

    constructor(parent:Window, buttonID: number) {
        super(parent);
        this.buttonID = buttonID;

        // set defaults
        this.height = this.defaultSize;
        this.width = this.defaultSize;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        // set Aria role
        this.role = RoleType.radio;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        this.buttonState = false;
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

    set size(newSize: number) {
        this.width = newSize;
        this.height = newSize;
        this.update();
    }

    get size(): number {
        return this.width;
    }

    set activeState(newState: boolean) {
        this.buttonState = newState;
        this.update();
    }

    get activeState(): boolean {
        return this.buttonState;
    }

    private positionText() {
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._text.x(+this._rect.x() + (+this._rect.width()) + 10);

        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }

    override update(): void {
        if (this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }
            
        if (this._rect != null) {
            this._rect.fill(this.backcolor);
            this._rect.width(this.width);
            this._rect.height(this.height);
            this.eventRect.width(this.width);
            this.eventRect.height(this.height);
            this.eventRect.radius(this.width);
        }

        if (this._backcolor != null) {
            this._backcolor = (this.activeState) ? "green" : "gray";
        }

        super.update();
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height).radius(this.width);
        this._rect.stroke("black");
        this._text = this._group.text(this._input);

        this._backcolor = "gray";
        

        // Set the outer svg element 
        this.outerSvg = this._group;
        // Add a transparent rect on top of text to 
        // prevent selection cursor and to handle mouse events
        this.eventRect = this._group.rect(this.width, this.height).radius(this.width).opacity(0).attr('id', 0);

        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this.eventRect);
    }

    onClick(buttonAction: {(buttonState: EventArgs): void}): void {
        this.attach(() => {
            buttonAction(new EventArgs(this, new PressedWidgetState(),
             {"id": this.buttonID, "state": this.buttonState}));
        });
    }

    idleupState(): void {
        if (this.buttonState) {
            this.backcolor = "green";
        }
        else {
            this.backcolor = "gray";
        }
    }

    idledownState(): void {
        // unimplemented
    }

    pressedState(): void {
        // unimplemented
    }

    pressReleaseState(): void {
        this.buttonState = !this.buttonState;
        
        if (this.buttonState) {
            this.backcolor = "green";
        }
        else {
            this.backcolor = "gray";
        }

        if (this.previousState instanceof PressedWidgetState)
            this.raise(new EventArgs(this));
    }

    hoverState(): void {
        if (this.buttonState) {
            this.backcolor = "red";
        }
        else {
            this.backcolor = "blue";
        }
    }

    hoverPressedState(): void {
        // unimplemented
    }

    pressedoutState(): void {
        if (this.buttonState) {
            this.backcolor = "green";
        }
        else {
            this.backcolor = "gray";
        }
    }

    moveState(): void {
        // unimplemented
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        // unimplemented
    }
    
}

class RadioGroup extends Widget {
    private activeButton: number = -1;
    private numberOfRadioButtons: number;
    private buttons: RadioButton[] = [];

    constructor(parent:Window, numberOfRadioButtons: number) {
        super(parent);

        if (numberOfRadioButtons < 2) {
            this.numberOfRadioButtons = 2;
        }
        else {
            this.numberOfRadioButtons = numberOfRadioButtons;
        }

        // set Aria role
        this.role = RoleType.radiogroup;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
    }

    set fontSize(size:number) {
        this.buttons.forEach((nextButton: RadioButton) => {
            nextButton.fontSize = size;
        });
        this.update();
    }

    set label(text: string[]) {
        for(let i = 0; i < text.length && i < this.buttons.length; i++) {
            this.buttons[i].label = text[i];
        }
        this.update();
    }

    get label(): string[] {
        return this.buttons.map((nextButton: RadioButton) => {
            return nextButton.label;
        });
    }

    set radius(newRadius: number) {
        this.buttons.forEach((nextButton: RadioButton) => {
            nextButton.size = newRadius;
        });
        this.update();
    }

    get radius(): number {
        return this.buttons[0].size;
    }

    onClick(buttonAction: {(buttonState: EventArgs): void}): void {
        this.buttons.forEach((nextButton: RadioButton) => {
                nextButton.onClick((buttonState: EventArgs) => {
                    const {id, state} = buttonState.itemRef;
                    for(let i = 0; i < this.buttons.length; i++) {
                        this.buttons[i].activeState = i + 1 == id && state;
                        this.buttons[i].backcolor = (this.buttons[i].activeState) ? "green" : "gray";
                        buttonAction(new EventArgs(this.buttons[i], new PressedWidgetState(), {id: i + 1, state: this.buttons[i].activeState}));
                    }
                });
            });
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        for(let i = 0; i < this.numberOfRadioButtons; i++) {
            this.buttons.push(new RadioButton(this.parent as Window, i + 1));
        }

        for(let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].move(+this.outerSvg.x(), +this.outerSvg.y() + ( this.radius + 10) * i);
        }
    }

    override move(x: number, y: number): void {
        super.move(x, y);

        if (this.outerSvg != null)
        for(let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].move(x, y + ( this.radius + 10) * i);
        }

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

};

export {RadioGroup}