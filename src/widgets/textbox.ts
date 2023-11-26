import {HoverWidgetState, IdleUpWidgetState, KeypressWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";

class TextBox extends Widget {
    private static carrot: string = "|";
    private static backspace: string = "Backspace";

    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "";
    private defaultFontSize: number = 18;
    private defaultSize: number = 25;
    private eventRect: Rect;
    private maxText: number = 12;

    constructor(parent:Window) {
        super(parent);
        // set defaults
        this.height = this.defaultSize;
        this.width = this.defaultSize;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        // set Aria role
        this.role = RoleType.textbox;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
    }

    set label(text: string) {
        this._input = text;

        if (this.maxText < text.length) {
            this.size = text.length;
        }
        else {
            this.update();
        }
    }

    get label(): string {
        return this._input;
    }

    set size(maxText: number) {
        this.maxText = (maxText > 0) ? maxText : 1;

        let textWidthTool: Text = this._group.text("M".repeat(this.maxText + 1));
        this.width = +textWidthTool.node.clientWidth;
        textWidthTool.remove();

        this.update();
    }

    get size(): number {
        return this.maxText;
    }

    private positionText() {
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._text.x(+this._rect.x() + 10);

        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        let textWidthTool: Text = this._group.text("M");
        this.width = +textWidthTool.node.clientWidth * (this.maxText + 3);
        textWidthTool.remove();

        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("black");
        this._text = this._group.text(this._input);

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
        if (this._text != null) {
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
            this.eventRect.radius(this.width);
        }

        super.update();
    }

    onChange(changeAction: {(widgetState: EventArgs): void}): void {
        this.attach(() => {
            changeAction(new EventArgs(this, new KeypressWidgetState(),
             (this._input.includes(TextBox.carrot)) ? this._input.substring(0, this._input.length - TextBox.carrot.length) : this._input));
        });
    }

    idleupState(): void {
        if (this._input.includes(TextBox.carrot)) {
            this._input = this._input.substring(0, this._input.length - TextBox.carrot.length);
            this.update();
        }
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
        if (!this._input.includes(TextBox.carrot)) {
            this._input += TextBox.carrot;
            this.update();
        }
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
        if (!(this.previousState instanceof IdleUpWidgetState)) {
            return;
        }

        if (keyEvent.key === TextBox.backspace && this._input.length > TextBox.carrot.length) {
            if (this._input.length === TextBox.carrot.length + 1) {
                this._input = this._input.substring(1, this._input.length);
            }
            else {
                this._input = this._input.substring(0, this._input.length - TextBox.carrot.length - 1) + TextBox.carrot;
            }

            this.raise(new EventArgs(this));
        }
        else if (/^[a-zA-Z0-9]$/.test(keyEvent.key)) {
            let textWidthTool: Text = this._group.text("M");
            const maxWidth = +textWidthTool.node.clientWidth * (this.maxText - 1);
            let currentTextWidthTool: Text = this._group.text(this._input);
            const currentWidth = +currentTextWidthTool.node.clientWidth;

            if ((currentWidth + textWidthTool.node.clientWidth) < maxWidth) {
                this._input = this._input.substring(0, this._input.length - TextBox.carrot.length) + keyEvent.key + TextBox.carrot;
                this.raise(new EventArgs(this));
            }

            textWidthTool.remove();
            currentTextWidthTool.remove();
        }

        this.update();
    }
    
}

export {TextBox}